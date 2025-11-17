from ast import Load
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models import mock_data
from models.mock_data import PROJECTS, AGENT_CONTEXT
from typing import Optional
from openai import OpenAI
import os
import logging
from pathlib import Path
import json
#
# pyright: ignore[reportMissingImports]
from dotenv import load_dotenv

# Load environment variables from .env file in parent directory
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)
api_key = os.getenv("OPENAI_API_KEY")
if api_key:
    # Remove quotes if present
    api_key = api_key.strip('"').strip("'")
client = OpenAI(api_key=api_key)
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


# Replace mock reply generation with OpenAI API for dynamic responses
# Add detailed logging for OpenAI API errors
@app.post("/clarify-reply")
def get_clarify_reply(request: ClarifyRequest):
    """Generate an AI reply based on documents for a clarify message."""
    # Build context from agent data
    context = f"""
    Project Context:
    {AGENT_CONTEXT['project_overview']}
    
    Available Documents:
    {json.dumps(AGENT_CONTEXT['technical_documents'], indent=2)}
    
    Team Member: {request.member_name}
    Member Info: {json.dumps(AGENT_CONTEXT['team_members'].get(request.member_name, {}), indent=2)}
    
    Message to clarify: {request.message_text}
    Selected Documents: {request.documents}
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant for a project management platform. Generate a clear, concise reply based on the project context and documents provided."},
                {"role": "user", "content": context}
            ],
            max_tokens=300
        )
        reply_text = response.choices[0].message.content.strip()
    except Exception as e:
        logging.error(f"OpenAI API error in /clarify-reply: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

    # Determine which documents were "used" (mock logic retained)
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


# Update suggestion endpoints to use OpenAI API
@app.post("/agent/suggestions/weekly-schedule")
def generate_weekly_schedule():
    """Generate a weekly schedule using OpenAI."""
    context = f"""
    Generate a detailed weekly schedule for the AI Red Team project based on this context:
    
    Project Info:
    {AGENT_CONTEXT['project_overview']}
    
    Team Members and Availability:
    {json.dumps(AGENT_CONTEXT['team_members'], indent=2)}
    
    Current Sprint Goals:
    {json.dumps(AGENT_CONTEXT['current_sprint_goals'], indent=2)}
    
    Agile Practices:
    {json.dumps(AGENT_CONTEXT['agile_practices'], indent=2)}
    
    Template to follow:
    {AGENT_CONTEXT['weekly_schedule_template']}
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates detailed weekly schedules for software development teams following agile practices."},
                {"role": "user", "content": context}
            ],
            max_tokens=400
        )
        return {"weekly_schedule": response.choices[0].message.content.strip()}
    except Exception as e:
        logging.error(f"OpenAI API error in /agent/suggestions/weekly-schedule: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")


@app.post("/agent/suggestions/progress-summary")
def summarize_progress():
    """Generate a progress summary using OpenAI."""
    context = f"""
    Generate a comprehensive progress summary for the AI Red Team project:
    
    Project Overview:
    {AGENT_CONTEXT['project_overview']}
    
    Team Members and Their Progress:
    {json.dumps(AGENT_CONTEXT['team_members'], indent=2)}
    
    Current Sprint Goals:
    {json.dumps(AGENT_CONTEXT['current_sprint_goals'], indent=2)}
    
    Recent Achievements:
    {json.dumps(AGENT_CONTEXT['recent_achievements'], indent=2)}
    
    Current Blockers:
    {json.dumps(AGENT_CONTEXT['common_blockers'], indent=2)}
    
    Project Milestones:
    {json.dumps(AGENT_CONTEXT['project_milestones'], indent=2)}
    
    Include: achievements, current progress, blockers, and next steps.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes project progress with a focus on achievements, current status, blockers, and next steps."},
                {"role": "user", "content": context}
            ],
            max_tokens=350
        )
        return {"progress_summary": response.choices[0].message.content.strip()}
    except Exception as e:
        logging.error(f"OpenAI API error in /agent/suggestions/progress-summary: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")


@app.post("/agent/suggestions/announcement")
def draft_announcement():
    """Generate a team announcement using OpenAI."""
    context = f"""
    Draft a professional team announcement for the AI Red Team project based on:
    
    Project Status:
    {AGENT_CONTEXT['project_overview']}
    
    Recent Achievements:
    {json.dumps(AGENT_CONTEXT['recent_achievements'], indent=2)}
    
    Current Sprint Goals:
    {json.dumps(AGENT_CONTEXT['current_sprint_goals'], indent=2)}
    
    Team Announcements/Reminders:
    {json.dumps(AGENT_CONTEXT['team_announcements'], indent=2)}
    
    Project Milestones:
    {json.dumps(AGENT_CONTEXT['project_milestones'], indent=2)}
    
    Format: Professional email-style announcement with subject, greeting, key updates, action items, and closing.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that drafts professional team announcements for software development projects."},
                {"role": "user", "content": context}
            ],
            max_tokens=400
        )
        return {
            "type": "text",
            "text": response.choices[0].message.content.strip()
        }
    except Exception as e:
        logging.error(f"OpenAI API error in /agent/suggestions/announcement: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")


