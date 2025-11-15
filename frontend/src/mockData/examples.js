/**
 * Mock Data Usage Examples
 * 
 * This file demonstrates how to use the mock data and placeholder functions
 * in your React components or other parts of the application.
 */

import {
  // Mock data
  staticProjectFiles,
  deliverables,
  projectPlan,
  teamMembers,
  
  // Placeholder functions
  generateSummaryPlaceholder,
  generateReviewPlaceholder,
  notifyTeamPlaceholder,
  analyzeFilePlaceholder,
  compareDeliverablesPlaceholder,
  generateRecommendationsPlaceholder,
  
  // Helper functions
  getDeliverableById,
  getDeliverablesByStatus,
  getTeamMemberById,
  getTeamMembersByRole,
  getFileById,
  getFilesByType,
  getMilestoneById,
  getMilestonesByStatus,
  getProjectStatistics
} from './index';

// ============================================================================
// Example 1: Display All Deliverables with Status
// ============================================================================
export function displayAllDeliverables() {
  console.log('\n=== All Deliverables ===');
  deliverables.forEach(deliverable => {
    console.log(`📦 ${deliverable.title}`);
    console.log(`   Status: ${deliverable.status}`);
    console.log(`   Uploaded by: ${deliverable.uploadedBy}`);
    console.log(`   Date: ${new Date(deliverable.uploadDate).toLocaleDateString()}`);
    console.log('');
  });
}

// ============================================================================
// Example 2: Filter Deliverables by Status
// ============================================================================
export function showPendingDeliverables() {
  console.log('\n=== Pending Deliverables ===');
  const pending = getDeliverablesByStatus('Pending Review');
  
  console.log(`Found ${pending.length} deliverables pending review:`);
  pending.forEach(d => {
    console.log(`- ${d.title} (uploaded by ${d.uploadedBy})`);
  });
}

// ============================================================================
// Example 3: Use Placeholder Functions
// ============================================================================
export function demonstratePlaceholderFunctions() {
  console.log('\n=== Placeholder Functions Demo ===');
  
  const deliverable = deliverables[0];
  
  // Generate summary
  const summary = generateSummaryPlaceholder(deliverable);
  console.log('Summary:');
  console.log(summary);
  console.log('');
  
  // Generate review
  const review = generateReviewPlaceholder(deliverable, projectPlan);
  console.log('Review:');
  console.log(review);
  console.log('');
  
  // Send notification
  const notification = notifyTeamPlaceholder(summary);
  console.log('Notification result:', notification);
}

// ============================================================================
// Example 4: Analyze a File
// ============================================================================
export function analyzeProjectFile() {
  console.log('\n=== File Analysis Demo ===');
  
  const file = staticProjectFiles[0];
  const analysis = analyzeFilePlaceholder(file);
  
  console.log(`Analyzing: ${file.fileName}`);
  console.log('Analysis result:', analysis);
}

// ============================================================================
// Example 5: Compare Multiple Deliverables
// ============================================================================
export function compareDeliverables() {
  console.log('\n=== Deliverable Comparison Demo ===');
  
  const approvedDeliverables = getDeliverablesByStatus('Approved');
  const comparison = compareDeliverablesPlaceholder(approvedDeliverables);
  
  console.log('Comparison result:', comparison);
}

// ============================================================================
// Example 6: Get Project Statistics
// ============================================================================
export function showProjectStatistics() {
  console.log('\n=== Project Statistics ===');
  
  const stats = getProjectStatistics();
  
  console.log(`Total Files: ${stats.totalFiles}`);
  console.log(`Total Deliverables: ${stats.totalDeliverables}`);
  console.log(`Total Milestones: ${stats.totalMilestones}`);
  console.log(`Total Team Members: ${stats.totalTeamMembers}`);
  console.log('');
  console.log('Deliverables by Status:');
  console.log(`  ✅ Approved: ${stats.deliverablesByStatus.approved}`);
  console.log(`  ⏳ Pending: ${stats.deliverablesByStatus.pending}`);
  console.log(`  🔄 Needs Revision: ${stats.deliverablesByStatus.needsRevision}`);
  console.log('');
  console.log('Milestones by Status:');
  console.log(`  ✅ Completed: ${stats.milestonesByStatus.completed}`);
  console.log(`  🚧 In Progress: ${stats.milestonesByStatus.inProgress}`);
  console.log(`  📅 Planned: ${stats.milestonesByStatus.planned}`);
}

