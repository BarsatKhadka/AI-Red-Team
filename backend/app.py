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
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods including OPTIONS
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
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


class AgentActionRequest(BaseModel):
    request: str


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


# Agent Suggestion Endpoints
@app.post("/agent/suggestions/weekly-schedule")
def generate_weekly_schedule():
    """Generate a mock weekly schedule."""
    return {
        "type": "text",
        "text": """Weekly Schedule Generated

Monday - Wednesday:
- Team standup: 9:00 AM
- Development sprint work
- Code reviews scheduled

Thursday:
- Mid-week check-in: 2:00 PM
- Documentation updates
- Testing phase begins

Friday:
- Weekly retrospective: 3:00 PM
- Planning for next week
- Deployment preparation

This schedule is based on current project timeline and team availability."""
    }


@app.post("/agent/suggestions/progress-summary")
def summarize_progress():
    """Generate a mock progress summary."""
    return {
        "type": "text",
        "text": """Progress Summary

Overall Completion: 68%
- Backend Team: 75% complete
- Frontend Team: 62% complete

Key Achievements:
✓ API endpoints implemented
✓ Authentication system deployed
✓ UI components library created

Current Blockers:
- 2 tasks waiting on external API access
- 1 design review pending

Next Steps:
- Complete integration testing
- Finalize documentation
- Prepare for deployment"""
    }


@app.post("/agent/suggestions/announcement")
def draft_announcement():
    """Generate a mock team announcement."""
    return {
        "type": "text",
        "text": """Team Announcement Draft

Subject: Weekly Update & Upcoming Milestones

Hi Team,

This week we've made significant progress on the project. We're currently at 68% completion and on track for our Q1 deadline.

Key Updates:
- Backend infrastructure is 75% complete
- Frontend components are being finalized
- Testing phase begins next week

Action Items:
- Please update your availability for next sprint
- Review the new API documentation
- Submit any blockers by EOD Friday

Let's keep up the great work!

Best regards,
Project Management Team"""
    }


@app.post("/agent/suggestions/availability-report")
def create_availability_report():
    """Generate a mock availability report."""
    return {
        "type": "text",
        "text": """Team Availability Report

Week of [Current Week]

Team Member Availability:
- Alice: 10 hours/week available
- Bob: 15 hours/week available
- Charlie: 12 hours/week available
- Dana: 8 hours/week available

Total Team Capacity: 45 hours/week

Recommendations:
- Schedule critical tasks during high-availability periods
- Consider redistributing workload for optimal coverage
- Plan for upcoming time-off requests"""
    }


@app.post("/agent/suggestions/blocker-escalation")
def draft_blocker_escalation():
    """Generate a mock blocker escalation note."""
    return {
        "type": "text",
        "text": """Blocker Escalation Note

Priority: High
Date: [Current Date]

Issue Summary:
Task 10 is currently blocked due to missing API keys for external service integration.

Impact:
- Delays integration testing phase
- Affects 3 dependent tasks
- May impact Q1 deadline

Requested Action:
- Obtain API credentials from external vendor
- Alternative: Provide mock service for development

Escalated To:
- Technical Lead
- Project Manager
- External Vendor Contact

Expected Resolution: [Date + 2 days]"""
    }


@app.post("/agent/action")
def agent_action(request: AgentActionRequest):
    """Handle freeform agent requests."""
    request_lower = request.request.lower()
    
    # Simple keyword-based routing for mock responses
    if "schedule" in request_lower or "calendar" in request_lower:
        return {
            "type": "text",
            "text": "I've analyzed the team's schedule. Based on current availability and project timeline, I recommend scheduling the sprint planning for Thursday at 2 PM when most team members are available."
        }
    elif "report" in request_lower or "summary" in request_lower:
        return {
            "type": "text",
            "text": "Here's a summary of the current project status: 68% complete overall, with backend at 75% and frontend at 62%. Two blockers identified, both expected to be resolved within 2 days."
        }
    elif "blocker" in request_lower or "issue" in request_lower:
        return {
            "type": "text",
            "text": "I've identified 2 active blockers: Task 10 is waiting on API keys, and Task 15 has a pending design review. Both have been escalated to the appropriate teams."
        }
    else:
        return {
            "type": "text",
            "text": f"I've processed your request: '{request.request}'. Based on the current project data and team status, I recommend reviewing the project documentation and coordinating with team leads for specific actions. Would you like me to generate a detailed action plan?"
        }

