import { useState, useEffect } from 'react';

function TeamMembersPanel({ project, team, selectedMemberId, onMemberSelect, onMessageClick, documents }) {
  const [selectedMember, setSelectedMember] = useState(null);
  const [expandedMember, setExpandedMember] = useState(null);

  // Automatically expand member when selected from sidebar
  useEffect(() => {
    if (selectedMemberId && team && team.members) {
      const member = team.members.find(m => m.id === selectedMemberId);
      if (member) {
        setExpandedMember(member.id);
        setSelectedMember(member.id);
        // Find the member object and call onMemberSelect
        if (onMemberSelect) {
          onMemberSelect(member);
        }
      }
    } else if (!selectedMemberId) {
      // Clear expansion when no member is selected
      setExpandedMember(null);
      setSelectedMember(null);
    }
  }, [selectedMemberId, team, onMemberSelect]);

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

  const handleMemberClick = (member) => {
    // Toggle expansion
    if (expandedMember === member.id) {
      setExpandedMember(null);
      setSelectedMember(null);
    } else {
      setExpandedMember(member.id);
      setSelectedMember(member.id);
      if (onMemberSelect) {
        onMemberSelect(member);
      }
      // If member has messages, show the first categorized version
      if (member.messages && member.messages.length > 0) {
        const firstMessage = member.messages[0];
        if (firstMessage.categorizedVersions && firstMessage.categorizedVersions.length > 0) {
          const firstVersion = firstMessage.categorizedVersions[0];
          onMessageClick(member.name, firstVersion.type, firstVersion.text, project.name, team.name, firstVersion.source || 'outlook', documents);
        }
      }
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
            // Sort members: selected member first, then others
            [...team.members].sort((a, b) => {
              const aSelected = selectedMemberId === a.id || selectedMember === a.id;
              const bSelected = selectedMemberId === b.id || selectedMember === b.id;
              if (aSelected && !bSelected) return -1;
              if (!aSelected && bSelected) return 1;
              return 0;
            }).map((member) => {
              const hasMessages = member.messages && member.messages.length > 0;
              const isExpanded = expandedMember === member.id;
              const isSelected = selectedMember === member.id || selectedMemberId === member.id;
              
              return (
                <div
                  key={member.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-300 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => handleMemberClick(member)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold text-xs">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-800">{member.name}</div>
                      <div className="text-xs text-gray-500">{team.name}</div>
                    </div>
                    {hasMessages && (
                      <div className="text-xs text-gray-400">
                        {member.messages.length} message{member.messages.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  
                  {/* Messages - Only show when expanded */}
                  {isExpanded && member.messages && member.messages.length > 0 && (
                    <div className="space-y-3 mt-2 border-t border-gray-200 pt-2">
                      {member.messages.map((message, msgIndex) => {
                        const messageText = message.original || message.text;
                        return (
                          <div key={msgIndex} className="space-y-2">
                            {/* Original Message */}
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-gray-600">Original Message</span>
                                {message.source && (
                                  <>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-500 capitalize">{message.source}</span>
                                  </>
                                )}
                              </div>
                              <p className="text-xs text-gray-700 leading-relaxed">{messageText}</p>
                            </div>
                            
                            {/* Categorized Versions */}
                            {message.categorizedVersions && message.categorizedVersions.length > 0 && (
                              <div className="space-y-1.5">
                                <div className="text-xs font-medium text-gray-600 mb-1">Categorized Versions:</div>
                                {message.categorizedVersions.map((version, versionIndex) => (
                                  <div
                                    key={versionIndex}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedMember(member.id);
                                      if (onMemberSelect) {
                                        onMemberSelect(member);
                                      }
                                      onMessageClick(member.name, version.type, version.text, project.name, team.name, version.source || 'outlook', documents);
                                    }}
                                    className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-xs font-medium px-2 py-1 rounded ${getMessageTypeColor(version.type)}`}>
                                          {version.type}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                      </div>
                                    </div>
                                    {version.source && (
                                      <div className="mb-2">
                                        <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                          <span className="text-gray-400">Sent from</span>
                                          <span className="font-medium text-gray-600 capitalize">{version.source}</span>
                                          <span className="text-gray-400">•</span>
                                          <span className="text-blue-600 font-medium">
                                            {member.name.toLowerCase()}@{version.source === 'outlook' ? 'outlook.com' : version.source === 'slack' ? 'slack.com' : 'teams.microsoft.com'}
                                          </span>
                                        </span>
                                      </div>
                                    )}
                                    <p className="text-xs text-gray-700 leading-relaxed">{version.text}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
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
