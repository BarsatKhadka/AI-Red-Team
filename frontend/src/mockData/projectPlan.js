/**
 * Mock Project Plan
 * C. Project Plan - Milestones, deliverable expectations, and team roles
 */

export const projectPlan = {
  projectName: "AI Red Team Platform",
  startDate: "2025-10-01",
  endDate: "2025-12-15",
  
  milestones: [
    {
      id: "milestone-1",
      name: "Project Foundation & Setup",
      dueDate: "2025-10-15",
      description: "Initialize project infrastructure, setup development environment, and define data models",
      deliverables: ["Database schema", "Development environment setup", "Initial project documentation"],
      status: "completed"
    },
    {
      id: "milestone-2",
      name: "Backend API Development",
      dueDate: "2025-10-31",
      description: "Implement core backend API with authentication, CRUD operations, and database integration",
      deliverables: ["REST API endpoints", "Authentication system", "Database migrations"],
      status: "completed"
    },
    {
      id: "milestone-3",
      name: "Frontend UI Components",
      dueDate: "2025-11-10",
      description: "Build reusable UI components and implement responsive layouts for all screen sizes",
      deliverables: ["Component library", "Responsive dashboard", "Mobile-friendly layouts"],
      status: "in-progress"
    },
    {
      id: "milestone-4",
      name: "Testing & Quality Assurance",
      dueDate: "2025-11-20",
      description: "Develop comprehensive test suite and ensure code quality meets standards",
      deliverables: ["Unit tests", "Integration tests", "E2E test scenarios", "Test coverage report"],
      status: "in-progress"
    },
    {
      id: "milestone-5",
      name: "Performance Optimization",
      dueDate: "2025-11-28",
      description: "Optimize application performance, database queries, and implement caching strategies",
      deliverables: ["Performance benchmark report", "Database optimization", "Caching implementation"],
      status: "planned"
    },
    {
      id: "milestone-6",
      name: "Security & Compliance",
      dueDate: "2025-12-05",
      description: "Conduct security audit, implement security best practices, and ensure compliance",
      deliverables: ["Security audit report", "OWASP compliance checklist", "Vulnerability fixes"],
      status: "planned"
    },
    {
      id: "milestone-7",
      name: "Production Deployment",
      dueDate: "2025-12-15",
      description: "Deploy to production environment with monitoring, documentation, and handoff",
      deliverables: ["Production deployment", "User documentation", "Monitoring dashboard", "Team training"],
      status: "planned"
    }
  ],

  deliverableExpectations: [
    {
      category: "Code Deliverables",
      requirements: [
        "All code must follow established coding standards and style guide",
        "Minimum 80% test coverage for critical paths",
        "Code must pass linting and static analysis checks",
        "Include comprehensive inline documentation and comments",
        "Must include README with setup and usage instructions"
      ]
    },
    {
      category: "Documentation Deliverables",
      requirements: [
        "Technical specifications must align with approved architecture",
        "API documentation should include request/response examples",
        "All diagrams must be created using approved tools (Draw.io, Figma)",
        "Documentation should be version controlled in the repository",
        "Include change logs for all major updates"
      ]
    },
    {
      category: "Design Deliverables",
      requirements: [
        "UI/UX designs must follow the established design system",
        "Mockups should cover desktop, tablet, and mobile breakpoints",
        "Accessibility standards (WCAG 2.1 Level AA) must be met",
        "Include interactive prototypes for complex user flows",
        "Color contrast ratios must meet accessibility guidelines"
      ]
    },
    {
      category: "Testing Deliverables",
      requirements: [
        "Test plans must cover all critical user journeys",
        "Include both positive and negative test scenarios",
        "Performance tests should validate against defined benchmarks",
        "Security testing must cover OWASP Top 10 vulnerabilities",
        "Test results should be documented with screenshots and metrics"
      ]
    },
    {
      category: "Deployment Deliverables",
      requirements: [
        "Deployment scripts must be automated and repeatable",
        "Include rollback procedures for production deployments",
        "Environment configurations must be externalized",
        "Monitoring and alerting must be configured before go-live",
        "Disaster recovery procedures must be documented and tested"
      ]
    }
  ],

  teamRoles: [
    {
      role: "Project Manager",
      responsibilities: [
        "Overall project coordination and timeline management",
        "Stakeholder communication and reporting",
        "Risk management and issue resolution",
        "Resource allocation and budget tracking"
      ],
      requiredSkills: ["Agile methodologies", "Stakeholder management", "Risk assessment"]
    },
    {
      role: "Backend Developer",
      responsibilities: [
        "Design and implement REST API endpoints",
        "Database schema design and optimization",
        "Server-side business logic implementation",
        "API security and authentication"
      ],
      requiredSkills: ["Python/FastAPI", "PostgreSQL", "REST API design", "Security best practices"]
    },
    {
      role: "Frontend Developer",
      responsibilities: [
        "Build responsive user interfaces",
        "Implement component library and design system",
        "Integrate with backend APIs",
        "Optimize frontend performance"
      ],
      requiredSkills: ["React", "JavaScript/TypeScript", "CSS/Tailwind", "Responsive design"]
    },
    {
      role: "UI/UX Designer",
      responsibilities: [
        "Create user interface mockups and prototypes",
        "Develop design system and component library",
        "Conduct user research and usability testing",
        "Ensure accessibility compliance"
      ],
      requiredSkills: ["Figma", "User research", "Accessibility standards", "Visual design"]
    },
    {
      role: "QA Engineer",
      responsibilities: [
        "Develop and execute test plans",
        "Perform manual and automated testing",
        "Report and track defects",
        "Ensure quality standards are met"
      ],
      requiredSkills: ["Test automation", "Manual testing", "Bug tracking", "CI/CD integration"]
    },
    {
      role: "DevOps Engineer",
      responsibilities: [
        "Setup and maintain CI/CD pipelines",
        "Manage deployment infrastructure",
        "Implement monitoring and logging",
        "Ensure system reliability and scalability"
      ],
      requiredSkills: ["Docker", "CI/CD", "Cloud platforms", "Monitoring tools"]
    }
  ]
};
