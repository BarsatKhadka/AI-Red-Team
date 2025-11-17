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
import asyncio
#
# pyright: ignore[reportMissingImports]
from dotenv import load_dotenv

# Load environment variables from .env file in parent directory
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Also try loading from backend/.env
backend_env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=backend_env_path)

api_key = os.getenv("OPENAI_API_KEY")
if api_key:
    # Remove quotes if present
    api_key = api_key.strip('"').strip("'")
    client = OpenAI(api_key=api_key)
else:
    # Create a dummy client that will fail gracefully when used
    # This allows the app to start without an API key, but endpoints will return errors
    client = None
    logging.warning("OPENAI_API_KEY not found. OpenAI features will not work. Set OPENAI_API_KEY in environment or .env file.")
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
    modification_prompt: Optional[str] = None
    previous_reply: Optional[str] = None


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
async def get_clarify_reply(request: ClarifyRequest):
    """Generate an AI reply using OpenAI - returns JSON with reply and source documents."""
    
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
    
    message = request.message_text
    message_lower = message.lower()
    
    # Extract key topics from the message to determine relevant documentation
    doc_sections = {
        'auth': {'doc': 'Technical Design Document', 'section': '3.2', 'page': '12'},
        'api': {'doc': 'Technical Design Document', 'section': '4.1', 'page': '18'},
        'database': {'doc': 'Technical Design Document', 'section': '5.3', 'page': '24'},
        'endpoint': {'doc': 'API Reference Guide', 'section': '2.4', 'page': '8'},
        'integration': {'doc': 'Integration Guide', 'section': '1.7', 'page': '15'},
        'testing': {'doc': 'Testing Standards', 'section': '6.2', 'page': '31'},
        'deployment': {'doc': 'Deployment Manual', 'section': '4.5', 'page': '22'},
    }
    
    # Determine which documentation to reference
    referenced_doc = None
    if any(word in message_lower for word in ['jwt', 'oauth', 'authentication', 'auth', 'token']):
        referenced_doc = doc_sections['auth']
    elif any(word in message_lower for word in ['api', 'endpoint', 'route']):
        referenced_doc = doc_sections['api']
    elif any(word in message_lower for word in ['database', 'schema', 'migration']):
        referenced_doc = doc_sections['database']
    elif any(word in message_lower for word in ['integration', 'connect']):
        referenced_doc = doc_sections['integration']
    elif any(word in message_lower for word in ['test', 'testing', 'qa']):
        referenced_doc = doc_sections['testing']
    elif any(word in message_lower for word in ['deploy', 'deployment', 'production']):
        referenced_doc = doc_sections['deployment']
    else:
        referenced_doc = {'doc': 'Technical Design Document', 'section': '3.2', 'page': '12'}
    
    # Build prompt - if modification_prompt exists, modify previous reply
    if request.modification_prompt and request.previous_reply:
        # Modify the previous reply - REPLACE it, don't append
        user_prompt = f"""You are a project assistant. Here is your previous reply to a team member:

Previous reply: "{request.previous_reply}"

The user wants you to modify this reply based on their request: {request.modification_prompt}

IMPORTANT: 
- Provide ONLY the modified version of the reply
- Do NOT include the previous reply or any explanation
- Feel free to add your own insights, suggestions, or additional helpful information if it makes the reply better
- Keep documentation references if relevant
- Make it natural and helpful

Provide the improved, modified reply:"""
    elif request.modification_prompt:
        # No previous reply, but modification requested - apply to new reply
        user_prompt = f"Team member {request.member_name} asks: \"{message}\"\n\nRespond as project assistant. Reference {referenced_doc['doc']} Section {referenced_doc['section']} (page {referenced_doc['page']}). Apply this style/change: {request.modification_prompt}. Be concise (2-3 sentences)."
    else:
        user_prompt = f"Team member {request.member_name} asks: \"{message}\"\n\nRespond as project assistant. Reference {referenced_doc['doc']} Section {referenced_doc['section']} (page {referenced_doc['page']}). Be concise (2-3 sentences)."
    
    system_prompt = "You are a project assistant. Give helpful, concise answers. Reference documentation with section/page numbers when relevant."
    
    # Always use OpenAI - no fallback
    try:
        # Log the request
        print(f"\n=== OPENAI REQUEST (/clarify-reply) ===")
        print(f"System: {system_prompt[:100]}...")
        print(f"User prompt length: {len(user_prompt)} chars")
        print(f"Modification prompt: {request.modification_prompt}")
        print(f"Previous reply length: {len(request.previous_reply) if request.previous_reply else 0} chars")
        if request.previous_reply:
            print(f"Previous reply preview: {request.previous_reply[:150]}...")
        print(f"Full user prompt:\n{user_prompt}")
        print("=" * 50)
        
        response = await asyncio.to_thread(
            client.chat.completions.create,
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=200,
            temperature=0.7
        )
        
        reply_text = response.choices[0].message.content.strip()
        source_docs = [referenced_doc['doc']]
        
        # Log the response
        print(f"\n=== OPENAI RESPONSE (/clarify-reply) ===")
        print(f"Reply: {reply_text}")
        print("=" * 50)
        
        return {
            "reply": reply_text,
            "sourceDocuments": source_docs
        }
    except Exception as e:
        logging.error(f"OpenAI API error in /clarify-reply: {str(e)}")
        print(f"\n=== OPENAI ERROR (/clarify-reply) ===")
        print(f"Error: {str(e)}")
        print("=" * 50)
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

