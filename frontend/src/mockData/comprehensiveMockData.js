/**
 * Comprehensive Mock Data Module
 * Contains all mock data for the AI Red Team project
 */

// ============================================================================
// PROJECT FILES (10-15 files)
// ============================================================================
export const projectFiles = [
  {
    id: "pf-001",
    name: "System_Architecture_v3.pdf",
    type: "pdf",
    summary: "Comprehensive system architecture diagram showing microservices, API gateway, database clusters, and cloud infrastructure deployment strategy.",
    uploadedBy: "Sarah Chen",
    uploadDate: "2025-10-15T09:30:00Z"
  },
  {
    id: "pf-002",
    name: "API_Documentation.docx",
    type: "word",
    summary: "Complete REST API documentation including endpoints, authentication flows, request/response schemas, and error handling guidelines.",
    uploadedBy: "Mike Rodriguez",
    uploadDate: "2025-10-18T14:22:00Z"
  },
  {
    id: "pf-003",
    name: "Database_Schema_ERD.png",
    type: "image",
    summary: "Entity-relationship diagram showing all database tables, relationships, foreign keys, and indexing strategy for optimal query performance.",
    uploadedBy: "James Park",
    uploadDate: "2025-10-20T11:45:00Z"
  },
  {
    id: "pf-004",
    name: "Security_Audit_Report.pdf",
    type: "pdf",
    summary: "Third-party security assessment covering vulnerability scanning, penetration testing results, and recommended remediation steps.",
    uploadedBy: "Lisa Williams",
    uploadDate: "2025-10-22T16:10:00Z"
  },
  {
    id: "pf-005",
    name: "UI_Mockups_Collection.sketch",
    type: "design",
    summary: "Complete user interface designs for all major screens including dashboard, settings, reports, and mobile responsive layouts.",
    uploadedBy: "Emily Zhang",
    uploadDate: "2025-10-25T10:00:00Z"
  },
  {
    id: "pf-006",
    name: "Testing_Strategy.xlsx",
    type: "excel",
    summary: "Comprehensive test plan matrix covering unit tests, integration tests, E2E scenarios, performance benchmarks, and acceptance criteria.",
    uploadedBy: "Lisa Williams",
    uploadDate: "2025-10-28T13:30:00Z"
  },
  {
    id: "pf-007",
    name: "Sprint_Retrospective_Notes.md",
    type: "markdown",
    summary: "Team retrospective notes from Sprint 3 including what went well, areas for improvement, action items, and velocity metrics.",
    uploadedBy: "Sarah Chen",
    uploadDate: "2025-11-01T09:15:00Z"
  },
  {
    id: "pf-008",
    name: "Deployment_Runbook.pdf",
    type: "pdf",
    summary: "Step-by-step deployment procedures for production releases including rollback plans, health checks, and monitoring setup.",
    uploadedBy: "James Park",
    uploadDate: "2025-11-03T15:20:00Z"
  },
  {
    id: "pf-009",
    name: "User_Research_Findings.pptx",
    type: "powerpoint",
    summary: "User interview insights, personas, journey maps, pain points analysis, and feature prioritization recommendations.",
    uploadedBy: "Emily Zhang",
    uploadDate: "2025-11-05T11:00:00Z"
  },
  {
    id: "pf-010",
    name: "Performance_Optimization_Report.pdf",
    type: "pdf",
    summary: "Analysis of application performance bottlenecks, load testing results, caching strategies, and optimization recommendations.",
    uploadedBy: "Mike Rodriguez",
    uploadDate: "2025-11-07T14:45:00Z"
  },
  {
    id: "pf-011",
    name: "Integration_Specifications.docx",
    type: "word",
    summary: "Technical specifications for third-party integrations including OAuth flows, webhook configurations, and data sync protocols.",
    uploadedBy: "James Park",
    uploadDate: "2025-11-08T10:30:00Z"
  },
  {
    id: "pf-012",
    name: "Compliance_Checklist.pdf",
    type: "pdf",
    summary: "GDPR and SOC 2 compliance verification checklist with audit trail, data handling procedures, and privacy policy documentation.",
    uploadedBy: "Lisa Williams",
    uploadDate: "2025-11-10T16:00:00Z"
  },
  {
    id: "pf-013",
    name: "Feature_Roadmap_Q4.xlsx",
    type: "excel",
    summary: "Product roadmap for Q4 2025 including feature priorities, resource allocation, dependencies, and estimated delivery timelines.",
    uploadedBy: "Sarah Chen",
    uploadDate: "2025-11-12T09:45:00Z"
  },
  {
    id: "pf-014",
    name: "Incident_Response_Plan.pdf",
    type: "pdf",
    summary: "Disaster recovery and incident response procedures including escalation paths, communication templates, and post-mortem guidelines.",
    uploadedBy: "Mike Rodriguez",
    uploadDate: "2025-11-13T13:20:00Z"
  },
  {
    id: "pf-015",
    name: "Analytics_Dashboard_Metrics.png",
    type: "image",
    summary: "Screenshot of analytics dashboard showing key performance indicators, user engagement metrics, and conversion funnel analysis.",
    uploadedBy: "Emily Zhang",
    uploadDate: "2025-11-14T08:15:00Z"
  }
];

