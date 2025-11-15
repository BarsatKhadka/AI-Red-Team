/**
 * Mock Data Index
 * Central export file for all mock data and placeholder functions
 */

// Import all mock data
import { staticProjectFiles } from './staticProjectFiles';
import { deliverables } from './deliverables';
import { projectPlan } from './projectPlan';
import { teamMembers } from './teamMembers';

// Import all placeholder functions
import {
  generateSummaryPlaceholder,
  generateReviewPlaceholder,
  notifyTeamPlaceholder,
  analyzeFilePlaceholder,
  compareDeliverablesPlaceholder,
  generateRecommendationsPlaceholder
} from './placeholderFunctions';

// Export all mock data
export {
  staticProjectFiles,
  deliverables,
  projectPlan,
  teamMembers
};

// Export all placeholder functions
export {
  generateSummaryPlaceholder,
  generateReviewPlaceholder,
  notifyTeamPlaceholder,
  analyzeFilePlaceholder,
  compareDeliverablesPlaceholder,
  generateRecommendationsPlaceholder
};

// Helper functions for working with mock data

/**
 * Get a deliverable by ID
 * @param {string} id - The deliverable ID
 * @returns {Object|null} The deliverable object or null if not found
 */
export function getDeliverableById(id) {
  return deliverables.find(d => d.id === id) || null;
}

/**
 * Get deliverables by status
 * @param {string} status - The status to filter by
 * @returns {Array} Array of deliverables with matching status
 */
export function getDeliverablesByStatus(status) {
  return deliverables.filter(d => d.status === status);
}

/**
 * Get a team member by ID
 * @param {string} id - The team member ID
 * @returns {Object|null} The team member object or null if not found
 */
export function getTeamMemberById(id) {
  return teamMembers.find(m => m.id === id) || null;
}

/**
 * Get team members by role
 * @param {string} role - The role to filter by
 * @returns {Array} Array of team members with matching role
 */
export function getTeamMembersByRole(role) {
  return teamMembers.filter(m => m.role === role);
}

/**
 * Get a file by ID
 * @param {string} id - The file ID
 * @returns {Object|null} The file object or null if not found
 */
export function getFileById(id) {
  return staticProjectFiles.find(f => f.id === id) || null;
}

/**
 * Get files by type
 * @param {string} fileType - The file type to filter by
 * @returns {Array} Array of files with matching type
 */
export function getFilesByType(fileType) {
  return staticProjectFiles.filter(f => f.fileType === fileType);
}

/**
 * Get milestone by ID
 * @param {string} id - The milestone ID
 * @returns {Object|null} The milestone object or null if not found
 */
export function getMilestoneById(id) {
  return projectPlan.milestones.find(m => m.id === id) || null;
}

/**
 * Get milestones by status
 * @param {string} status - The status to filter by
 * @returns {Array} Array of milestones with matching status
 */
export function getMilestonesByStatus(status) {
  return projectPlan.milestones.filter(m => m.status === status);
}

/**
 * Get project statistics
 * @returns {Object} Statistics about the project
 */
export function getProjectStatistics() {
  return {
    totalFiles: staticProjectFiles.length,
    totalDeliverables: deliverables.length,
    totalMilestones: projectPlan.milestones.length,
    totalTeamMembers: teamMembers.length,
    deliverablesByStatus: {
      approved: deliverables.filter(d => d.status === "Approved").length,
      pending: deliverables.filter(d => d.status === "Pending Review").length,
      needsRevision: deliverables.filter(d => d.status === "Needs Revision").length
    },
    milestonesByStatus: {
      completed: projectPlan.milestones.filter(m => m.status === "completed").length,
      inProgress: projectPlan.milestones.filter(m => m.status === "in-progress").length,
      planned: projectPlan.milestones.filter(m => m.status === "planned").length
    }
  };
}

// Default export with everything
export default {
  // Data
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
};
