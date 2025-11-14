import uuid
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch

def generate_pdf(member_name: str, message_type: str, message_text: str) -> str:
    """
    Generate a PDF proposal document for a team member message.
    
    Args:
        member_name: Name of the team member
        message_type: Type of message (@clarify, @availability, @progress_update)
        message_text: Content of the message
        
    Returns:
        Relative file path to the generated PDF
    """
    # Create static/generated_pdfs directory if it doesn't exist
    pdf_dir = "static/generated_pdfs"
    os.makedirs(pdf_dir, exist_ok=True)
    
    # Generate unique filename
    filename = f"proposal_{uuid.uuid4()}.pdf"
    filepath = os.path.join(pdf_dir, filename)
    
    # Create PDF
    c = canvas.Canvas(filepath, pagesize=letter)
    width, height = letter
    
    # Title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "AI Proposal Document")
    
    # Team Member
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 100, "Team Member:")
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 120, member_name)
    
    # Message Type
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 160, "Type:")
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 180, message_type)
    
    # Message Text
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 220, "Message:")
    c.setFont("Helvetica", 12)
    
    # Handle long messages by wrapping text
    y_position = height - 240
    words = message_text.split()
    line = ""
    for word in words:
        test_line = line + word + " "
        if c.stringWidth(test_line, "Helvetica", 12) < width - 100:
            line = test_line
        else:
            if line:
                c.drawString(50, y_position, line.strip())
                y_position -= 20
            line = word + " "
    if line:
        c.drawString(50, y_position, line.strip())
    
    # Draft Suggestion
    y_position -= 40
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y_position, "Draft Suggestion:")
    y_position -= 20
    c.setFont("Helvetica", 12)
    c.drawString(50, y_position, "→ This is a mock proposal auto-generated for demo.")
    
    c.save()
    
    return f"/static/generated_pdfs/{filename}"

