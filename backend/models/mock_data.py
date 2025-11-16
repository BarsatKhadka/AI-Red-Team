# Mock data structure: Projects -> Teams -> Team Members -> Messages
from datetime import datetime, timedelta

# Calculate dates for messages (today, yesterday, 2 days ago, 3 days ago)
today = datetime.now().date()
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
