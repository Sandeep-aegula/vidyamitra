from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
import io

def generate_resume_pdf(data: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
    
    styles = getSampleStyleSheet()
    
    # Custom Styles
    name_style = ParagraphStyle(
        'NameStyle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.indigo,
        alignment=1, # Center
        spaceAfter=10
    )
    
    section_title_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.indigo,
        borderPadding=5,
        borderWidth=0,
        spaceBefore=12,
        spaceAfter=6,
        underlineWidth=1
    )
    
    normal_style = styles['Normal']
    
    story = []
    
    # Header
    personal = data.get('personal', {})
    story.append(Paragraph(f"{personal.get('firstName', '')} {personal.get('lastName', '')}", name_style))
    story.append(Paragraph(f"{personal.get('email', '')} | {personal.get('phone', '')}", styles['Normal']))
    story.append(Spacer(1, 12))
    
    # Summary
    if personal.get('summary'):
        story.append(Paragraph("PROFESSIONAL SUMMARY", section_title_style))
        story.append(Paragraph(personal.get('summary'), normal_style))
        story.append(Spacer(1, 12))
        
    # Experience
    if data.get('experience'):
        story.append(Paragraph("EXPERIENCE", section_title_style))
        for exp in data['experience']:
            story.append(Paragraph(f"<b>{exp.get('role', '')}</b> | {exp.get('company', '')}", normal_style))
            story.append(Paragraph(f"{exp.get('start', '')} - {exp.get('end', '')}", styles['Italic']))
            story.append(Paragraph(exp.get('description', ''), normal_style))
            story.append(Spacer(1, 8))
            
    # Education
    if data.get('education'):
        story.append(Paragraph("EDUCATION", section_title_style))
        for edu in data['education']:
            story.append(Paragraph(f"<b>{edu.get('degree', '')} in {edu.get('field', '')}</b>", normal_style))
            story.append(Paragraph(f"{edu.get('school', '')} | Graduated: {edu.get('year', '')}", normal_style))
            story.append(Spacer(1, 6))
            
    # Projects
    if data.get('projects'):
        story.append(Paragraph("PROJECTS", section_title_style))
        for proj in data['projects']:
            story.append(Paragraph(f"<b>{proj.get('title', '')}</b> | {proj.get('techStack', '')}", normal_style))
            story.append(Paragraph(proj.get('description', ''), normal_style))
            story.append(Spacer(1, 6))
            
    # Skills
    if data.get('skills'):
        story.append(Paragraph("SKILLS", section_title_style))
        skills_text = ", ".join(data['skills'])
        story.append(Paragraph(skills_text, normal_style))
        
    doc.build(story)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