// ============================================================================
// DELIVERABLES (6-10 items)
// ============================================================================
export const deliverables = [
  {
    id: "deliv-001",
    title: "Sprint 4 Backend Implementation",
    fileName: "sprint4_backend_v1.zip",
    status: "Pending Review",
    uploadedBy: "Mike Rodriguez",
    uploadDate: "2025-11-10T14:30:00Z",
    aiSummaryPlaceholder: "This deliverable includes the complete backend implementation for Sprint 4, featuring 12 new REST API endpoints for user management, authentication flows, and data analytics. The implementation follows microservices architecture patterns with proper error handling, logging, and unit test coverage at 87%. Key additions include JWT-based authentication, rate limiting middleware, and PostgreSQL database migrations.",
    aiReviewPlaceholder: "✅ ALIGNMENT CHECK: This deliverable aligns well with project milestones M3 and M4. All required API endpoints are implemented. ⚠️ MINOR GAP: Unit test coverage is at 87%, slightly below the 90% target specified in the project plan. Recommendation: Add integration tests for the authentication flow to meet quality standards before final approval.",
    detailedSteps: [
      "Step 1: Analyzed code structure - follows MVC pattern correctly",
      "Step 2: Verified API endpoints against specification - 12/12 implemented",
      "Step 3: Checked test coverage - 87% (target: 90%)",
      "Step 4: Reviewed security implementation - JWT tokens, rate limiting present",
      "Step 5: Cross-referenced with project plan milestones M3 and M4 - aligned"
    ]
  },
  {
    id: "deliv-002",
    title: "UI/UX Design System",
    fileName: "design_system_v2.fig",
    status: "Approved",
    uploadedBy: "Emily Zhang",
    uploadDate: "2025-11-08T10:15:00Z",
    aiSummaryPlaceholder: "Comprehensive design system package including color palettes, typography scales, component library (buttons, forms, cards, modals), iconography set, and responsive grid system. All components are documented with usage guidelines and accessibility annotations. Includes both light and dark theme variants.",
    aiReviewPlaceholder: "✅ EXCELLENT ALIGNMENT: This deliverable exceeds project expectations. All design components specified in Milestone M2 are complete with additional accessibility features. The design system supports the planned mobile-first approach and includes comprehensive documentation. No gaps identified. Ready for implementation by development team.",
    detailedSteps: [
      "Step 1: Verified component library completeness - all 24 components present",
      "Step 2: Checked accessibility compliance - WCAG 2.1 AA standards met",
      "Step 3: Validated responsive breakpoints - matches technical spec",
      "Step 4: Reviewed documentation quality - comprehensive with examples",
      "Step 5: Cross-checked with M2 requirements - all criteria exceeded"
    ]
  },
  {
    id: "deliv-003",
    title: "Database Migration Scripts",
    fileName: "db_migrations_v1.sql",
    status: "Needs Revision",
    uploadedBy: "James Park",
    uploadDate: "2025-11-11T16:45:00Z",
    aiSummaryPlaceholder: "Database migration scripts for transitioning from legacy schema to new normalized structure. Includes data transformation logic, index creation, and rollback procedures. Covers 15 tables with approximately 2 million existing records to be migrated.",
    aiReviewPlaceholder: "⚠️ CRITICAL GAPS IDENTIFIED: While the migration structure is sound, several issues must be addressed: (1) Missing foreign key constraints on 3 tables, (2) No data validation checks before migration, (3) Rollback script incomplete - only covers 8 of 15 tables. ❌ DOES NOT MEET: Project plan requirement for zero-downtime migrations. Recommendation: Add transaction wrapping, implement blue-green deployment strategy, and complete rollback procedures.",
    detailedSteps: [
      "Step 1: Analyzed migration script structure - generally follows best practices",
      "Step 2: Identified missing foreign key constraints on user_sessions, activity_logs, and temp_data tables",
      "Step 3: Checked rollback completeness - only 8/15 tables covered",
      "Step 4: Reviewed downtime requirements - current approach requires 2-3 hour maintenance window",
      "Step 5: Compared with project plan - zero-downtime requirement not met"
    ]
  },
  {
    id: "deliv-004",
    title: "Mobile App Prototype",
    fileName: "mobile_app_beta.apk",
    status: "Pending Review",
    uploadedBy: "Emily Zhang",
    uploadDate: "2025-11-12T11:20:00Z",
    aiSummaryPlaceholder: "Beta version of mobile application for Android platform. Implements core features including user login, dashboard view, document upload, and push notifications. Built with React Native and follows Material Design guidelines. Tested on Android 11+ devices.",
    aiReviewPlaceholder: "✅ GOOD PROGRESS: Mobile app implements 80% of planned features from Milestone M5. UI follows design system guidelines. ⚠️ MINOR GAPS: (1) iOS version not included in this deliverable, (2) Offline mode functionality pending, (3) Performance optimization needed for document list scrolling. Recommendation: Address performance issues and clarify iOS delivery timeline before final approval.",
    detailedSteps: [
      "Step 1: Tested app installation and basic functionality - working correctly",
      "Step 2: Verified feature completeness - 8/10 core features implemented",
      "Step 3: Checked UI consistency with design system - 95% compliant",
      "Step 4: Performance testing - identified lag in document list (500+ items)",
      "Step 5: Cross-referenced M5 requirements - iOS version not present"
    ]
  },
  {
    id: "deliv-005",
    title: "Security Penetration Test Results",
    fileName: "pentest_report_final.pdf",
    status: "Approved",
    uploadedBy: "Lisa Williams",
    uploadDate: "2025-11-09T14:00:00Z",
    aiSummaryPlaceholder: "Comprehensive security assessment conducted by external security firm. Testing covered OWASP Top 10 vulnerabilities, authentication mechanisms, API security, database injection attempts, and infrastructure hardening. Report includes 23 findings categorized by severity with remediation recommendations.",
    aiReviewPlaceholder: "✅ EXCEEDS REQUIREMENTS: Security assessment is thorough and professional. All critical and high-severity findings have been remediated as evidenced by the retest results. Project plan required addressing critical issues only - this deliverable goes beyond by also fixing medium-severity items. Excellent work ensuring compliance with security milestone M6.",
    detailedSteps: [
      "Step 1: Reviewed test scope - covers all required attack vectors",
      "Step 2: Analyzed findings severity - 0 critical, 1 high, 5 medium, 17 low",
      "Step 3: Verified remediation status - all critical/high issues resolved",
      "Step 4: Checked compliance requirements - meets SOC 2 standards",
      "Step 5: Cross-referenced M6 security milestone - all criteria met"
    ]
  },
  {
    id: "deliv-006",
    title: "API Performance Optimization",
    fileName: "api_optimization_v2.zip",
    status: "Pending Review",
    uploadedBy: "Mike Rodriguez",
    uploadDate: "2025-11-13T09:30:00Z",
    aiSummaryPlaceholder: "Performance improvements for core API endpoints including database query optimization, Redis caching implementation, response compression, and connection pooling. Benchmark testing shows 65% reduction in average response time and 3x improvement in requests per second capacity.",
    aiReviewPlaceholder: "✅ STRONG PERFORMANCE GAINS: The optimization work delivers significant improvements. Response times now meet project plan targets (< 200ms for 95th percentile). ⚠️ CLARIFICATION NEEDED: Documentation mentions Redis caching but infrastructure deployment steps are not included. Recommendation: Approve with condition that Redis deployment guide is added to the runbook.",
    detailedSteps: [
      "Step 1: Reviewed benchmark results - 65% improvement verified",
      "Step 2: Analyzed code changes - proper indexing and N+1 query fixes present",
      "Step 3: Checked caching strategy - Redis implementation looks solid",
      "Step 4: Identified documentation gap - deployment steps missing",
      "Step 5: Verified performance targets - now meeting project plan SLAs"
    ]
  },
  {
    id: "deliv-007",
    title: "User Documentation Portal",
    fileName: "docs_portal_v1.zip",
    status: "Approved",
    uploadedBy: "Sarah Chen",
    uploadDate: "2025-11-07T15:45:00Z",
    aiSummaryPlaceholder: "Interactive documentation website built with Docusaurus including getting started guides, API reference, tutorials, FAQ section, and troubleshooting guides. Features search functionality, code examples, and video walkthroughs. Optimized for mobile viewing.",
    aiReviewPlaceholder: "✅ COMPREHENSIVE DOCUMENTATION: This deliverable provides excellent user-facing documentation covering all major features. Content is well-organized, searchable, and includes helpful examples. Meets all requirements from Milestone M7. The addition of video tutorials exceeds expectations. Ready for production deployment.",
    detailedSteps: [
      "Step 1: Tested documentation site functionality - all links working",
      "Step 2: Reviewed content completeness - covers all user-facing features",
      "Step 3: Verified search functionality - returns relevant results",
      "Step 4: Checked mobile responsiveness - renders correctly on all devices",
      "Step 5: Cross-referenced M7 documentation milestone - all criteria met"
    ]
  },
  {
    id: "deliv-008",
    title: "CI/CD Pipeline Configuration",
    fileName: "cicd_pipeline.yml",
    status: "Needs Revision",
    uploadedBy: "James Park",
    uploadDate: "2025-11-14T10:00:00Z",
    aiSummaryPlaceholder: "Automated CI/CD pipeline using GitHub Actions including build stages, automated testing, security scanning, and deployment to staging/production environments. Implements blue-green deployment strategy with automatic rollback on failure.",
    aiReviewPlaceholder: "⚠️ GOOD START, NEEDS WORK: Pipeline structure is solid but has several gaps: (1) Missing integration test stage, (2) Security scanning only runs on main branch (should run on all PRs), (3) No notification setup for failed builds. ⚠️ Project plan requires automated smoke tests post-deployment - not present. Recommendation: Add missing stages and implement notification webhooks before approval.",
    detailedSteps: [
      "Step 1: Reviewed pipeline stages - build and deploy present, testing incomplete",
      "Step 2: Checked security scanning configuration - runs only on main branch",
      "Step 3: Verified deployment strategy - blue-green implemented correctly",
      "Step 4: Identified missing smoke tests - required by project plan",
      "Step 5: Checked notification setup - not configured"
    ]
  }
];

