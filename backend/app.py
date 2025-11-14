from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from models.mock_data import TEAM_MEMBERS
from services.pdf_generator import generate_pdf
import os

app = FastAPI()

# CORS configuration - must be added before other middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Mount static files directory for serving PDFs
os.makedirs("static/generated_pdfs", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


class PDFRequest(BaseModel):
    member_name: str
    message_type: str
    message_text: str


class MessageRequest(BaseModel):
    message: dict


@app.get("/")
def root():
    return {"message": "Mock Team Message System API"}


@app.get("/health")
def health_check():
    """Health check endpoint to verify CORS is working."""
    return {"status": "ok", "cors": "enabled"}


@app.get("/messages")
def get_messages():
    """Get all team members with their messages."""
    return TEAM_MEMBERS


@app.post("/generate-pdf")
def create_pdf(request: PDFRequest):
    """Generate a PDF proposal for a selected message."""
    pdf_url = generate_pdf(
        member_name=request.member_name,
        message_type=request.message_type,
        message_text=request.message_text
    )
    return {"pdf_url": pdf_url}


@app.post("/approve")
def approve_action(request: MessageRequest):
    """Mock endpoint to approve an action."""
    return {"status": "approved", "message": request.message}


@app.post("/reject")
def reject_action(request: MessageRequest):
    """Mock endpoint to reject an action."""
    return {"status": "rejected", "message": request.message}

