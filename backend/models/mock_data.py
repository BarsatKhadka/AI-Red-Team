# Mock data structure: Projects -> Teams -> Team Members -> Messages
from datetime import datetime, timedelta

# Set target date to November 19, 2024
target_date = datetime(2024, 11, 19).date()

# Calculate dates for messages (November 19, 18, 17, 16)
today = target_date
yesterday = today - timedelta(days=1)
two_days_ago = today - timedelta(days=2)
three_days_ago = today - timedelta(days=3)

PROJECTS = [
    {
        "id": 1,
        "name": "ai-red",
        "description": "AI Red Team Project",
        "teams": [
            {
                "id": 1,
                "name": "Backend Team",
                "members": [
                    {
                        "id": 1,
                        "name": "Alice",
                        "messages": [
                            # Today's message
                            {
                                "date": today.isoformat(),
                                "originalMessages": [
                                    {
                                        "text": "I need clarification on the API integration task. The documentation mentions Section 3.2 of the Technical Design Document, but I'm not sure about the authentication flow. Should I use JWT tokens or OAuth2? Task 18 is 70% complete. I've finished the database schema design and started implementing the API endpoints.",
                                        "source": "outlook"
                                    },
                                    {
                                        "text": "I am available 10 hours this week. I can work on Monday, Wednesday, and Friday afternoons. Let me know if you need me for any urgent tasks.",
                                        "source": "slack"
                                    }
                                ],
                                "source": "outlook",
                                "categorizedVersions": [
                                    {
                                        "type": "@clarify",
                                        "text": "I need clarification on the API integration task. The documentation mentions Section 3.2 of the Technical Design Document, but I'm not sure about the authentication flow. Should I use JWT tokens or OAuth2?",
                                        "source": "outlook"
                                    },
                                    {
                                        "type": "@availability",
                                        "text": "I am available 10 hours this week. I can work on Monday, Wednesday, and Friday afternoons. Let me know if you need me for any urgent tasks.",
                                        "source": "slack"
                                    },
                                    {
                                        "type": "@progress_update",
                                        "text": "Task 18 is 70% complete. I've finished the database schema design and started implementing the API endpoints. The authentication module is still pending.",
                                        "source": "outlook"
                                    }
                                ]
                            },
                            # Yesterday's message
                            {
                                "date": yesterday.isoformat(),
                                "originalMessages": [
                                    {
                                        "text": "The database migration is complete. All tests are passing. I've also updated the API documentation to reflect the new schema changes.",
                                        "source": "outlook"
                                    },
                                    {
                                        "text": "I can help with code review for the authentication module. Available for the next 2 hours.",
                                        "source": "slack"
                                    }
                                ],
                                "source": "outlook",
                                "categorizedVersions": [
                                    {
                                        "type": "@progress_update",
                                        "text": "The database migration is complete. All tests are passing. I've also updated the API documentation to reflect the new schema changes.",
                                        "source": "outlook"
                                    },
                                    {
                                        "type": "@availability",
                                        "text": "I can help with code review for the authentication module. Available for the next 2 hours.",
                                        "source": "slack"
                                    }
                                ]
                            },
                            # 2 days ago message
                            {
                                "date": two_days_ago.isoformat(),
                                "originalMessages": [
                                    {
                                        "text": "Found an issue with the rate limiting middleware. It's blocking legitimate requests. Need to adjust the threshold values.",
                                        "source": "outlook"
                                    },
                                    {
                                        "text": "Can someone clarify the expected response format for the user profile endpoint? Should it include nested objects?",
                                        "source": "slack"
                                    }
                                ],
                                "source": "outlook",
                                "categorizedVersions": [
                                    {
                                        "type": "@progress_update",
                                        "text": "Found an issue with the rate limiting middleware. It's blocking legitimate requests. Need to adjust the threshold values.",
                                        "source": "outlook"
                                    },
                                    {
                                        "type": "@clarify",
                                        "text": "Can someone clarify the expected response format for the user profile endpoint? Should it include nested objects?",
                                        "source": "slack"
                                    }
                                ]
                            },
                            # 3 days ago message
                            {
                                "date": three_days_ago.isoformat(),
                                "originalMessages": [
                                    {
                                        "text": "Started working on the user authentication service. The JWT token generation is working, but I need to implement refresh token logic.",
                                        "source": "outlook"
                                    },
                                    {
                                        "text": "Available 8 hours this week. Can focus on backend tasks if needed.",
                                        "source": "slack"
                                    }
                                ],
                                "source": "outlook",
                                "categorizedVersions": [
                                    {
                                        "type": "@progress_update",
                                        "text": "Started working on the user authentication service. The JWT token generation is working, but I need to implement refresh token logic.",
                                        "source": "outlook"
                                    },
                                    {
                                        "type": "@availability",
                                        "text": "Available 8 hours this week. Can focus on backend tasks if needed.",
                                        "source": "slack"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "name": "Bob",
                        "messages": [
                            {
                                "originalMessages": [
                                    {
                                        "text": "This week I can do 15 hours. I'm free most mornings and can also work late evenings if needed. Happy to help with any backend tasks.",
                                        "source": "slack"
                                    },
                                    {
                                        "text": "Do we use FastAPI or Flask for the backend? I see references to both in the codebase. Completed the user authentication service. All tests are passing.",
                                        "source": "outlook"
                                    }
                                ],
                                "source": "slack",
                                "categorizedVersions": [
                                    {
                                        "type": "@availability",
                                        "text": "This week I can do 15 hours. I'm free most mornings and can also work late evenings if needed. Happy to help with any backend tasks.",
                                        "source": "slack"
                                    },
                                    {
                                        "type": "@clarify",
                                        "text": "Do we use FastAPI or Flask for the backend? I see references to both in the codebase and want to make sure I'm using the right framework for the new endpoints.",
                                        "source": "teams"
                                    },
                                    {
                                        "type": "@progress_update",
                                        "text": "Completed the user authentication service. All tests are passing. Moving on to the authorization middleware next.",
                                        "source": "outlook"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "id": 2,
                "name": "Frontend Team",
                "members": [
                    {
                        "id": 3,
                        "name": "Charlie",
                        "messages": [
                            {
                                "originalMessages": [
                                    {
                                        "text": "Task 10 is blocked due to missing API keys. I've set up the UI components but can't test the integration without the backend credentials.",
                                        "source": "slack"
                                    },
                                    {
                                        "text": "What's the expected behavior for the error handling in the login form? Should we show inline errors or use toast notifications?",
                                        "source": "outlook"
                                    }
                                ],
                                "source": "slack",
                                "categorizedVersions": [
                                    {
                                        "type": "@progress_update",
                                        "text": "Task 10 is blocked due to missing API keys. I've set up the UI components but can't test the integration without the backend credentials. Can someone provide the test API keys?",
                                        "source": "slack"
                                    },
                                    {
                                        "type": "@clarify",
                                        "text": "What's the expected behavior for the error handling in the login form? Should we show inline errors or use toast notifications?",
                                        "source": "outlook"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "id": 4,
                        "name": "Dana",
                        "messages": [
                            {
                                "originalMessages": [
                                    {
                                        "text": "Can I shift Task 5 deadline by 1 day? I need more time to implement the responsive design properly across all breakpoints.",
                                        "source": "outlook"
                                    },
                                    {
                                        "text": "Available 12 hours this week for the dashboard redesign. Can focus on that if needed.",
                                        "source": "slack"
                                    }
                                ],
                                "source": "outlook",
                                "categorizedVersions": [
                                    {
                                        "type": "@clarify",
                                        "text": "Can I shift Task 5 deadline by 1 day? I need more time to implement the responsive design properly across all breakpoints.",
                                        "source": "outlook"
                                    },
                                    {
                                        "type": "@availability",
                                        "text": "Available 12 hours this week. Can focus on the dashboard redesign if needed.",
                                        "source": "slack"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
]

# Counter for generating new IDs
_project_id_counter = 2
_team_id_counter = 3
_member_id_counter = 5

# Agent context data for faster and more relevant responses
AGENT_CONTEXT = {
    "project_overview": """
    Project: AI Red Team
    Description: A comprehensive project management and collaboration platform with AI-powered features.
    Tech Stack: FastAPI (Backend), React + Vite (Frontend), OpenAI API Integration
    Team Size: 4 developers across 2 teams (Backend and Frontend)
    Current Sprint: Sprint 5 (Week 3 of 4)
    Overall Progress: 68% complete
    Target Launch: Q1 2026
    """,
    
    "team_members": {
        "Alice": {
            "role": "Senior Backend Developer",
            "current_tasks": ["API integration (Task 18)", "Database schema design", "Authentication module"],
            "availability": "10 hours/week (Mon, Wed, Fri afternoons)",
            "recent_progress": "Database schema complete, API endpoints in progress (70%)",
            "blockers": ["Unclear authentication flow - JWT vs OAuth2"],
            "skills": ["Python", "FastAPI", "PostgreSQL", "REST APIs"]
        },
        "Bob": {
            "role": "Backend Developer",
            "current_tasks": ["User authentication service", "Authorization middleware"],
            "availability": "15 hours/week (mornings and late evenings)",
            "recent_progress": "User authentication service completed, all tests passing",
            "blockers": ["Framework confusion - FastAPI vs Flask"],
            "skills": ["Python", "FastAPI", "Flask", "JWT", "Testing"]
        },
        "Charlie": {
            "role": "Frontend Developer",
            "current_tasks": ["UI components (Task 10)", "API integration testing"],
            "availability": "Variable",
            "recent_progress": "UI components setup complete",
            "blockers": ["Missing API keys for backend integration"],
            "skills": ["React", "TypeScript", "Tailwind CSS", "API Integration"]
        },
        "Dana": {
            "role": "Frontend Developer",
            "current_tasks": ["Dashboard redesign (Task 5)", "Responsive design implementation"],
            "availability": "12 hours/week",
            "recent_progress": "Dashboard layout in progress",
            "blockers": ["Need 1 day deadline extension for responsive design"],
            "skills": ["React", "CSS", "Responsive Design", "UI/UX"]
        }
    },
    
    "technical_documents": {
        "Product Design Document": "Outlines user stories, features, and business requirements for the AI Red Team platform.",
        "Technical Design Document": "Section 3.2 covers API authentication flows, recommends JWT for session management.",
        "Project Overview": "High-level project goals, timeline, and success metrics.",
        "Requirements": "Detailed functional and non-functional requirements including security and performance."
    },
    
    "current_sprint_goals": [
        "Complete API authentication implementation",
        "Finish backend integration for frontend components",
        "Implement responsive design for dashboard",
        "Resolve all blockers and API key distribution",
        "Achieve 80% code coverage with tests"
    ],
    
    "common_blockers": [
        "Missing API keys for testing",
        "Unclear authentication flow specifications",
        "Framework inconsistencies in codebase",
        "Tight deadlines for responsive design work"
    ],
    
    "project_milestones": [
        {"name": "Backend API Complete", "status": "75% done", "due": "End of Sprint 5"},
        {"name": "Frontend Integration", "status": "60% done", "due": "End of Sprint 6"},
        {"name": "Testing & QA", "status": "Not started", "due": "Sprint 7"},
        {"name": "Production Deploy", "status": "Not started", "due": "Q1 2026"}
    ],
    
    "recent_achievements": [
        "Database migration completed successfully",
        "User authentication service implemented",
        "API documentation updated",
        "All backend tests passing"
    ],
    
    "team_announcements": [
        "Weekly standup every Monday at 10 AM",
        "Code review required for all PRs before merge",
        "Update availability in Slack by Friday EOD",
        "Submit blockers to project manager immediately"
    ],
    
    "availability_summary": {
        "total_hours": 47,
        "Alice": 10,
        "Bob": 15,
        "Charlie": "Variable (not specified)",
        "Dana": 12
    },
    
    "weekly_schedule_template": """
    Monday:
    - 10:00 AM: Team Standup
    - 11:00 AM - 5:00 PM: Development work
    
    Tuesday-Thursday:
    - 9:00 AM - 5:00 PM: Development work
    - 3:00 PM: Optional pairing sessions
    
    Friday:
    - 9:00 AM - 3:00 PM: Development work
    - 3:00 PM: Sprint review and planning
    - EOD: Submit availability and blocker updates
    """,
    
    "agile_practices": {
        "methodology": "Scrum",
        "sprint_length": "2 weeks",
        "ceremonies": ["Daily standups", "Sprint planning", "Sprint review", "Retrospective"],
        "tools": ["Slack for communication", "Outlook for emails", "Teams for meetings"]
    }
}
