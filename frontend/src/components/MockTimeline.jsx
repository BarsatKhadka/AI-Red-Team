import React, { useState, useEffect } from 'react';
import { projectPlan } from '../mockData/comprehensiveMockData';

/**
 * MockTimeline Component
 * Auto-generates project timeline with milestones, flags overdue items
 * Includes regenerate functionality
 */
const MockTimeline = () => {
  const [timelineData, setTimelineData] = useState([]);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const generateTimeline = () => {
    const today = new Date();
    
    const enrichedMilestones = projectPlan.milestones.map((milestone, index) => {
      const targetDate = new Date(milestone.targetDate);
      const completedDate = milestone.completedDate ? new Date(milestone.completedDate) : null;
      
      // Determine if overdue
      const isOverdue = !completedDate && targetDate < today && milestone.status !== 'Completed';
      
      // Calculate days until/since due
      const daysDiff = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
      
      // Auto-generate random completion dates for completed milestones if not present
      const autoCompletedDate = milestone.status === 'Completed' && !completedDate
        ? new Date(targetDate.getTime() - Math.random() * 5 * 24 * 60 * 60 * 1000)
        : completedDate;

      return {
        ...milestone,
        targetDate,
        completedDate: autoCompletedDate,
        isOverdue,
        daysDiff,
        daysUntilDue: isOverdue ? `${Math.abs(daysDiff)} days overdue` : `${daysDiff} days remaining`
      };
    });

    setTimelineData(enrichedMilestones);
  };

  useEffect(() => {
    generateTimeline();
  }, []);

  const regenerateTimeline = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      generateTimeline();
      setIsRegenerating(false);
    }, 1000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return '✅';
      case 'In Progress':
        return '🔄';
      case 'At Risk':
        return '⚠️';
      case 'Not Started':
        return '⏸️';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status, isOverdue) => {
    if (isOverdue) return 'bg-red-100 text-red-800 border-red-300';
    
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'At Risk':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressBarColor = (progress, isOverdue) => {
    if (isOverdue) return 'bg-red-500';
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Timeline</h1>
          <p className="text-gray-600">
            {projectPlan.projectName} • {projectPlan.overallProgress}% Complete
          </p>
        </div>
        <button
          onClick={regenerateTimeline}
          disabled={isRegenerating}
          className={`px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2 ${
            isRegenerating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          }`}
        >
          {isRegenerating ? '⏳' : '🔄'} Regenerate Timeline
        </button>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">Overall Project Progress</span>
          <span className="text-sm font-bold text-indigo-600">{projectPlan.overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${projectPlan.overallProgress}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-2xl text-green-600">
              {timelineData.filter(m => m.status === 'Completed').length}
            </div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-blue-600">
              {timelineData.filter(m => m.status === 'In Progress').length}
            </div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-orange-600">
              {timelineData.filter(m => m.status === 'At Risk').length}
            </div>
            <div className="text-gray-600">At Risk</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-red-600">
              {timelineData.filter(m => m.isOverdue).length}
            </div>
            <div className="text-gray-600">Overdue</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300" />

        <div className="space-y-6">
          {timelineData.map((milestone, index) => (
            <div key={milestone.id} className="relative pl-20">
              {/* Timeline dot */}
              <div
                className={`absolute left-5 w-6 h-6 rounded-full border-4 ${
                  milestone.status === 'Completed'
                    ? 'bg-green-500 border-green-200'
                    : milestone.isOverdue
                    ? 'bg-red-500 border-red-200'
                    : 'bg-blue-500 border-blue-200'
                }`}
              />

              {/* Milestone Card */}
              <div
                className={`bg-white rounded-lg shadow-md border-2 hover:shadow-lg transition-shadow ${
                  milestone.isOverdue ? 'border-red-300' : 'border-gray-200'
                }`}
              >
                {/* Card Header */}
                <div className={`px-6 py-4 border-b ${milestone.isOverdue ? 'bg-red-50' : 'bg-gray-50'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getStatusIcon(milestone.status)}</span>
                        <h3 className="text-xl font-bold text-gray-900">{milestone.name}</h3>
                      </div>
                      <p className="text-gray-600 text-sm">{milestone.description}</p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold border-2 ${getStatusColor(
                        milestone.status,
                        milestone.isOverdue
                      )}`}
                    >
                      {milestone.isOverdue ? '🚨 OVERDUE' : milestone.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-6 py-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-600">Target Date:</span>
                      <div className="font-semibold text-gray-900">{formatDate(milestone.targetDate)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Owner:</span>
                      <div className="font-semibold text-gray-900">{milestone.owner}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <div
                        className={`font-semibold ${
                          milestone.isOverdue ? 'text-red-600' : 'text-gray-900'
                        }`}
                      >
                        {milestone.isOverdue ? milestone.daysUntilDue : milestone.daysUntilDue}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Progress</span>
                      <span className="text-sm font-bold text-gray-900">{milestone.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`${getProgressBarColor(
                          milestone.progress,
                          milestone.isOverdue
                        )} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">
                      Deliverables:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {milestone.deliverables.map((deliverable, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium"
                        >
                          {deliverable}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Completed Date */}
                  {milestone.completedDate && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="text-green-600 font-semibold text-sm">
                        ✓ Completed on {formatDate(milestone.completedDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MockTimeline;
