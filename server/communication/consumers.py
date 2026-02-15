import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatRoom, Message, Notification
from django.db.models import Q
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from contracts.models import Contract
from .validators import contains_contact_info

User = get_user_model()

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            self.group_name = f"user_{self.user.id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event["content"]))

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_anonymous:
            await self.close()
            return

        self.room_id = self.scope['url_route']['kwargs']['room_id']
        is_participant = await self.check_room_access()
        if not is_participant:
            await self.close()
            return

        self.room_group_name = f'chat_{self.room_id}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
    
        await self.mark_all_read_in_room()
        await self.channel_layer.group_send(
            self.room_group_name,
            { 'type': 'all_read_update' }
        )

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        action_type = data.get('type')

        if action_type == 'delete_message':
            message_id = data.get('message_id')
            await self.channel_layer.group_send(
                self.room_group_name,
                { 'type': 'message_deleted', 'message_id': message_id }
            )
            return

        if action_type == 'typing':
            can_type = await self.can_send_message()
            if can_type:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    { 'type': 'user_typing', 'sender_id': self.user.id, 'is_typing': data.get('is_typing') }
                )
            return

        message_text = data.get('message')
        if not message_text:
            return

        if contains_contact_info(message_text):
            await self.send(text_data=json.dumps({ 'type': 'error', 'message': 'Sharing contact info is prohibited.' }))
            return

        can_chat = await self.can_send_message()
        if not can_chat:
            await self.send(text_data=json.dumps({ 'type': 'error', 'message': 'Contract ended.' }))
            return

        saved_msg = await self.save_message(self.room_id, self.user, message_text)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'id': saved_msg.id,
                    'text': saved_msg.text,
                    'sender_id': self.user.id,
                    'sender_role': saved_msg.sender_role,
                    'created_at': saved_msg.created_at.strftime("%H:%M"),
                }
            }
        )
        other_user = await self.get_other_user()
        if other_user:
            notification_group = f"user_{other_user.id}"
            await self.channel_layer.group_send(
                notification_group,
                {
                    "type": "send_notification", 
                    "content": {"type": "refresh_chat_counts"} 
                }
            )

    @database_sync_to_async
    def get_other_user(self):
        room = ChatRoom.objects.get(id=self.room_id)
        return room.participants.exclude(id=self.user.id).first()


    async def chat_message(self, event):
        message = event['message']
        if self.user.id != message['sender_id']:
            await self.mark_message_as_read(message['id'])
            await self.channel_layer.group_send(
                self.room_group_name,
                { 'type': 'read_receipt', 'message_id': message['id'] }
            )
    
        await self.send(text_data=json.dumps({ 'type': 'chat_message', 'message': message }))

    async def read_receipt(self, event):
        await self.send(text_data=json.dumps({ 'type': 'read_receipt', 'message_id': event['message_id'] }))

    async def all_read_update(self, event):
        await self.send(text_data=json.dumps({ 'type': 'all_read_update' }))

    async def message_deleted(self, event):
        await self.send(text_data=json.dumps({ 'type': 'delete', 'message_id': event['message_id'] }))

    async def user_typing(self, event):
        if self.user.id != event['sender_id']:
            await self.send(text_data=json.dumps({ 'type': 'typing', 'is_typing': event['is_typing'] }))

    @database_sync_to_async
    def mark_all_read_in_room(self):
        Message.objects.filter(room_id=self.room_id).exclude(sender=self.user).update(is_read=True)
        Notification.objects.filter(recipient=self.user, notification_type='new_message', related_id=self.room_id).update(is_read=True)

    @database_sync_to_async
    def mark_message_as_read(self, message_id):
        Message.objects.filter(id=message_id).update(is_read=True)
        Notification.objects.filter(recipient=self.user, notification_type='new_message', related_id=self.room_id).update(is_read=True)

    @database_sync_to_async
    def check_room_access(self):
        return ChatRoom.objects.filter(id=self.room_id, participants=self.user).exists()

    @database_sync_to_async
    def can_send_message(self):
        room = ChatRoom.objects.get(id=self.room_id)
        other_user = room.participants.exclude(id=self.user.id).first()
        if not other_user: return False
        return Contract.objects.filter(
            (Q(client=self.user) & Q(freelancer=other_user)) | (Q(client=other_user) & Q(freelancer=self.user))
        ).filter(status__in=['active', 'submitted', 'disputed']).exists()

    @database_sync_to_async
    def save_message(self, room_id, user, text):
        room = ChatRoom.objects.get(id=room_id)
        return Message.objects.create(room=room, sender=user, text=text, sender_role=user.current_role)