from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models import mock_data
from typing import Optional

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



class ClarifyRequest(BaseModel):
    member_name: str
    message_type: str
    message_text: str
    project_name: str
    team_name: str
    documents: dict


class MessageRequest(BaseModel):
    message: dict


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = ""


class TeamCreate(BaseModel):
    name: str
    project_id: int


class MemberCreate(BaseModel):
    name: str
    team_id: int
    project_id: int


@app.get("/")
def root():
    return {"message": "Mock Team Message System API"}


@app.get("/health")
def health_check():
    """Health check endpoint to verify CORS is working."""
    return {"status": "ok", "cors": "enabled"}


@app.get("/projects")
def get_projects():
    """Get all projects with their teams and members."""
    return mock_data.PROJECTS


@app.get("/projects/{project_id}")
def get_project(project_id: int):
    """Get a specific project by ID."""
    project = next((p for p in mock_data.PROJECTS if p["id"] == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@app.post("/projects")
def create_project(project: ProjectCreate):
    """Create a new project."""
    new_project = {
        "id": mock_data._project_id_counter,
        "name": project.name,
        "description": project.description,
        "teams": []
    }
    mock_data.PROJECTS.append(new_project)
    mock_data._project_id_counter += 1
    return new_project


@app.post("/projects/{project_id}/teams")
def create_team(project_id: int, team: TeamCreate):
    """Create a new team in a project."""
    project = next((p for p in mock_data.PROJECTS if p["id"] == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    new_team = {
        "id": mock_data._team_id_counter,
        "name": team.name,
        "members": []
    }
    project["teams"].append(new_team)
    mock_data._team_id_counter += 1
    return new_team


@app.get("/projects/{project_id}/teams/{team_id}/members")
def get_team_members(project_id: int, team_id: int):
    """Get all members of a team."""
    project = next((p for p in mock_data.PROJECTS if p["id"] == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    team = next((t for t in project["teams"] if t["id"] == team_id), None)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    return team["members"]


# Legacy endpoint for backward compatibility
@app.get("/messages")
def get_messages():
    """Get all team members with their messages (legacy - flattens all projects)."""
    all_members = []
    for project in mock_data.PROJECTS:
        for team in project["teams"]:
            for member in team["members"]:
                all_members.append(member)
    return all_members


@app.post("/clarify-reply")
def get_clarify_reply(request: ClarifyRequest):
    """Generate an AI reply based on documents for a clarify message."""
    # Mock AI reply generation based on documents
    reply_text = generate_mock_reply(request.message_text, request.documents)
    
    # Determine which documents were "used" (mock)
    source_documents = []
    if request.documents.get("productDesignDocument"):
        source_documents.append("Product Design Document")
    if request.documents.get("technicalDesignDocument"):
        source_documents.append("Technical Design Document")
    if request.documents.get("projectOverview"):
        source_documents.append("Project Overview")
    if request.documents.get("requirements"):
        source_documents.append("Requirements")
    
    return {
        "reply": reply_text,
        "sourceDocuments": source_documents if source_documents else ["General project knowledge"]
    }


def generate_mock_reply(message_text: str, documents: dict) -> str:
    """Generate a mock AI reply based on the message and documents."""
    # Simple mock logic - in real implementation, this would use AI
    message_lower = message_text.lower()
    
    if "api" in message_lower or "integration" in message_lower:
        return """Based on the Product Design Document and Technical Design Document, the API integration should follow RESTful principles using FastAPI.

Key points:
- Use FastAPI for the backend framework
- Implement REST endpoints following the design specified in the TDD
- Authentication should use JWT tokens as outlined in the security section
- API responses should follow the standard format defined in the PDD

Please refer to Section 3.2 of the Technical Design Document for detailed integration guidelines."""
    
    elif "deadline" in message_lower or "shift" in message_lower:
        return """According to the Project Overview, the current timeline allows for minor adjustments if they don't impact critical path items.

For Task 5 specifically:
- The deadline can be shifted by 1 day as it's not on the critical path
- Please coordinate with the team lead to ensure no dependencies are affected
- Update the project tracking system once approved

This adjustment is acceptable per the project timeline guidelines."""
    
    elif "figma" in message_lower or "design" in message_lower or "xd" in message_lower:
        return """Based on the Product Design Document, the project uses Figma as the primary design tool.

Design guidelines:
- All UI/UX designs should be created in Figma
- Design system components are available in the shared Figma library
- Please use the design tokens specified in the PDD for consistency
- Export assets following the naming conventions in Section 2.4

The design workflow is documented in the Project Overview."""
    
    else:
        return f"""Based on the project documents, here's the information regarding your question:

{message_text}

Key considerations from the documentation:
- Please review the relevant sections in the Product Design Document
- Technical implementation details can be found in the Technical Design Document
- Project constraints and requirements are outlined in the Requirements document

If you need more specific information, please refer to the detailed documentation or reach out to the project lead."""


@app.post("/approve")
def approve_action(request: MessageRequest):
    """Mock endpoint to approve an action."""
    return {"status": "approved", "message": request.message}


@app.post("/reject")
def reject_action(request: MessageRequest):
    """Mock endpoint to reject an action."""
    return {"status": "rejected", "message": request.message}

