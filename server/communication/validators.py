import re

def contains_contact_info(text):
    phone_pattern = r'(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})'
    email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    social_pattern = r'(whatsapp|telegram|instagram|insta|facebook|skype|number|email|phn|num|wtsp|tele|linkedin|http|https|@)'
    link_pattern = r'(([a-z0-9]+\.)*[a-z0-9]+\.[a-z]{2,}(?:\/[^\s]*)?)'
    if (re.search(phone_pattern, text) or 
       re.search(email_pattern, text, re.IGNORECASE) or 
       re.search(social_pattern, text, re.IGNORECASE) or
       re.search(link_pattern, text, re.IGNORECASE)):
        return True
    return False