// ============================================================================
// Example 7: Get Team Members by Role
// ============================================================================
export function showDevelopers() {
  console.log('\n=== Development Team ===');
  
  const backendDevs = getTeamMembersByRole('Backend Developer');
  const frontendDevs = getTeamMembersByRole('Frontend Developer');
  const devOps = getTeamMembersByRole('DevOps Engineer');
  
  console.log('Backend Developers:');
  backendDevs.forEach(dev => console.log(`  - ${dev.name} (${dev.email})`));
  
  console.log('\nFrontend Developers:');
  frontendDevs.forEach(dev => console.log(`  - ${dev.name} (${dev.email})`));
  
  console.log('\nDevOps Engineers:');
  devOps.forEach(dev => console.log(`  - ${dev.name} (${dev.email})`));
}

// ============================================================================
// Example 8: Get Files by Type
// ============================================================================
export function showFilesByType() {
  console.log('\n=== Files by Type ===');
  
  const pdfFiles = getFilesByType('pdf');
  const wordFiles = getFilesByType('word');
  const imageFiles = getFilesByType('image');
  
  console.log(`PDF Files (${pdfFiles.length}):`);
  pdfFiles.forEach(f => console.log(`  📄 ${f.fileName}`));
  
  console.log(`\nWord Documents (${wordFiles.length}):`);
  wordFiles.forEach(f => console.log(`  📝 ${f.fileName}`));
  
  console.log(`\nImages (${imageFiles.length}):`);
  imageFiles.forEach(f => console.log(`  🖼️  ${f.fileName}`));
}

// ============================================================================
// Example 9: Show Project Plan Milestones
// ============================================================================
export function showMilestones() {
  console.log('\n=== Project Milestones ===');
  
  projectPlan.milestones.forEach(milestone => {
    const statusIcon = {
      'completed': '✅',
      'in-progress': '🚧',
      'planned': '📅'
    }[milestone.status] || '❓';
    
    console.log(`${statusIcon} ${milestone.name}`);
    console.log(`   Due: ${milestone.dueDate}`);
    console.log(`   Status: ${milestone.status}`);
    console.log(`   Deliverables: ${milestone.deliverables.join(', ')}`);
    console.log('');
  });
}

// ============================================================================
// Example 10: Generate Recommendations
// ============================================================================
export function showRecommendations() {
  console.log('\n=== AI Recommendations (Placeholder) ===');
  
  const recommendations = generateRecommendationsPlaceholder(projectPlan, deliverables);
  
  recommendations.forEach(rec => {
    const priorityIcon = {
      'high': '🔴',
      'medium': '🟡',
      'low': '🟢'
    }[rec.priority] || '⚪';
    
    console.log(`${priorityIcon} [${rec.priority.toUpperCase()}] ${rec.category}`);
    console.log(`   ${rec.recommendation}`);
    console.log('');
  });
}

// ============================================================================
// Example 11: React Component Usage Example
// ============================================================================
export function ReactComponentExample() {
  // This is a demonstration of how to use the mock data in a React component
  
  // Example: Display deliverables in a component
  /*
  import { deliverables, generateSummaryPlaceholder } from './mockData';
  
  function DeliverablesList() {
    return (
      <div>
        <h2>Deliverables</h2>
        {deliverables.map(deliverable => (
          <div key={deliverable.id} className="deliverable-card">
            <h3>{deliverable.title}</h3>
            <p>Status: <span className={`status-${deliverable.status.toLowerCase().replace(' ', '-')}`}>
              {deliverable.status}
            </span></p>
            <p>Uploaded by: {deliverable.uploadedBy}</p>
            <p>Date: {new Date(deliverable.uploadDate).toLocaleDateString()}</p>
            <div className="ai-summary">
              {generateSummaryPlaceholder(deliverable)}
            </div>
          </div>
        ))}
      </div>
    );
  }
  */
  
  console.log('See code comments for React component example');
}

// ============================================================================
// Example 12: Run All Examples
// ============================================================================
export function runAllExamples() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║         Mock Data Usage Examples - Complete Demo         ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  
  displayAllDeliverables();
  showPendingDeliverables();
  demonstratePlaceholderFunctions();
  analyzeProjectFile();
  compareDeliverables();
  showProjectStatistics();
  showDevelopers();
  showFilesByType();
  showMilestones();
  showRecommendations();
  
  console.log('\n✅ All examples completed!');
  console.log('See the code in examples.js for implementation details.\n');
}

// ============================================================================
// Default export
// ============================================================================
export default {
  displayAllDeliverables,
  showPendingDeliverables,
  demonstratePlaceholderFunctions,
  analyzeProjectFile,
  compareDeliverables,
  showProjectStatistics,
  showDevelopers,
  showFilesByType,
  showMilestones,
  showRecommendations,
  runAllExamples
};

// Uncomment the line below to run all examples when this file is imported
// runAllExamples();
