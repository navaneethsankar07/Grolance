import os
from io import BytesIO
from django.template.loader import render_to_string
from xhtml2pdf import pisa
import cloudinary.uploader

def generate_contract_pdf(contract):
    context = {
        'contract': contract,
        'client': contract.client,
        'freelancer': contract.freelancer,
        'project': contract.project,
    }

    try:
        html_string = render_to_string('legal_pdf_template.html', context)
        result = BytesIO()
        
        pdf = pisa.pisaDocument(
            BytesIO(html_string.encode("UTF-8")), 
            result,
            encoding='utf-8'
        )
        
        if not pdf.err:
            pdf_payload = result.getvalue()
            
            if len(pdf_payload) < 100:
                return None

            upload_result = cloudinary.uploader.upload(
                pdf_payload, 
                resource_type="image", 
                folder="contracts/legal_docs/",
                public_id=f"contract_{contract.id}_legal",
                format="pdf",
                content_disposition=f'attachment; filename="Contract_{contract.id}.pdf"'
            )
            
            url = upload_result.get('secure_url')
            if url and not url.lower().endswith('.pdf'):
                url = f"{url}.pdf"
            
            return url
            
    except Exception as e:
        return None
    
    return None