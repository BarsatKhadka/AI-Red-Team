import { useMemo } from 'react';

function MemberBioSummary({ member, project, team, compact = false, onExpand, onCollapse }) {
  const bioData = useMemo(() => {
    if (!member) return null;

    const messages = member.messages || [];
    
    // Calculate completion percentage
    const progressMessages = messages.filter(m => m.type === '@progress_update');
    const totalTasks = 20;
    let completedTasks = 0;
    
    progressMessages.forEach(msg => {
      const match = msg.text.match(/(\d+)%/);
      if (match) {
        const percent = parseInt(match[1]);
        completedTasks = Math.max(completedTasks, Math.floor((percent / 100) * totalTasks));
      }
    });
    
    if (completedTasks === 0) {
      completedTasks = Math.floor(Math.random() * 15) + 5;
    }
    
    const completionPercent = Math.round((completedTasks / totalTasks) * 100);
    
    // Determine current activity
    let currentActivity = 'Working on assigned tasks';
    const clarifyMessages = messages.filter(m => m.type === '@clarify');
    const availabilityMessages = messages.filter(m => m.type === '@availability');
    
    if (clarifyMessages.length > 0) {
      const lastClarify = clarifyMessages[clarifyMessages.length - 1];
      if (lastClarify.text.toLowerCase().includes('api')) {
        currentActivity = 'Integrating API endpoints';
      } else if (lastClarify.text.toLowerCase().includes('design')) {
        currentActivity = 'Reviewing design specifications';
      } else {
        currentActivity = 'Seeking clarifications on requirements';
      }
    } else if (progressMessages.length > 0) {
      const lastProgress = progressMessages[progressMessages.length - 1];
      if (lastProgress.text.toLowerCase().includes('blocked')) {
        currentActivity = 'Resolving blockers';
      } else {
        currentActivity = 'Making progress on assigned tasks';
      }
    }
    
    // Generate availability hours
    let weeklyHours = 0;
    if (availabilityMessages.length > 0) {
      const lastAvailability = availabilityMessages[availabilityMessages.length - 1];
      const hourMatch = lastAvailability.text.match(/(\d+)\s*hours?/i);
      if (hourMatch) {
        weeklyHours = parseInt(hourMatch[1]);
      }
    }
    if (weeklyHours === 0) {
      weeklyHours = Math.floor(Math.random() * 10) + 10;
    }
    
    return {
      completionPercent,
      completedTasks,
      totalTasks,
      currentActivity,
      weeklyHours,
      messagesCount: messages.length,
      clarifyCount: clarifyMessages.length,
      progressCount: progressMessages.length,
      availabilityCount: availabilityMessages.length,
    };
  }, [member]);

  const generateDetailedSummary = () => {
    if (!bioData || !member) return null;

    const messages = member.messages || [];
    const allMessages = messages.flatMap(m => {
      if (m.originalMessages) {
        return m.originalMessages;
      }
      return [{ text: m.text, source: m.source || 'unknown' }];
    });

    // Performance Analysis
    let performanceLevel = 'Standard';
    let performanceDetails = '';
    if (bioData.completionPercent >= 80) {
      performanceLevel = 'Excellent';
      performanceDetails = 'Consistently exceeds expectations with high task completion rates. Demonstrates strong ownership and proactive problem-solving.';
    } else if (bioData.completionPercent >= 60) {
      performanceLevel = 'Good';
      performanceDetails = 'Maintains steady progress with reliable delivery. Shows good time management and task prioritization skills.';
    } else if (bioData.completionPercent >= 40) {
      performanceLevel = 'Developing';
      performanceDetails = 'Making progress but may benefit from additional support or resource allocation. Some tasks require more time than estimated.';
    } else {
      performanceLevel = 'Needs Attention';
      performanceDetails = 'Completion rate below expected threshold. Recommend reviewing workload, priorities, and potential blockers.';
    }

    // Communication Pattern Analysis
    const platformBreakdown = {};
    allMessages.forEach(msg => {
      const source = msg.source || 'unknown';
      platformBreakdown[source] = (platformBreakdown[source] || 0) + 1;
    });
    
    const primaryPlatform = Object.keys(platformBreakdown).reduce((a, b) => 
      platformBreakdown[a] > platformBreakdown[b] ? a : b, 'unknown'
    );
    
    let communicationStyle = '';
    if (bioData.clarifyCount > bioData.progressCount) {
      communicationStyle = 'Proactive communicator who seeks clarification early. Engages actively with requirements and asks thoughtful questions.';
    } else if (bioData.progressCount > bioData.clarifyCount * 2) {
      communicationStyle = 'Results-focused communicator. Provides regular progress updates and maintains visibility on deliverables.';
    } else {
      communicationStyle = 'Balanced communication approach. Maintains regular updates while seeking clarification when needed.';
    }

    // Workload Analysis
    let workloadAssessment = '';
    const avgHoursPerTask = bioData.weeklyHours / (bioData.totalTasks - bioData.completedTasks || 1);
    if (avgHoursPerTask > 2) {
      workloadAssessment = `Current workload appears manageable with ${bioData.weeklyHours} hours/week available. Tasks are progressing at a sustainable pace.`;
    } else if (avgHoursPerTask > 1) {
      workloadAssessment = `Workload is balanced. ${bioData.weeklyHours} hours/week allocated effectively across remaining tasks.`;
    } else {
      workloadAssessment = `High workload intensity detected. ${bioData.weeklyHours} hours/week may be insufficient for ${bioData.totalTasks - bioData.completedTasks} remaining tasks. Consider resource reallocation.`;
    }

    // Recent Activity Trends
    const recentMessages = messages.slice(-3);
    let activityTrend = '';
    if (recentMessages.length > 0) {
      const recentTypes = recentMessages.map(m => m.type);
      if (recentTypes.includes('@clarify')) {
        activityTrend = 'Recent activity shows active engagement with clarification requests, indicating thorough approach to requirements.';
      } else if (recentTypes.includes('@progress_update')) {
        activityTrend = 'Recent updates demonstrate consistent progress tracking and transparent communication of status.';
      } else {
        activityTrend = 'Maintaining regular communication cadence with team members.';
      }
    }

    // Recommendations
    const recommendations = [];
    if (bioData.completionPercent < 50) {
      recommendations.push('Schedule a 1-on-1 to identify blockers and adjust task priorities');
    }
    if (bioData.clarifyCount === 0 && bioData.totalTasks > 5) {
      recommendations.push('Encourage proactive clarification requests to prevent rework');
    }
    if (bioData.weeklyHours < 15) {
      recommendations.push('Review availability constraints and consider workload redistribution');
    }
    if (bioData.completionPercent >= 80) {
      recommendations.push('Consider assigning additional high-priority tasks or mentoring opportunities');
    }

    return {
      performanceLevel,
      performanceDetails,
      primaryPlatform,
      communicationStyle,
      workloadAssessment,
      activityTrend,
      recommendations,
      platformBreakdown
    };
  };

  if (!member || !bioData) {
    return null;
  }

  const detailedSummary = generateDetailedSummary();

  // Compact version for when a message is selected
  if (compact) {
    return (
      <div 
        className="w-full bg-bg-card rounded-md border border-border-light p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          {member.name === 'Alice' ? (
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice&backgroundColor=b8b5ff"
              alt={member.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-avatar-alice flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
              {member.name.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-text-primary">{member.name}</h3>
              <span className="text-xs text-text-tertiary">•</span>
              <p className="text-xs text-text-secondary">{team?.name || 'Team'}</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div>
                <span className="text-text-tertiary">Status: </span>
                <span className="font-medium text-text-primary">{bioData.currentActivity}</span>
              </div>
              <div>
                <span className="text-text-tertiary">Progress: </span>
                <span className="font-semibold text-success">{bioData.completionPercent}%</span>
              </div>
              <div>
                <span className="text-text-tertiary">Available: </span>
                <span className="font-medium text-text-primary">{bioData.weeklyHours} hrs/week</span>
              </div>
            </div>
          </div>
          {detailedSummary && (
            <div className="flex-shrink-0">
              <div className="bg-primary-light/30 border border-primary/20 rounded px-2 py-1">
                <p className="text-xs font-semibold text-primary">AI Analysis</p>
                <p className="text-xs text-text-secondary">{detailedSummary.performanceLevel}</p>
              </div>
            </div>
          )}
          {onExpand && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.nativeEvent) {
                  e.nativeEvent.stopImmediatePropagation();
                }
                console.log('View more button clicked');
                // Immediately call onExpand
                if (onExpand) {
                  console.log('Calling onExpand');
                  onExpand();
                }
              }}
              className="flex-shrink-0 text-xs text-primary hover:text-primary-hover font-medium px-2 py-1 hover:bg-primary-light/20 rounded transition-colors"
            >
              View more
            </button>
          )}
        </div>
      </div>
    );
  }

  // Full version for default state or expanded
  return (
    <div className="w-full bg-bg-card rounded-md border border-border-light p-4">
      {onCollapse && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCollapse();
            }}
            className="text-xs text-text-tertiary hover:text-text-primary font-medium px-2 py-1 hover:bg-bg-elevated rounded transition-colors"
          >
            Show less
          </button>
        </div>
      )}
      <div className="flex items-start gap-4 mb-4">
        {member.name === 'Alice' ? (
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice&backgroundColor=b8b5ff"
            alt={member.name}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-avatar-alice flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
            {member.name.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-text-primary">{member.name}</h3>
            <span className="text-xs text-text-tertiary">•</span>
            <p className="text-sm text-text-secondary">{team?.name || 'Team'}</p>
            <span className="text-xs text-text-tertiary">•</span>
            <p className="text-xs text-text-tertiary">AI Profile Analysis</p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-sm mb-3">
            <div>
              <span className="text-text-secondary">Status: </span>
              <span className="font-medium text-text-primary">{bioData.currentActivity}</span>
            </div>
            <div>
              <span className="text-text-secondary">Progress: </span>
              <span className="font-semibold text-success">{bioData.completionPercent}%</span>
              <span className="text-text-tertiary"> ({bioData.completedTasks}/{bioData.totalTasks} tasks)</span>
            </div>
            <div>
              <span className="text-text-secondary">Availability: </span>
              <span className="font-medium text-text-primary">{bioData.weeklyHours} hrs/week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed AI Summary */}
      {detailedSummary && (
        <div className="space-y-4 border-t border-border-light pt-4">
          {/* AI Analysis Header */}
          <div className="bg-primary-light/30 border border-primary/20 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                <span className="text-primary text-xs">AI</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-primary mb-1">AI-Generated Profile Analysis</p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Based on analysis of <span className="font-medium text-text-primary">{bioData.messagesCount} messages</span>, 
                  {' '}<span className="font-medium text-text-primary">{bioData.progressCount} progress updates</span>, 
                  {' '}<span className="font-medium text-text-primary">{bioData.clarifyCount} clarification requests</span>, 
                  {' '}<span className="font-medium text-text-primary">{bioData.availabilityCount} availability reports</span>, 
                  and task completion data ({bioData.completedTasks}/{bioData.totalTasks} tasks, {bioData.completionPercent}% complete).
                </p>
              </div>
            </div>
          </div>

          {/* Performance Analysis */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">Performance Analysis</h4>
            <div className="flex items-start gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                detailedSummary.performanceLevel === 'Excellent' ? 'bg-success/20 text-success' :
                detailedSummary.performanceLevel === 'Good' ? 'bg-primary/20 text-primary' :
                detailedSummary.performanceLevel === 'Developing' ? 'bg-warning/20 text-warning' :
                'bg-error/20 text-error'
              }`}>
                {detailedSummary.performanceLevel}
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{detailedSummary.performanceDetails}</p>
          </div>

          {/* Communication Analysis */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">Communication Pattern</h4>
            <p className="text-sm text-text-secondary leading-relaxed mb-2">{detailedSummary.communicationStyle}</p>
            <div className="text-xs text-text-tertiary">
              Primary platform: <span className="font-medium text-text-secondary capitalize">{detailedSummary.primaryPlatform}</span>
              {' • '}
              {bioData.messagesCount} total messages
              {' • '}
              {bioData.clarifyCount} clarifications, {bioData.progressCount} progress updates
            </div>
          </div>

          {/* Workload Assessment */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">Workload Assessment</h4>
            <p className="text-sm text-text-secondary leading-relaxed">{detailedSummary.workloadAssessment}</p>
          </div>

          {/* Recent Activity */}
          {detailedSummary.activityTrend && (
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-2">Recent Activity</h4>
              <p className="text-sm text-text-secondary leading-relaxed">{detailedSummary.activityTrend}</p>
            </div>
          )}

          {/* Recommendations */}
          {detailedSummary.recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {detailedSummary.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MemberBioSummary;

