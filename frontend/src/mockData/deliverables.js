/**
 * Mock Deliverables
 * B. Deliverables - 8 sample deliverables with realistic content
 */

export const deliverables = [
  {
    id: "deliv-001",
    title: "Sprint 1 Backend API Implementation",
    fileName: "Sprint1_Backend_API.zip",
    uploadedBy: "Mike Rodriguez",
    uploadDate: "2025-10-30T17:00:00Z",
    status: "Approved",
    aiSummaryPlaceholder: "Backend REST API with user authentication, data models, and CRUD operations for main entities. Includes JWT token implementation and PostgreSQL integration.",
    aiReviewPlaceholder: "Deliverable aligns well with Milestone 2 requirements. All authentication endpoints are implemented. Database schema matches the approved ERD. Minor issue: missing pagination on list endpoints.",
    comments: []
  },
  {
    id: "deliv-002",
    title: "UI Component Library",
    fileName: "Component_Library_v1.zip",
    uploadedBy: "Emily Zhang",
    uploadDate: "2025-11-02T12:30:00Z",
    status: "Pending Review",
    aiSummaryPlaceholder: "Reusable React components including buttons, forms, modals, cards, and navigation elements. Built with Tailwind CSS and follows the design system specifications.",
    aiReviewPlaceholder: "Components match the design mockups from the project plan. Accessibility features are present. Recommendation: add more comprehensive prop validation and Storybook documentation.",
    comments: []
  },
  {
    id: "deliv-003",
    title: "Database Migration Scripts",
    fileName: "DB_Migrations_Package.sql",
    uploadedBy: "James Park",
    uploadDate: "2025-11-04T09:45:00Z",
    status: "Approved",
    aiSummaryPlaceholder: "Complete database schema migrations with seed data for development and testing environments. Includes rollback scripts and indexes for performance optimization.",
    aiReviewPlaceholder: "Matches the Database ERD from project files. Migration scripts follow best practices with proper versioning. All foreign key constraints are properly defined per Milestone 1 requirements.",
    comments: []
  },
  {
    id: "deliv-004",
    title: "Mobile Responsive Dashboard",
    fileName: "Mobile_Dashboard_Build.zip",
    uploadedBy: "Emily Zhang",
    uploadDate: "2025-11-06T14:15:00Z",
    status: "Needs Revision",
    aiSummaryPlaceholder: "Responsive dashboard implementation supporting mobile, tablet, and desktop breakpoints. Includes data visualization charts and real-time updates.",
    aiReviewPlaceholder: "Good progress on Milestone 3 deliverable. Layout works well on most devices. Issues found: tablet breakpoint needs adjustment, some charts overflow on small screens. Team roles from project plan indicate designer should review.",
    comments: []
  },
  {
    id: "deliv-005",
    title: "Automated Test Suite",
    fileName: "Test_Suite_v1.zip",
    uploadedBy: "Lisa Williams",
    uploadDate: "2025-11-08T11:00:00Z",
    status: "Approved",
    aiSummaryPlaceholder: "Comprehensive test coverage including unit tests, integration tests, and end-to-end scenarios. Tests cover authentication, API endpoints, and critical user flows with 85% code coverage.",
    aiReviewPlaceholder: "Exceeds the testing requirements from Milestone 4. Code coverage meets the 80% target specified in deliverable expectations. All critical paths are covered. Integration with CI/CD pipeline is complete.",
    comments: []
  },
  {
    id: "deliv-006",
    title: "API Documentation Portal",
    fileName: "API_Docs_Site.zip",
    uploadedBy: "Mike Rodriguez",
    uploadDate: "2025-11-10T16:30:00Z",
    status: "Pending Review",
    aiSummaryPlaceholder: "Interactive API documentation built with Swagger/OpenAPI. Includes live playground, code examples in multiple languages, and authentication flow diagrams.",
    aiReviewPlaceholder: "Addresses documentation requirements from project plan deliverable expectations. All endpoints are documented. Suggestion: add more usage examples and error handling scenarios per team feedback.",
    comments: []
  },
  {
    id: "deliv-007",
    title: "Performance Optimization Report",
    fileName: "Performance_Report.pdf",
    uploadedBy: "James Park",
    uploadDate: "2025-11-11T13:20:00Z",
    status: "Approved",
    aiSummaryPlaceholder: "Analysis of application performance metrics including page load times, API response times, and database query optimization. Includes before/after benchmarks showing 40% improvement.",
    aiReviewPlaceholder: "Aligns with Milestone 5 optimization goals. Performance targets from project plan are met. Database indexing matches recommendations from technical specification. Load testing results look good.",
    comments: []
  },
  {
    id: "deliv-008",
    title: "Security Compliance Checklist",
    fileName: "Security_Compliance.docx",
    uploadedBy: "Lisa Williams",
    uploadDate: "2025-11-13T10:00:00Z",
    status: "Pending Review",
    aiSummaryPlaceholder: "Complete security audit covering OWASP Top 10, data encryption, authentication mechanisms, and compliance with industry standards. Includes remediation steps for identified vulnerabilities.",
    aiReviewPlaceholder: "Comprehensive coverage of security requirements from Milestone 6. All OWASP checks are complete. Cross-references the security audit report from project files. Minor gap: need to verify third-party dependency scanning.",
    comments: []
  }
];
