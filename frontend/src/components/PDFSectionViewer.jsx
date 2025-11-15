function PDFSectionViewer({ documentType, section, isVisible, onClose }) {
  if (!isVisible) return null;

  // Mock PDF content - looks like actual PDF pages
  const getPDFContent = (docType, sectionNum) => {
    const sections = {
      'Technical Design Document': {
        '3.2': {
          title: 'Technical Design Document',
          pages: [
            {
              content: `Technical Design Document
Version 1.0 | Last Updated: January 15, 2024

3. API Design and Integration

3.1 Overview
This chapter covers the overall API architecture and design principles
that should be followed throughout the system implementation.

3.2 API Integration Guidelines

This section outlines the detailed guidelines for integrating APIs within
the system architecture. All developers must adhere to these standards
to ensure consistency and maintainability.

RESTful Principles
All endpoints must follow REST conventions:
• Use appropriate HTTP methods (GET, POST, PUT, DELETE)
• Implement proper status codes (200, 201, 400, 401, 404, 500)
• Follow consistent URL patterns (/api/v1/resource)
• Use plural nouns for resource names

Authentication
The system uses JWT tokens for authentication:
• Tokens must be included in the Authorization header
• Format: Authorization: Bearer <token>
• Token expiration: 24 hours
• Refresh tokens available for extended sessions
• Invalid tokens return 401 Unauthorized

Response Format
All API responses must follow this standard format:

{
  "status": "success|error",
  "data": {},
  "message": "Optional descriptive message",
  "timestamp": "ISO 8601 format"
}

Error Handling
• Use appropriate HTTP status codes
• Include detailed error information in response body
• Log all errors for debugging and monitoring
• Never expose sensitive information in error messages

Rate Limiting
• 100 requests per minute per user
• 1000 requests per hour per user
• Exceeded limits return 429 Too Many Requests
• Include Retry-After header in rate limit responses

3.3 Security Considerations
[Content continues...]`
            }
          ]
        },
        '2.4': {
          title: 'Technical Design Document',
          pages: [
            {
              content: `Technical Design Document
Version 1.0 | Last Updated: January 15, 2024

2. Development Standards

2.1 Code Organization
[Previous sections...]

2.4 Naming Conventions

This section defines the naming conventions that must be followed
throughout the codebase to ensure consistency and readability.

File Naming
• Use kebab-case for all file names
• Prefix with component type (e.g., api-user-service.js)
• Include version numbers when applicable (v1, v2)
• Use descriptive names that indicate purpose

Code Naming
• Variables and functions: camelCase (e.g., getUserData)
• Classes and components: PascalCase (e.g., UserService)
• Constants: UPPER_SNAKE_CASE (e.g., MAX_RETRY_COUNT)
• Private methods: prefix with underscore (_internalMethod)

Database Naming
• Tables: plural, snake_case (e.g., user_profiles)
• Columns: snake_case (e.g., created_at, user_id)
• Indexes: idx_<table>_<column> (e.g., idx_users_email)

2.5 Documentation Standards
[Content continues...]`
            }
          ]
        }
      },
      'Product Design Document': {
        '2.4': {
          title: 'Product Design Document',
          pages: [
            {
              content: `Product Design Document
Version 1.0 | Last Updated: January 15, 2024

2. Design System

2.1 Introduction
[Previous sections...]

2.4 Design System and Tokens

This section defines the design tokens and system components that
ensure visual consistency across the entire product.

Color Palette
Primary Colors:
• Primary: #3B82F6 (Blue) - Main actions and links
• Secondary: #10B981 (Green) - Success states
• Accent: #F59E0B (Amber) - Warnings and highlights
• Background: #F9FAFB (Gray-50) - Page backgrounds

Typography
• Headings: Inter, Bold, sizes 24px-48px
• Body: Inter, Regular, sizes 14px-16px
• Code: Fira Code, Regular, size 14px
• Line height: 1.5 for body, 1.2 for headings

Spacing
Base unit: 4px
Standard spacing values:
• 8px - Tight spacing (between related elements)
• 16px - Standard spacing (between sections)
• 24px - Loose spacing (between major sections)
• 32px - Extra loose (page margins)

2.5 Component Library
[Content continues...]`
            }
          ]
        }
      }
    };

    return sections[docType]?.[sectionNum] || {
      title: docType,
      pages: [
        {
          content: `${docType}
Version 1.0

Section ${sectionNum}

Content for this section would appear here in the actual document.
This is a placeholder for section ${sectionNum} of the ${docType}.`
        }
      ]
    };
  };

  const pdfData = getPDFContent(documentType, section);

  // Highlight the entire section content
  const highlightSection = (text, sectionNum) => {
    const escapedSection = sectionNum.replace('.', '\\.');
    
    // Find the section header line (e.g., "3.2 API Integration Guidelines")
    const sectionHeaderRegex = new RegExp(`${escapedSection}[^\\n]*`, 'i');
    const headerMatch = text.match(sectionHeaderRegex);
    
    if (!headerMatch) {
      return text;
    }
    
    const sectionStart = headerMatch.index;
    
    // Find where the section ends - either at the next section number or end of text
    // Look for pattern like "3.3" or "2.5" etc (next section)
    const nextSectionRegex = new RegExp(`\\n\\d+\\.\\d+[^\\n]*(?=\\n|$)`, 'g');
    nextSectionRegex.lastIndex = sectionStart;
    const nextSectionMatch = nextSectionRegex.exec(text);
    
    const sectionEnd = nextSectionMatch ? nextSectionMatch.index : text.length;
    const sectionContent = text.substring(sectionStart, sectionEnd);
    
    // Build the parts array
    const parts = [];
    
    // Add text before section
    if (sectionStart > 0) {
      parts.push(text.substring(0, sectionStart));
    }
    
    // Add highlighted section (entire block)
    parts.push(
      <mark key={sectionStart} className="bg-yellow-300 block py-1">
        {sectionContent}
      </mark>
    );
    
    // Add text after section
    if (sectionEnd < text.length) {
      parts.push(text.substring(sectionEnd));
    }
    
    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="h-full flex flex-col bg-gray-200">
      <div className="flex items-center justify-between p-3 bg-gray-300 border-b border-gray-400">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">📄 {pdfData.title}</span>
          <span className="text-xs text-gray-600">|</span>
          <span className="text-sm text-gray-700">Section {section}</span>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
        >
          ← Back to Reply
        </button>
      </div>
      <div className="flex-1 p-4 bg-gray-200 overflow-y-auto">
        {pdfData.pages.map((page, pageIndex) => (
          <div
            key={pageIndex}
            className="bg-white shadow-lg mb-4 mx-auto"
            style={{ width: '8.5in', minHeight: '11in', padding: '1in' }}
          >
            <pre className="font-serif text-sm leading-relaxed text-gray-900 whitespace-pre-wrap">
              {highlightSection(page.content, section)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PDFSectionViewer;

