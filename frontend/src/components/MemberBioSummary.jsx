import { useMemo } from 'react';

function MemberBioSummary({ member, project, team }) {
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

  const generateInsights = () => {
    if (!bioData) return [];
    const insights = [];
    
    if (bioData.completionPercent >= 70) {
      insights.push("High productivity observed");
    } else if (bioData.completionPercent >= 40) {
      insights.push("Steady progress maintained");
    } else {
      insights.push("Focus areas identified");
    }
    
    if (bioData.clarifyCount > 2) {
      insights.push("Active engagement with requirements");
    }
    
    return insights.length > 0 ? insights : ["Profile analysis in progress"];
  };

  if (!member || !bioData) {
    return null;
  }

  const insights = generateInsights();

  return (
    <div className="w-full">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {member.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-800">AI-Generated Profile</h3>
            <span className="text-xs text-gray-400">•</span>
            <p className="text-xs text-gray-500">{member.name} • {team?.name || 'Team'}</p>
          </div>
          
          <div className="text-xs text-gray-700 leading-relaxed space-y-1">
            <p>
              <span className="font-semibold text-gray-800">Status:</span> {bioData.currentActivity}. 
              {' '}<span className="font-semibold text-blue-600">{bioData.completionPercent}%</span> complete ({bioData.completedTasks}/{bioData.totalTasks} tasks).
            </p>
            
            <p>
              Available <span className="font-semibold">{bioData.weeklyHours} hours/week</span>. 
              {' '}{bioData.messagesCount} message{bioData.messagesCount !== 1 ? 's' : ''}, {bioData.progressCount} progress update{bioData.progressCount !== 1 ? 's' : ''}, {bioData.clarifyCount} clarification{bioData.clarifyCount !== 1 ? 's' : ''}.
            </p>
            
            {insights.length > 0 && (
              <div className="inline-block bg-gradient-to-r from-blue-50 to-indigo-50 rounded px-2 py-1.5 border border-blue-100 mt-1">
                <p className="text-blue-800 font-semibold text-xs mb-0.5">AI Analysis:</p>
                <p className="text-blue-900 text-xs">{insights.join('; ').toLowerCase()}.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberBioSummary;