@app.post("/agent/suggestions/availability-report")
def create_availability_report():
    """Generate an availability report using OpenAI."""
    context = f"""
    Generate a comprehensive team availability report for the AI Red Team project:
    
    Team Members and Availability:
    {json.dumps(AGENT_CONTEXT['team_members'], indent=2)}
    
    Availability Summary:
    {json.dumps(AGENT_CONTEXT['availability_summary'], indent=2)}
    
    Current Sprint Goals (to match availability with work):
    {json.dumps(AGENT_CONTEXT['current_sprint_goals'], indent=2)}
    
    Include: individual availability, total team capacity, recommendations for task allocation.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates team availability reports with insights and recommendations."},
                {"role": "user", "content": context}
            ],
            max_tokens=350
        )
        return {
            "type": "text",
            "text": response.choices[0].message.content.strip()
        }
    except Exception as e:
        logging.error(f"OpenAI API error in /agent/suggestions/availability-report: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")


@app.post("/agent/suggestions/blocker-escalation")
def draft_blocker_escalation():
    """Generate a blocker escalation note using OpenAI."""
    context = f"""
    Generate a professional blocker escalation note for the AI Red Team project:
    
    Current Blockers:
    {json.dumps(AGENT_CONTEXT['common_blockers'], indent=2)}
    
    Team Members and Their Blockers:
    {json.dumps(AGENT_CONTEXT['team_members'], indent=2)}
    
    Project Timeline:
    {AGENT_CONTEXT['project_overview']}
    
    Format should include: Priority, Date, Issue Summary, Impact, Requested Action, Escalated To, Expected Resolution.
    Focus on the most critical blocker affecting the team.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that drafts professional blocker escalation notes with clear impact analysis and action items."},
                {"role": "user", "content": context}
            ],
            max_tokens=350
        )
        return {
            "type": "text",
            "text": response.choices[0].message.content.strip()
        }
    except Exception as e:
        logging.error(f"OpenAI API error in /agent/suggestions/blocker-escalation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")