@app.post("/clarify-reply-stream")
async def get_clarify_reply_stream(request: ClarifyRequest):
    """Stream AI reply directly from OpenAI API."""
    from fastapi.responses import StreamingResponse
    
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
    
    message = request.message_text
    message_lower = message.lower()
    
    # Extract key topics from the message to determine relevant documentation
    doc_sections = {
        'auth': {'doc': 'Technical Design Document', 'section': '3.2', 'page': '12'},
        'api': {'doc': 'Technical Design Document', 'section': '4.1', 'page': '18'},
        'database': {'doc': 'Technical Design Document', 'section': '5.3', 'page': '24'},
        'endpoint': {'doc': 'API Reference Guide', 'section': '2.4', 'page': '8'},
        'integration': {'doc': 'Integration Guide', 'section': '1.7', 'page': '15'},
        'testing': {'doc': 'Testing Standards', 'section': '6.2', 'page': '31'},
        'deployment': {'doc': 'Deployment Manual', 'section': '4.5', 'page': '22'},
    }
    
    # Determine which documentation to reference
    referenced_doc = None
    if any(word in message_lower for word in ['jwt', 'oauth', 'authentication', 'auth', 'token']):
        referenced_doc = doc_sections['auth']
    elif any(word in message_lower for word in ['api', 'endpoint', 'route']):
        referenced_doc = doc_sections['api']
    elif any(word in message_lower for word in ['database', 'schema', 'migration']):
        referenced_doc = doc_sections['database']
    elif any(word in message_lower for word in ['integration', 'connect']):
        referenced_doc = doc_sections['integration']
    elif any(word in message_lower for word in ['test', 'testing', 'qa']):
        referenced_doc = doc_sections['testing']
    elif any(word in message_lower for word in ['deploy', 'deployment', 'production']):
        referenced_doc = doc_sections['deployment']
    else:
        referenced_doc = {'doc': 'Technical Design Document', 'section': '3.2', 'page': '12'}
    
    # Build prompt - if modification_prompt exists, modify previous reply
    if request.modification_prompt and request.previous_reply:
        # Modify the previous reply - REPLACE it, don't append
        user_prompt = f"""You are a project assistant. Here is your previous reply to a team member:

Previous reply: "{request.previous_reply}"

The user wants you to modify this reply based on their request: {request.modification_prompt}

IMPORTANT: 
- Provide ONLY the modified version of the reply
- Do NOT include the previous reply or any explanation
- Feel free to add your own insights, suggestions, or additional helpful information if it makes the reply better
- Keep documentation references if relevant
- Make it natural and helpful

Provide the improved, modified reply:"""
    elif request.modification_prompt:
        # No previous reply, but modification requested - apply to new reply
        user_prompt = f"Team member {request.member_name} asks: \"{message}\"\n\nRespond as project assistant. Reference {referenced_doc['doc']} Section {referenced_doc['section']} (page {referenced_doc['page']}). Apply this style/change: {request.modification_prompt}. Be concise (2-3 sentences)."
    else:
        user_prompt = f"Team member {request.member_name} asks: \"{message}\"\n\nRespond as project assistant. Reference {referenced_doc['doc']} Section {referenced_doc['section']} (page {referenced_doc['page']}). Be concise (2-3 sentences)."
    
    system_prompt = "You are a project assistant. Give helpful, concise answers. Reference documentation with section/page numbers when relevant."
    
    async def generate():
        try:
            # Log the request
            print(f"\n=== OPENAI STREAMING REQUEST ===")
            print(f"System: {system_prompt[:100]}...")
            print(f"User prompt length: {len(user_prompt)} chars")
            print(f"Modification prompt: {request.modification_prompt}")
            print(f"Previous reply length: {len(request.previous_reply) if request.previous_reply else 0} chars")
            if request.previous_reply:
                print(f"Previous reply preview: {request.previous_reply[:150]}...")
            print(f"Full user prompt:\n{user_prompt}")
            print("=" * 50)
            
            # Call OpenAI streaming API directly (no asyncio.to_thread needed for streaming)
            stream = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=200,
                temperature=0.7,
                stream=True
            )
            
            full_response = ""
            # Yield chunks as they come from OpenAI
            for chunk in stream:
                if chunk.choices and len(chunk.choices) > 0:
                    delta = chunk.choices[0].delta
                    if delta and delta.content:
                        content = delta.content
                        full_response += content
                        yield content
            
            # Log the full response
            print(f"\n=== OPENAI STREAMING RESPONSE ===")
            print(f"Full response: {full_response}")
            print("=" * 50)
            
        except Exception as e:
            logging.error(f"OpenAI streaming error: {str(e)}")
            print(f"\n=== OPENAI STREAMING ERROR ===")
            print(f"Error: {str(e)}")
            print("=" * 50)
            error_msg = f"Error generating reply: {str(e)}"
            yield error_msg
    
    return StreamingResponse(generate(), media_type="text/plain")


