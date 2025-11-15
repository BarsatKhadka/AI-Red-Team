import { useState } from 'react';

function TeamMembersPanel({ project, team, onMemberSelect, onMessageClick, documents }) {
  const [selectedMember, setSelectedMember] = useState(null);

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a project to view team members</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a team to view members</p>
      </div>
    );
  }

  const getMessageTypeColor = (type) => {
    switch (type) {
      case '@clarify':
        return 'bg-blue-100 text-blue-800';
      case '@availability':
        return 'bg-green-100 text-green-800';
      case '@progress_update':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-bold text-gray-800">{team.name}</h3>
        <p className="text-xs text-gray-500 mt-1">{team.members?.length || 0} member{(team.members?.length || 0) !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-3">
          {team.members && team.members.length > 0 ? (
            team.members.map((member) => {
              const hasMessages = member.messages && member.messages.length > 0;
              
              return (
                <div
                  key={member.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedMember === member.id
                      ? 'bg-blue-50 border-blue-300 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => {
                    setSelectedMember(member.id);
                    if (onMemberSelect) {
                      onMemberSelect(member);
                    }
                    // If member has messages, show the first one
                    if (hasMessages && member.messages.length > 0) {
                      const firstMessage = member.messages[0];
                      onMessageClick(member.name, firstMessage.type, firstMessage.text, project.name, team.name, firstMessage.source || 'outlook', documents);
                    }
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold text-xs">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-800">{member.name}</div>
                      <div className="text-xs text-gray-500">{team.name}</div>
                    </div>
                  </div>
                  
                  {member.messages && member.messages.length > 0 && (
                    <div className="space-y-1.5 mt-2">
                      {member.messages.map((message, msgIndex) => (
                        <div
                          key={msgIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Also select the member when clicking a message
                            setSelectedMember(member.id);
                            if (onMemberSelect) {
                              onMemberSelect(member);
                            }
                            onMessageClick(member.name, message.type, message.text, project.name, team.name, message.source || 'outlook', documents);
                          }}
                          className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-medium px-2 py-1 rounded ${getMessageTypeColor(message.type)}`}>
                                {message.type}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                          {message.source && (
                            <div className="mb-2">
                              <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                <span className="text-gray-400">Sent from</span>
                                <span className="font-medium text-gray-600 capitalize">{message.source}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-blue-600 font-medium">
                                  {member.name.toLowerCase()}@{message.source === 'outlook' ? 'outlook.com' : message.source === 'slack' ? 'slack.com' : 'teams.microsoft.com'}
                                </span>
                              </span>
                            </div>
                          )}
                          <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{message.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No members found in this team.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamMembersPanel;