@app.post("/agent/action")
def agent_action(request: AgentActionRequest):
    """Handle freeform agent requests using OpenAI."""
    context = f"""
    Process this agent request with full project context:
    
    Request: {request.request}
    
    Project Context:
    {AGENT_CONTEXT['project_overview']}
    
    Team Members:
    {json.dumps(AGENT_CONTEXT['team_members'], indent=2)}
    
    Current Sprint Goals:
    {json.dumps(AGENT_CONTEXT['current_sprint_goals'], indent=2)}
    
    Available Documents:
    {json.dumps(AGENT_CONTEXT['technical_documents'], indent=2)}
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful AI project assistant that processes agent requests with full awareness of project context, team members, and current status."},
                {"role": "user", "content": context}
            ],
            max_tokens=300
        )
        return {"action_response": response.choices[0].message.content.strip()}
    except Exception as e:
        logging.error(f"OpenAI API error in /agent/action: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")


# Smart suggestions helper function
def smart_suggestions(request: dict):
    """Generate smart suggestions using OpenAI."""
    prompt = request.get("prompt", "")
    context = f"""
    Generate smart suggestions for the AI Red Team project:
    
    Request: {prompt}
    
    Project Context:
    {AGENT_CONTEXT['project_overview']}
    
    Current Sprint Goals:
    {json.dumps(AGENT_CONTEXT['current_sprint_goals'], indent=2)}
    
    Team Information:
    {json.dumps(AGENT_CONTEXT['team_members'], indent=2)}
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates smart, actionable suggestions for software development teams."},
                {"role": "user", "content": context}
            ],
            max_tokens=150
        )
        return {"suggestions": response.choices[0].message.content.strip()}
    except Exception as e:
        logging.error(f"OpenAI API error in smart_suggestions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

@app.post("/agent/memory-analysis")
def memory_analysis(request: dict):
    """Analyze memory using OpenAI."""
    prompt = request.get("prompt", "")
    context = f"""
    Analyze conversation memory and history for the AI Red Team project:
    
    Analysis Request: {prompt}
    
    Project Context:
    {AGENT_CONTEXT['project_overview']}
    
    Team Members and Activity:
    {json.dumps(AGENT_CONTEXT['team_members'], indent=2)}
    
    Recent Achievements:
    {json.dumps(AGENT_CONTEXT['recent_achievements'], indent=2)}
    
    Current Blockers:
    {json.dumps(AGENT_CONTEXT['common_blockers'], indent=2)}
    
    Provide insights on patterns, trends, and recommendations based on the memory/history.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that analyzes conversation history and provides insights on patterns, trends, and team dynamics."},
                {"role": "user", "content": context}
            ],
            max_tokens=300
        )
        return {"analysis": response.choices[0].message.content.strip()}
    except Exception as e:
        logging.error(f"OpenAI API error in /agent/memory-analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

@app.post("/agent/streaming-text")
def streaming_text(request: dict):
    """Generate streaming text using OpenAI."""
    prompt = request.get("prompt", "")
    context = f"""
    Generate streaming text response for the AI Red Team project:
    
    Request: {prompt}
    
    Project Context:
    {AGENT_CONTEXT['project_overview']}
    
    Team Members:
    {json.dumps(AGENT_CONTEXT['team_members'], indent=2)}
    
    Provide a concise, real-time response.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates concise, real-time text responses for project queries."},
                {"role": "user", "content": context}
            ],
            max_tokens=150
        )
        return {"streaming_text": response.choices[0].message.content.strip()}
    except Exception as e:
        logging.error(f"OpenAI API error in /agent/streaming-text: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

@app.post("/agent/interactive-chat")
def interactive_chat(request: dict):
    """Handle interactive chat using OpenAI."""
    prompt = request.get("prompt", "")
    context = f"""
    Interactive chat for the AI Red Team project:
    
    User Message: {prompt}
    
    Project Context:
    {AGENT_CONTEXT['project_overview']}
    
    Team Members:
    {json.dumps(AGENT_CONTEXT['team_members'], indent=2)}
    
    Recent Activity:
    {json.dumps(AGENT_CONTEXT['recent_achievements'], indent=2)}
    
    Respond in a conversational, helpful manner.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant for the AI Red Team project. Respond conversationally and helpfully to user queries."},
                {"role": "user", "content": context}
            ],
            max_tokens=200
        )
        return {"reply": response.choices[0].message.content.strip()}
    except Exception as e:
        logging.error(f"OpenAI API error in /agent/interactive-chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

@app.post("/agent/agentic-mode")
def agentic_mode(request: dict):
    """Enable agentic mode using OpenAI."""
    prompt = request.get("prompt", "")
    context = f"""
    Agentic mode request for autonomous task handling:
    
    Task/Request: {prompt}
    
    Project Context:
    {AGENT_CONTEXT['project_overview']}
    
    Team Members and Skills:
    {json.dumps(AGENT_CONTEXT['team_members'], indent=2)}
    
    Current Sprint Goals:
    {json.dumps(AGENT_CONTEXT['current_sprint_goals'], indent=2)}
    
    Current Blockers:
    {json.dumps(AGENT_CONTEXT['common_blockers'], indent=2)}
    
    As an autonomous agent, provide a complete action plan with steps, assigned team members, and expected outcomes.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an autonomous AI agent that can analyze tasks and create detailed action plans with team assignments and expected outcomes."},
                {"role": "user", "content": context}
            ],
            max_tokens=400
        )
        return {"agentic_mode": response.choices[0].message.content.strip()}
    except Exception as e:
        logging.error(f"OpenAI API error in /agent/agentic-mode: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

@app.post("/agent/generate-weekly-schedule")
def generate_weekly_schedule_endpoint(request: dict):
    """Generate weekly schedule using OpenAI."""
    prompt = request.get("prompt", "")
    context = f"""
    Generate a detailed weekly schedule for the AI Red Team project:
    
    Additional Requirements: {prompt}
    
    Team Availability:
    {json.dumps(AGENT_CONTEXT['availability_summary'], indent=2)}
    
    Team Member Details:
    {json.dumps(AGENT_CONTEXT['team_members'], indent=2)}
    
    Sprint Goals:
    {json.dumps(AGENT_CONTEXT['current_sprint_goals'], indent=2)}
    
    Agile Practices:
    {json.dumps(AGENT_CONTEXT['agile_practices'], indent=2)}
    
    Schedule Template:
    {AGENT_CONTEXT['weekly_schedule_template']}
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates detailed, practical weekly schedules for agile software development teams."},
                {"role": "user", "content": context}
            ],
            max_tokens=400
        )
        return {"weekly_schedule": response.choices[0].message.content.strip()}
    except Exception as e:
        logging.error(f"OpenAI API error in /agent/generate-weekly-schedule: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

@app.post("/agent/generate-reply")
def generate_reply(request: dict):
    """Generate reply using OpenAI."""
    prompt = request.get("prompt", "")
    context = f"""
    Generate a professional reply for the AI Red Team project:
    
    Message/Query: {prompt}
    
    Project Context:
    {AGENT_CONTEXT['project_overview']}
    
    Team Members:
    {json.dumps(AGENT_CONTEXT['team_members'], indent=2)}
    
    Available Documents:
    {json.dumps(AGENT_CONTEXT['technical_documents'], indent=2)}
    
    Recent Activity:
    {json.dumps(AGENT_CONTEXT['recent_achievements'], indent=2)}
    
    Generate a clear, helpful reply addressing the query.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates clear, professional replies to project-related queries."},
                {"role": "user", "content": context}
            ],
            max_tokens=300
        )
        return {"reply": response.choices[0].message.content.strip()}
    except Exception as e:
        logging.error(f"OpenAI API error in /agent/generate-reply: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