// ============================================================================
// TEAM MEMBERS (avatars, roles, availability)
// ============================================================================
export const teamMembers = [
  {
    id: "tm-001",
    name: "Sarah Chen",
    role: "Project Manager",
    avatar: "https://i.pravatar.cc/150?img=1",
    email: "sarah.chen@company.com",
    availability: "Available",
    timezone: "PST (UTC-8)",
    workingHours: "9:00 AM - 5:00 PM",
    skills: ["Agile", "Scrum", "Stakeholder Management", "Risk Management"],
    currentTasks: ["Sprint Planning", "Stakeholder Updates", "Budget Review"]
  },
  {
    id: "tm-002",
    name: "Mike Rodriguez",
    role: "Backend Developer",
    avatar: "https://i.pravatar.cc/150?img=12",
    email: "mike.rodriguez@company.com",
    availability: "Busy - In Meeting",
    timezone: "EST (UTC-5)",
    workingHours: "8:00 AM - 4:00 PM",
    skills: ["Node.js", "Python", "PostgreSQL", "AWS", "Docker"],
    currentTasks: ["API Development", "Database Optimization", "Code Review"]
  },
  {
    id: "tm-003",
    name: "Emily Zhang",
    role: "UI/UX Designer",
    avatar: "https://i.pravatar.cc/150?img=5",
    email: "emily.zhang@company.com",
    availability: "Available",
    timezone: "CST (UTC-6)",
    workingHours: "10:00 AM - 6:00 PM",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    currentTasks: ["Mobile Mockups", "User Testing", "Design System Updates"]
  },
  {
    id: "tm-004",
    name: "James Park",
    role: "DevOps Engineer",
    avatar: "https://i.pravatar.cc/150?img=13",
    email: "james.park@company.com",
    availability: "On Leave - Returns Nov 20",
    timezone: "PST (UTC-8)",
    workingHours: "7:00 AM - 3:00 PM",
    skills: ["Kubernetes", "CI/CD", "Terraform", "Monitoring", "Shell Scripting"],
    currentTasks: ["Pipeline Setup", "Infrastructure as Code", "Monitoring Dashboard"]
  },
  {
    id: "tm-005",
    name: "Lisa Williams",
    role: "QA Lead",
    avatar: "https://i.pravatar.cc/150?img=9",
    email: "lisa.williams@company.com",
    availability: "Available",
    timezone: "EST (UTC-5)",
    workingHours: "9:00 AM - 5:00 PM",
    skills: ["Test Automation", "Selenium", "Jest", "Security Testing", "QA Strategy"],
    currentTasks: ["Test Plan Review", "Automated Testing", "Bug Triage"]
  },
  {
    id: "tm-006",
    name: "Alex Kumar",
    role: "Frontend Developer",
    avatar: "https://i.pravatar.cc/150?img=8",
    email: "alex.kumar@company.com",
    availability: "Available",
    timezone: "IST (UTC+5:30)",
    workingHours: "9:30 AM - 6:30 PM",
    skills: ["React", "TypeScript", "Tailwind CSS", "Redux", "Webpack"],
    currentTasks: ["Component Development", "State Management", "Performance Optimization"]
  },
  {
    id: "tm-007",
    name: "Maria Garcia",
    role: "Data Analyst",
    avatar: "https://i.pravatar.cc/150?img=10",
    email: "maria.garcia@company.com",
    availability: "Busy - Focus Time",
    timezone: "CET (UTC+1)",
    workingHours: "8:00 AM - 4:00 PM",
    skills: ["SQL", "Python", "Tableau", "Data Modeling", "Statistics"],
    currentTasks: ["Analytics Dashboard", "KPI Reporting", "Data Validation"]
  }
];

