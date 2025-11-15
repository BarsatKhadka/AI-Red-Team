# Mock data structure: Projects -> Teams -> Team Members -> Messages
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
                            {"type": "@clarify", "text": "I need clarification on API integration task.", "source": "outlook"},
                            {"type": "@availability", "text": "I am available 10 hours this week.", "source": "slack"},
                            {"type": "@progress_update", "text": "Task 18 is 70% complete.", "source": "outlook"}
                        ]
                    },
                    {
                        "id": 2,
                        "name": "Bob",
                        "messages": [
                            {"type": "@availability", "text": "This week I can do 15 hours.", "source": "slack"},
                            {"type": "@clarify", "text": "Do we use FastAPI or Flask for the backend?", "source": "teams"}
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
                            {"type": "@progress_update", "text": "Task 10 is blocked due to missing API keys.", "source": "slack"}
                        ]
                    },
                    {
                        "id": 4,
                        "name": "Dana",
                        "messages": [
                            {"type": "@clarify", "text": "Can I shift Task 5 deadline by 1 day?", "source": "outlook"}
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