# Update suggestion endpoints to use mock data for speed
@app.post("/agent/suggestions/weekly-schedule")
async def generate_weekly_schedule():
    """Generate a weekly schedule using mock data for fast response."""
    # Use mock data directly for speed - no API call needed
    team_members = AGENT_CONTEXT.get('team_members', {})
    sprint_goals = AGENT_CONTEXT.get('current_sprint_goals', [])
    availability = AGENT_CONTEXT.get('availability_summary', {})
    
    # Extract availability from team members
    availability_list = []
    for name, info in team_members.items():
        if 'availability' in info:
            availability_list.append(f"{name}: {info['availability']}")
    
    # Generate quick schedule from mock data
    schedule = f"""**Weekly Schedule - AI Red Team**

**Monday:**
- Standup: 10:00 AM
- {sprint_goals[0] if sprint_goals else 'Sprint planning and task assignment'}
- {availability_list[0] if availability_list else 'Team availability check'}

**Tuesday-Wednesday:**
- Development focus: Backend API integration
- Code reviews scheduled
- {availability_list[1] if len(availability_list) > 1 else 'Team collaboration'}

**Thursday:**
- Mid-week sync: 2:00 PM
- Progress review
- {sprint_goals[1] if len(sprint_goals) > 1 else 'Task updates'}

**Friday:**
- Sprint review: 3:00 PM
- Retrospective: 4:00 PM
- Next week planning

**Team Availability:**
{chr(10).join(availability_list[:3]) if availability_list else 'All team members available'}
"""
    
    return {"weekly_schedule": schedule}


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
    
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
    
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
    
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
    
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
    
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
    
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
    
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
    
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
    
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
    
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
    
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
    
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
    
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
    
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