// ============================================================================
// PROJECT PLAN (milestones, expectations, risks)
// ============================================================================
export const projectPlan = {
  projectName: "AI Red Team Platform",
  startDate: "2025-09-01",
  targetEndDate: "2025-12-31",
  status: "In Progress",
  overallProgress: 62,
  
  milestones: [
    {
      id: "m1",
      name: "Project Kickoff & Requirements Gathering",
      description: "Initial planning, stakeholder alignment, and requirements documentation",
      targetDate: "2025-09-15",
      completedDate: "2025-09-14",
      status: "Completed",
      progress: 100,
      owner: "Sarah Chen",
      deliverables: ["Requirements Document", "Project Charter", "Risk Register"]
    },
    {
      id: "m2",
      name: "Design System & UI/UX Completion",
      description: "Finalize design system, component library, and user flow mockups",
      targetDate: "2025-10-01",
      completedDate: "2025-10-02",
      status: "Completed",
      progress: 100,
      owner: "Emily Zhang",
      deliverables: ["Design System", "UI Mockups", "Accessibility Audit"]
    },
    {
      id: "m3",
      name: "Backend API Development - Phase 1",
      description: "Core API endpoints, authentication, and database setup",
      targetDate: "2025-10-20",
      completedDate: "2025-10-21",
      status: "Completed",
      progress: 100,
      owner: "Mike Rodriguez",
      deliverables: ["API Documentation", "Authentication System", "Database Schema"]
    },
    {
      id: "m4",
      name: "Backend API Development - Phase 2",
      description: "Advanced features, integrations, and performance optimization",
      targetDate: "2025-11-05",
      completedDate: null,
      status: "In Progress",
      progress: 85,
      owner: "Mike Rodriguez",
      deliverables: ["Integration APIs", "Caching Layer", "Performance Report"]
    },
    {
      id: "m5",
      name: "Mobile App Development",
      description: "iOS and Android mobile application development",
      targetDate: "2025-11-15",
      completedDate: null,
      status: "In Progress",
      progress: 60,
      owner: "Emily Zhang",
      deliverables: ["Android App", "iOS App", "Mobile Testing Report"]
    },
    {
      id: "m6",
      name: "Security Audit & Compliance",
      description: "Third-party security assessment and compliance verification",
      targetDate: "2025-11-10",
      completedDate: "2025-11-09",
      status: "Completed",
      progress: 100,
      owner: "Lisa Williams",
      deliverables: ["Penetration Test Report", "Compliance Checklist", "Remediation Plan"]
    },
    {
      id: "m7",
      name: "Documentation & Training Materials",
      description: "User documentation, API docs, and training content",
      targetDate: "2025-11-20",
      completedDate: null,
      status: "In Progress",
      progress: 70,
      owner: "Sarah Chen",
      deliverables: ["User Guides", "API Reference", "Training Videos"]
    },
    {
      id: "m8",
      name: "CI/CD & Infrastructure Setup",
      description: "Automated deployment pipeline and cloud infrastructure",
      targetDate: "2025-11-25",
      completedDate: null,
      status: "At Risk",
      progress: 45,
      owner: "James Park",
      deliverables: ["CI/CD Pipeline", "Infrastructure as Code", "Deployment Runbook"]
    },
    {
      id: "m9",
      name: "Beta Testing & QA",
      description: "Comprehensive testing, bug fixes, and user acceptance testing",
      targetDate: "2025-12-10",
      completedDate: null,
      status: "Not Started",
      progress: 0,
      owner: "Lisa Williams",
      deliverables: ["Test Report", "Bug Resolution Summary", "UAT Sign-off"]
    },
    {
      id: "m10",
      name: "Production Launch",
      description: "Final deployment to production and go-live activities",
      targetDate: "2025-12-31",
      completedDate: null,
      status: "Not Started",
      progress: 0,
      owner: "Sarah Chen",
      deliverables: ["Production Deployment", "Launch Checklist", "Post-Launch Report"]
    }
  ],
  
  expectations: [
    {
      category: "Quality",
      items: [
        "90% or higher unit test coverage for all backend code",
        "Zero critical security vulnerabilities in production",
        "API response time < 200ms for 95th percentile",
        "Mobile app crash rate < 1% of sessions"
      ]
    },
    {
      category: "Timeline",
      items: [
        "All milestones delivered within 2 days of target date",
        "Weekly progress updates to stakeholders",
        "Sprint reviews every 2 weeks",
        "Production launch by December 31, 2025"
      ]
    },
    {
      category: "Scope",
      items: [
        "Complete feature parity across web and mobile platforms",
        "Support for 10,000+ concurrent users",
        "Multi-language support (English, Spanish, Mandarin)",
        "GDPR and SOC 2 compliance certified"
      ]
    },
    {
      category: "Budget",
      items: [
        "Total project budget: $500,000",
        "Monthly cloud infrastructure costs < $5,000",
        "No overtime costs exceeding 10% of labor budget",
        "External vendor costs stay within allocated $50,000"
      ]
    }
  ],
  
  risks: [
    {
      id: "risk-001",
      title: "DevOps Engineer Leave of Absence",
      description: "James Park on leave until Nov 20, impacting CI/CD milestone timeline",
      severity: "High",
      probability: "High",
      impact: "Milestone M8 may be delayed by 1-2 weeks",
      mitigation: "Cross-train Alex Kumar on DevOps tasks; consider temporary contractor",
      status: "Active",
      owner: "Sarah Chen"
    },
    {
      id: "risk-002",
      title: "Third-Party API Integration Delays",
      description: "External payment gateway API documentation incomplete",
      severity: "Medium",
      probability: "Medium",
      impact: "Payment features may need to be descoped from v1.0",
      mitigation: "Engage with vendor technical team; prepare fallback integration approach",
      status: "Monitoring",
      owner: "Mike Rodriguez"
    },
    {
      id: "risk-003",
      title: "Mobile App Store Approval Timeline",
      description: "App store review process can take 7-14 days, unpredictable timing",
      severity: "Medium",
      probability: "Medium",
      impact: "Launch date may need to account for approval delays",
      mitigation: "Submit apps 2 weeks before launch deadline; have backup manual distribution plan",
      status: "Monitoring",
      owner: "Emily Zhang"
    },
    {
      id: "risk-004",
      title: "Database Migration Complexity",
      description: "Legacy data migration more complex than initially estimated",
      severity: "High",
      probability: "Medium",
      impact: "Could require additional sprint to ensure data integrity",
      mitigation: "Allocate extra QA resources for data validation; consider phased migration approach",
      status: "Active",
      owner: "James Park"
    },
    {
      id: "risk-005",
      title: "Scope Creep from Stakeholders",
      description: "Additional feature requests emerging during development",
      severity: "Medium",
      probability: "High",
      impact: "Timeline and budget pressure if not managed properly",
      mitigation: "Strict change control process; maintain product backlog for v2.0 features",
      status: "Mitigated",
      owner: "Sarah Chen"
    }
  ]
};

