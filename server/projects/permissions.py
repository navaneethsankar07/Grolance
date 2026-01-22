from rest_framework.permissions import BasePermission

class IsClientUser(BasePermission):
    message = "Only Clients can create projects"

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.current_role == "client"
        )
    
class IsFreelancerUser(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_freelancer
        )