@app.post("/streaming-text")
async def streaming_text(request: dict):
    """Generate streaming text using OpenAI API."""
    from fastapi.responses import StreamingResponse
    
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
    
    text = request.get("text", "")[:500]  # Get the actual text, not just lowercased
    
    system_prompt = "You are a project assistant. Give helpful, concise answers. Reference documentation with section/page numbers when relevant."
    user_prompt = f"Team member asks: \"{text}\"\n\nRespond as project assistant. Be concise (2-3 sentences) and helpful."
    
    async def generate():
        try:
            print(f"\n=== OPENAI STREAMING REQUEST (/streaming-text) ===")
            print(f"Text: {text[:200]}...")
            print("=" * 50)
            
            # Call OpenAI streaming API
            stream = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=200,
                temperature=0.7,
                stream=True
            )
            
            full_response = ""
            # Yield chunks as they come from OpenAI
            for chunk in stream:
                if chunk.choices and len(chunk.choices) > 0:
                    delta = chunk.choices[0].delta
                    if delta and delta.content:
                        content = delta.content
                        full_response += content
                        yield content
            
            print(f"\n=== OPENAI STREAMING RESPONSE (/streaming-text) ===")
            print(f"Full response: {full_response}")
            print("=" * 50)
            
        except Exception as e:
            logging.error(f"OpenAI streaming error in /streaming-text: {str(e)}")
            print(f"\n=== OPENAI STREAMING ERROR (/streaming-text) ===")
            print(f"Error: {str(e)}")
            print("=" * 50)
            error_msg = f"Error generating reply: {str(e)}"
            yield error_msg
    
    return StreamingResponse(generate(), media_type="text/plain")

@app.post("/agent/streaming-text")
async def agent_streaming_text(request: dict):
    """Generate streaming text using OpenAI."""
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
    
    prompt = request.get("prompt", "")[:500]
    context = f"Project: AI Red Team. Request: {prompt}. Generate concise response (2-3 sentences)."
    
    try:
        print(f"\n=== OPENAI REQUEST (/agent/streaming-text) ===")
        print(f"Prompt: {prompt[:200]}...")
        print("=" * 50)
        
        response = await asyncio.to_thread(
            client.chat.completions.create,
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a project assistant. Give helpful, concise answers."},
                {"role": "user", "content": context}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        reply = response.choices[0].message.content.strip()
        
        print(f"\n=== OPENAI RESPONSE (/agent/streaming-text) ===")
        print(f"Reply: {reply}")
        print("=" * 50)
        
        return {"streaming_text": reply}
    except Exception as e:
        logging.error(f"OpenAI API error in /agent/streaming-text: {str(e)}")
        print(f"\n=== OPENAI ERROR (/agent/streaming-text) ===")
        print(f"Error: {str(e)}")
        print("=" * 50)
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
    
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
    
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
    
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
    
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
    
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
    
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
async def generate_reply(request: dict):
    """Generate reply using OpenAI API."""
    if not client:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
    
    prompt = request.get("prompt", "")[:500]
    message_text = request.get("message_text", "")
    member_name = request.get("member_name", "Team Member")
    
    # Build context-aware prompt
    if message_text:
        user_prompt = f"Team member {member_name} asks: \"{message_text}\"\n\nUser modification request: {prompt}\n\nRespond as project assistant. Be concise (2-3 sentences) and helpful."
    else:
        user_prompt = f"User request: \"{prompt}\"\n\nRespond as project assistant. Be concise (2-3 sentences) and helpful."
    
    system_prompt = "You are a project assistant. Give helpful, concise answers. Reference documentation with section/page numbers when relevant."
    
    try:
        print(f"\n=== OPENAI REQUEST (/agent/generate-reply) ===")
        print(f"Prompt: {prompt[:200]}...")
        print(f"Message text: {message_text[:200] if message_text else 'None'}...")
        print("=" * 50)
        
        response = await asyncio.to_thread(
            client.chat.completions.create,
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=200,
            temperature=0.7
        )
        
        reply = response.choices[0].message.content.strip()
        
        print(f"\n=== OPENAI RESPONSE (/agent/generate-reply) ===")
        print(f"Reply: {reply}")
        print("=" * 50)
        
        return {"reply": reply}
    except Exception as e:
        logging.error(f"OpenAI API error in /agent/generate-reply: {str(e)}")
        print(f"\n=== OPENAI ERROR (/agent/generate-reply) ===")
        print(f"Error: {str(e)}")
        print("=" * 50)
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

