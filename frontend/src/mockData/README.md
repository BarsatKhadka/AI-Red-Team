# Mock Data Documentation

This directory contains comprehensive mock data for the AI Red Team Platform project. All data is static and does not require any external services or AI integration.

## 📁 File Structure

```
mockData/
├── index.js                    # Main export file with all data and helpers
├── staticProjectFiles.js       # 12 sample project files
├── deliverables.js            # 8 sample deliverables
├── projectPlan.js             # Project plan with milestones and expectations
├── teamMembers.js             # 7 team member profiles
├── placeholderFunctions.js    # Placeholder functions for future AI integration
├── README.md                  # This file
└── examples.js                # Usage examples
```

## 📊 Data Overview

### A. Static Project Files (12 files)
Located in: `staticProjectFiles.js`

Each file includes:
- `id` - Unique identifier
- `fileName` - Name of the file
- `fileType` - Type (pdf, word, image)
- `summary` - Short description
- `uploadDate` - ISO timestamp
- `uploadedBy` - Team member name

File types covered:
- 5 PDF documents
- 3 Word documents (.docx)
- 3 Images (.png, .svg)
- 1 SQL file

### B. Deliverables (8 deliverables)
Located in: `deliverables.js`

Each deliverable includes:
- `id` - Unique identifier
- `title` - Deliverable name
- `fileName` - Associated file name
- `uploadedBy` - Team member name
- `uploadDate` - ISO timestamp
- `status` - "Pending Review", "Approved", or "Needs Revision"
- `aiSummaryPlaceholder` - Mock AI summary text
- `aiReviewPlaceholder` - Mock AI review text
- `comments` - Empty array (ready for future use)

Status breakdown:
- 4 Approved
- 3 Pending Review
- 1 Needs Revision

### C. Project Plan
Located in: `projectPlan.js`

Includes:
- **7 Milestones** with id, name, dueDate, description, deliverables, status
- **5 Deliverable Expectation Categories** with detailed requirements
- **6 Team Roles** with responsibilities and required skills

Milestone statuses:
- 2 Completed
- 2 In Progress
- 3 Planned

### D. Team Members (7 members)
Located in: `teamMembers.js`

Each member includes:
- `id` - Unique identifier
- `name` - Full name
- `role` - Job title
- `email` - Email address
- `avatar` - Avatar image URL (using ui-avatars.com API)
- `department` - Department name
- `joinDate` - Join date
- `status` - Active status

Roles covered:
- Project Manager
- Backend Developer
- Frontend Developer
- DevOps Engineer
- QA Engineer
- UI/UX Designer
- Technical Writer

## 🔧 Placeholder Functions

Located in: `placeholderFunctions.js`

**IMPORTANT**: These functions do NOT call any AI services. They return static strings and are clearly marked as future integration points.

### Core Functions:

1. **`generateSummaryPlaceholder(deliverable)`**
   - Returns: Placeholder summary string
   - Future: Will generate AI summary of deliverable content

2. **`generateReviewPlaceholder(deliverable, projectPlan)`**
   - Returns: Placeholder review string
   - Future: Will compare deliverable to project plan using AI

3. **`notifyTeamPlaceholder(summary)`**
   - Returns: Object with success status
   - Logs to console
   - Future: Will send actual notifications to team members

### Additional Functions:

4. **`analyzeFilePlaceholder(file)`**
   - Returns: Object with placeholder analysis results

5. **`compareDeliverablesPlaceholder(deliverables)`**
   - Returns: Object with placeholder comparison results

6. **`generateRecommendationsPlaceholder(projectPlan, deliverables)`**
   - Returns: Array of placeholder recommendations

## 📖 Usage Examples

### Basic Import

```javascript
// Import everything
import mockData from './mockData';

// Or import specific items
import { 
  staticProjectFiles, 
  deliverables, 
  projectPlan, 
  teamMembers 
} from './mockData';

// Or import placeholder functions
import { 
  generateSummaryPlaceholder,
  generateReviewPlaceholder,
  notifyTeamPlaceholder
} from './mockData';
```

### Using Mock Data

```javascript
import { deliverables, projectPlan } from './mockData';

// Display all deliverables
deliverables.forEach(deliverable => {
  console.log(`${deliverable.title} - Status: ${deliverable.status}`);
});

// Get pending deliverables
const pending = deliverables.filter(d => d.status === 'Pending Review');
```

### Using Placeholder Functions

```javascript
import { 
  generateSummaryPlaceholder, 
  generateReviewPlaceholder,
  deliverables,
  projectPlan 
} from './mockData';

const deliverable = deliverables[0];

// Generate placeholder summary
const summary = generateSummaryPlaceholder(deliverable);
console.log(summary);
// Output: [AI Summary Placeholder] A summary for Sprint 1 Backend API Implementation would appear here...

// Generate placeholder review
const review = generateReviewPlaceholder(deliverable, projectPlan);
console.log(review);
// Output: [AI Review Placeholder] This will compare "Sprint 1 Backend API Implementation" to the project plan...
```

### Using Helper Functions

```javascript
import { 
  getDeliverablesByStatus,
  getTeamMembersByRole,
  getProjectStatistics 
} from './mockData';

// Get all approved deliverables
const approved = getDeliverablesByStatus('Approved');
console.log(`${approved.length} approved deliverables`);

// Get all developers
const developers = getTeamMembersByRole('Backend Developer');

// Get project statistics
const stats = getProjectStatistics();
console.log(stats);
/*
{
  totalFiles: 12,
  totalDeliverables: 8,
  totalMilestones: 7,
  totalTeamMembers: 7,
  deliverablesByStatus: { approved: 4, pending: 3, needsRevision: 1 },
  milestonesByStatus: { completed: 2, inProgress: 2, planned: 3 }
}
*/
```

## 🎯 Future AI Integration Points

All placeholder functions are clearly marked with `[AI Placeholder]` prefixes and include JSDoc comments explaining the future AI integration:

```javascript
/**
 * FUTURE AI INTEGRATION POINT:
 * This function will analyze the deliverable content and generate
 * an intelligent summary using AI/LLM services.
 */
export function generateSummaryPlaceholder(deliverable) {
  return `[AI Summary Placeholder] A summary for ${deliverable.title} would appear here.`;
}
```

To integrate AI:
1. Replace the placeholder return value with actual AI API calls
2. Keep the same function signature for compatibility
3. Remove the `[AI Placeholder]` prefix from returned strings
4. Add error handling for API failures

## 🔄 Data Relationships

- **Deliverables** reference **Team Members** via `uploadedBy` field
- **Deliverables** align with **Project Plan Milestones** via `aiReviewPlaceholder`
- **Static Files** reference **Team Members** via `uploadedBy` field
- **Project Plan Milestones** list expected deliverables

## 📝 Notes

- All dates are in ISO 8601 format
- Avatar URLs use the ui-avatars.com API for consistent placeholder images
- File IDs follow the pattern: `file-XXX`, `deliv-XXX`, `user-XXX`, `milestone-XXX`
- All mock text is intentionally generic and does not use AI-generated content
- Comments arrays are empty and ready for future implementation

## 🚀 Quick Start

See `examples.js` for complete working examples of how to use all the mock data and functions in your components.
