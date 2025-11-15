import { useState } from 'react';

function MemberMessagesView({ member, project, team, onMessageClick }) {
  const [expandedMessage, setExpandedMessage] = useState(null);

  if (!member) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a member to view messages</p>
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
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold text-sm">
            {member.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">{member.name}</h3>
            <p className="text-xs text-gray-500">{team?.name || 'Team'}</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {member.messages && member.messages.length > 0 ? (
            member.messages.map((message, msgIndex) => {
              const messageText = message.original || message.text;
              const isExpanded = expandedMessage === msgIndex;
              
              return (
                <div key={msgIndex} className="space-y-3">
                  {/* Original Message */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-600">Original Message</span>
                      {message.source && (
                        <>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500 capitalize">{message.source}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{messageText}</p>
                  </div>
                  
                  {/* Categorized Versions */}
                  {message.categorizedVersions && message.categorizedVersions.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-gray-600 mb-2">Categorized Versions:</div>
                      {message.categorizedVersions.map((version, versionIndex) => (
                        <div
                          key={versionIndex}
                          onClick={() => {
                            onMessageClick(member.name, version.type, version.text, project?.name || '', team?.name || '', version.source || 'outlook');
                          }}
                          className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-medium px-2.5 py-1 rounded ${getMessageTypeColor(version.type)}`}>
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
                          <p className="text-sm text-gray-700 leading-relaxed">{version.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No messages found for {member.name}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemberMessagesView;