// ============================================================================
// ACTIVITY FEED (messages, timestamps, labels, platforms)
// ============================================================================
export const activityFeed = [
  {
    id: "act-001",
    type: "message",
    platform: "Slack",
    author: "Mike Rodriguez",
    timestamp: "2025-11-14T10:30:00Z",
    label: "Backend Update",
    message: "Just pushed the performance optimization changes to the dev branch. Seeing 65% improvement in API response times! 🚀",
    reactions: ["👍", "🎉", "🔥"],
    threadCount: 3
  },
  {
    id: "act-002",
    type: "commit",
    platform: "GitHub",
    author: "Alex Kumar",
    timestamp: "2025-11-14T09:45:00Z",
    label: "Frontend",
    message: "feat: Add responsive navigation component with mobile menu",
    branch: "feature/responsive-nav",
    commitHash: "a3f2c1b"
  },
  {
    id: "act-003",
    type: "pr_review",
    platform: "GitHub",
    author: "Lisa Williams",
    timestamp: "2025-11-14T09:15:00Z",
    label: "Code Review",
    message: "Approved PR #234 - Test coverage looks great! Just one minor suggestion about error handling.",
    prNumber: 234,
    status: "approved"
  },
  {
    id: "act-004",
    type: "message",
    platform: "Teams",
    author: "Sarah Chen",
    timestamp: "2025-11-14T08:00:00Z",
    label: "Announcement",
    message: "Good morning team! Reminder: Sprint review is tomorrow at 2 PM. Please have your demos ready. 📊",
    reactions: ["✅", "👍"],
    mentions: ["@team"]
  },
  {
    id: "act-005",
    type: "issue_created",
    platform: "Jira",
    author: "Emily Zhang",
    timestamp: "2025-11-13T16:30:00Z",
    label: "Bug Report",
    message: "Created: Mobile app crashes on Android 11 when uploading images > 5MB",
    issueKey: "PROJ-456",
    priority: "High"
  },
  {
    id: "act-006",
    type: "deployment",
    platform: "AWS",
    author: "CI/CD Pipeline",
    timestamp: "2025-11-13T15:20:00Z",
    label: "Deployment",
    message: "Successfully deployed v2.3.1 to staging environment",
    environment: "staging",
    status: "success"
  },
  {
    id: "act-007",
    type: "message",
    platform: "Slack",
    author: "James Park",
    timestamp: "2025-11-13T14:00:00Z",
    label: "DevOps",
    message: "FYI - I'll be on leave until Nov 20. Alex will cover any urgent infrastructure issues. Contact info shared in #devops channel.",
    reactions: ["👋", "🌴"],
    threadCount: 5
  },
  {
    id: "act-008",
    type: "document_upload",
    platform: "SharePoint",
    author: "Lisa Williams",
    timestamp: "2025-11-13T11:30:00Z",
    label: "Documentation",
    message: "Uploaded: Security_Audit_Report_Final.pdf to the project drive",
    fileName: "Security_Audit_Report_Final.pdf",
    fileSize: "2.4 MB"
  },
  {
    id: "act-009",
    type: "meeting",
    platform: "Calendar",
    author: "Sarah Chen",
    timestamp: "2025-11-13T10:00:00Z",
    label: "Meeting Scheduled",
    message: "Scheduled: Sprint Planning - Nov 15 at 10:00 AM",
    attendees: ["Sarah Chen", "Mike Rodriguez", "Emily Zhang", "Lisa Williams", "Alex Kumar"],
    duration: "2 hours"
  },
  {
    id: "act-010",
    type: "message",
    platform: "Slack",
    author: "Emily Zhang",
    timestamp: "2025-11-12T16:45:00Z",
    label: "Design",
    message: "Mobile app beta is ready for testing! APK link in thread. Looking for feedback on the new dashboard design. 📱✨",
    reactions: ["🎨", "👀", "🙌"],
    threadCount: 8
  },
  {
    id: "act-011",
    type: "pr_merged",
    platform: "GitHub",
    author: "Mike Rodriguez",
    timestamp: "2025-11-12T14:20:00Z",
    label: "Merge",
    message: "Merged PR #231 - Add Redis caching layer for API endpoints",
    prNumber: 231,
    branch: "feature/redis-caching"
  },
  {
    id: "act-012",
    type: "message",
    platform: "Teams",
    author: "Maria Garcia",
    timestamp: "2025-11-12T11:00:00Z",
    label: "Analytics",
    message: "Latest metrics dashboard is live! User engagement is up 23% from last week. Check out the analytics portal for details.",
    reactions: ["📈", "🎯"],
    attachments: ["metrics_dashboard.png"]
  },
  {
    id: "act-013",
    type: "build_failed",
    platform: "GitHub Actions",
    author: "CI/CD Pipeline",
    timestamp: "2025-11-12T09:30:00Z",
    label: "Build Failure",
    message: "Build failed for branch feature/cicd-pipeline - linting errors detected",
    buildNumber: 1247,
    status: "failed"
  },
  {
    id: "act-014",
    type: "message",
    platform: "Slack",
    author: "Alex Kumar",
    timestamp: "2025-11-11T17:00:00Z",
    label: "Frontend",
    message: "Component library updates are complete! All components now support dark mode. 🌙",
    reactions: ["🌟", "👏", "🔥"],
    threadCount: 2
  },
  {
    id: "act-015",
    type: "issue_resolved",
    platform: "Jira",
    author: "Mike Rodriguez",
    timestamp: "2025-11-11T15:30:00Z",
    label: "Resolved",
    message: "Resolved: API timeout issues on /users endpoint - connection pooling implemented",
    issueKey: "PROJ-423",
    resolution: "Fixed"
  }
];

// Export all mock data
export default {
  projectFiles,
  deliverables,
  teamMembers,
  projectPlan,
  activityFeed
};
