import { useState, useEffect } from 'react';
import ParsingMessage from './ParsingMessage';
import CategorizingMessage from './CategorizingMessage';
import AnimatedTag from './AnimatedTag';
import DatePicker from './DatePicker';
import { getMemberImage } from '../utils/memberImages';

function TeamMembersPanel({ project, team, selectedMemberId, onMemberSelect, onMessageClick, documents }) {
  const [selectedMember, setSelectedMember] = useState(null);
  const [expandedMember, setExpandedMember] = useState(null);
  const [expandedOriginalMessages, setExpandedOriginalMessages] = useState(new Set());
  const [parsingMessages, setParsingMessages] = useState(new Set());
  const [parsedMessages, setParsedMessages] = useState(new Set());
  const [categorizingMessages, setCategorizingMessages] = useState(new Set());
  const [categorizedMessages, setCategorizedMessages] = useState(new Set());
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to November 19, 2024 to match mock data
    return '2024-11-19';
  });

  // Automatically expand member when selected from sidebar
  useEffect(() => {
    if (selectedMemberId && team && team.members) {
      const member = team.members.find(m => m.id === selectedMemberId);
      if (member) {
        setExpandedMember(member.id);
        setSelectedMember(member.id);
        
        // Auto-expand all original messages for this member
        if (member.messages && member.messages.length > 0) {
          const messageKeys = member.messages.map((_, msgIndex) => `${member.id}-${msgIndex}`);
          setExpandedOriginalMessages(new Set(messageKeys));
          
          // Start categorization animation for messages with categorized versions (only if not already categorized)
          member.messages.forEach((msg, msgIndex) => {
            const messageKey = `${member.id}-${msgIndex}`;
            if (msg.categorizedVersions && msg.categorizedVersions.length > 0) {
              // Only trigger animation if not already categorized
              setCategorizedMessages(prev => {
                if (!prev.has(messageKey)) {
                  // Not categorized yet, start the animation
                  setCategorizingMessages(catPrev => new Set([...catPrev, messageKey]));
                }
                return prev;
              });
            }
          });
          
          // Start parsing all original messages
          member.messages.forEach((msg, msgIndex) => {
            const messageKey = `${member.id}-${msgIndex}`;
            if (msg.originalMessages && msg.originalMessages.length > 0) {
              msg.originalMessages.forEach((_, origIndex) => {
                const originalKey = `${messageKey}-original-${origIndex}`;
                setParsingMessages(prev => new Set([...prev, originalKey]));
              });
            } else if (msg.original || msg.text) {
              const originalKey = `${messageKey}-original-0`;
              setParsingMessages(prev => new Set([...prev, originalKey]));
            }
          });
        }
        
        // Find the member object and call onMemberSelect
        if (onMemberSelect) {
          onMemberSelect(member, team, project);
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
      <div className="h-full flex items-center justify-center bg-bg">
        <p className="text-text-secondary">Select a project to view team members</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="h-full flex items-center justify-center bg-bg">
        <p className="text-text-secondary">Select a team to view members</p>
      </div>
    );
  }

  const getMessageTypeColor = (type) => {
    switch (type) {
      case '@clarify':
        return 'bg-[#DBEAFE] text-[#1E40AF]';
      case '@availability':
        return 'bg-[#D1FAE5] text-[#065F46]';
      case '@progress_update':
        return 'bg-[#FEF3C7] text-[#92400E]';
      default:
        return 'bg-border-light text-text-primary';
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
      
      // Auto-expand all original messages for this member
      if (member.messages && member.messages.length > 0) {
        const messageKeys = member.messages.map((_, msgIndex) => `${member.id}-${msgIndex}`);
        setExpandedOriginalMessages(new Set(messageKeys));
        
        // Start categorization animation for messages with categorized versions (only if not already categorized)
        member.messages.forEach((msg, msgIndex) => {
          const messageKey = `${member.id}-${msgIndex}`;
          if (msg.categorizedVersions && msg.categorizedVersions.length > 0) {
            // Only trigger animation if not already categorized
            setCategorizedMessages(prev => {
              if (!prev.has(messageKey)) {
                // Not categorized yet, start the animation
                setCategorizingMessages(catPrev => new Set([...catPrev, messageKey]));
              }
              return prev;
            });
          }
        });
        
        // Start parsing all original messages
        member.messages.forEach((msg, msgIndex) => {
          const messageKey = `${member.id}-${msgIndex}`;
          if (msg.originalMessages && msg.originalMessages.length > 0) {
            msg.originalMessages.forEach((_, origIndex) => {
              const originalKey = `${messageKey}-original-${origIndex}`;
              setParsingMessages(prev => new Set([...prev, originalKey]));
            });
          } else if (msg.original || msg.text) {
            const originalKey = `${messageKey}-original-0`;
            setParsingMessages(prev => new Set([...prev, originalKey]));
          }
        });
      }
      
      if (onMemberSelect) {
        onMemberSelect(member, team, project);
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
    <div className="h-full flex flex-col bg-bg border-r border-border-light">
      <div className="h-16 flex items-center justify-between px-4 border-b border-border-light">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-text-primary">{team.name}</h3>
          <p className="text-sm text-text-secondary mt-0.5">{team.members?.length || 0} member{(team.members?.length || 0) !== 1 ? 's' : ''}</p>
        </div>
        {team.name === 'Backend Team' && (
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            minDate="2024-11-16"
            maxDate="2024-11-19"
          />
        )}
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
                  className={`p-4 rounded-md border cursor-pointer transition-all shadow-sm ${
                    isSelected
                      ? 'bg-bg-card border-primary shadow-sm'
                      : 'bg-bg-card border-border-light hover:border-border-medium hover:shadow-sm'
                  }`}
                  onClick={() => handleMemberClick(member)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {getMemberImage(member.name) ? (
                      <img 
                        src={getMemberImage(member.name)}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-avatar-alice flex items-center justify-center text-white font-medium text-sm">
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-text-primary">{member.name}</div>
                      <div className="text-xs text-text-secondary">{team.name}</div>
                    </div>
                    {hasMessages && (
                      <div className="text-xs text-text-tertiary">
                        {member.messages.length} message{member.messages.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  
                  {/* Messages - Only show when expanded */}
                  {isExpanded && member.messages && member.messages.length > 0 && (
                    <div className="space-y-3 mt-2 border-t border-border-light pt-2">
                      {(() => {
                        // Filter messages by date for Alice in Backend Team
                        let messagesToShow = member.messages;
                        if (member.name === 'Alice' && team.name === 'Backend Team') {
                          messagesToShow = member.messages.filter(msg => {
                            // If message has a date field, filter by it
                            if (msg.date) {
                              // Compare dates (handle both ISO format and date strings)
                              const msgDate = msg.date.split('T')[0]; // Get just the date part
                              const selectedDateOnly = selectedDate.split('T')[0];
                              return msgDate === selectedDateOnly;
                            }
                            // If no date field, only show on November 19, 2024 (default date)
                            return selectedDate === '2024-11-19';
                          });
                        }
                        
                        return messagesToShow.length > 0 ? (
                          messagesToShow.map((message, msgIndex) => {
                            // Find original index in full messages array for proper key
                            const originalIndex = member.messages.findIndex(m => m === message);
                            const messageKey = `${member.id}-${originalIndex >= 0 ? originalIndex : msgIndex}`;
                            const isOriginalExpanded = expandedOriginalMessages.has(messageKey);
                            
                            return (
                              <div key={messageKey} className="space-y-2">
                            {/* Original Messages - Collapsible */}
                            {message.originalMessages && message.originalMessages.length > 0 && (
                              <div className="space-y-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newExpanded = new Set(expandedOriginalMessages);
                                    if (isOriginalExpanded) {
                                      newExpanded.delete(messageKey);
                                    } else {
                                      newExpanded.add(messageKey);
                                      // Start parsing when expanded
                                      message.originalMessages.forEach((_, origIndex) => {
                                        const originalKey = `${messageKey}-original-${origIndex}`;
                                        if (!parsedMessages.has(originalKey)) {
                                          setParsingMessages(prev => new Set([...prev, originalKey]));
                                        }
                                      });
                                    }
                                    setExpandedOriginalMessages(newExpanded);
                                  }}
                                  className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-between transition-colors"
                                >
                                  <span className="text-xs font-medium text-gray-600">
                                    Original Messages ({message.originalMessages.length})
                                  </span>
                                  <svg 
                                    className={`w-4 h-4 text-gray-500 transition-transform ${isOriginalExpanded ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                
                                {isOriginalExpanded && (
                                  <div className="space-y-2 pl-2">
                                    {message.originalMessages.map((originalMsg, origIndex) => {
                                      const originalKey = `${messageKey}-original-${origIndex}`;
                                      const isParsing = parsingMessages.has(originalKey) && !parsedMessages.has(originalKey);
                                      const isParsed = parsedMessages.has(originalKey);
                                      
                                      return (
                                        <div key={origIndex} className="p-2 bg-gradient-to-br from-bg-card to-bg-card/50 rounded-md border border-border-light shadow-sm">
                                          <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-medium text-text-primary">
                                              Original message on {originalMsg.source}
                                            </span>
                                            {isParsing && (
                                              <div className="flex items-center gap-1.5">
                                                <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                                                <span className="text-[10px] text-text-tertiary italic">Parsing...</span>
                                              </div>
                                            )}
                                          </div>
                                          {isParsing ? (
                                            <ParsingMessage
                                              text={originalMsg.text}
                                              showContextAnalysis={false}
                                              onComplete={() => {
                                                setParsedMessages(prev => new Set([...prev, originalKey]));
                                                setParsingMessages(prev => {
                                                  const newSet = new Set(prev);
                                                  newSet.delete(originalKey);
                                                  return newSet;
                                                });
                                              }}
                                            />
                                          ) : (
                                            <p className="text-[10px] text-text-primary leading-relaxed whitespace-pre-wrap">{originalMsg.text}</p>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Fallback for old format (backward compatibility) */}
                            {(!message.originalMessages || message.originalMessages.length === 0) && (message.original || message.text) && (
                              <div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newExpanded = new Set(expandedOriginalMessages);
                                    if (isOriginalExpanded) {
                                      newExpanded.delete(messageKey);
                                    } else {
                                      newExpanded.add(messageKey);
                                      // Start parsing when expanded
                                      const originalKey = `${messageKey}-original-0`;
                                      if (!parsedMessages.has(originalKey)) {
                                        setParsingMessages(prev => new Set([...prev, originalKey]));
                                      }
                                    }
                                    setExpandedOriginalMessages(newExpanded);
                                  }}
                                  className="w-full text-left px-3 py-2 bg-bg hover:bg-border-light rounded-lg border border-border-light flex items-center justify-between transition-colors"
                                >
                                  <span className="text-xs font-medium text-text-primary">Original Message</span>
                                  <svg 
                                    className={`w-4 h-4 text-text-secondary transition-transform ${isOriginalExpanded ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                
                                {isOriginalExpanded && (() => {
                                  const originalKey = `${messageKey}-original-0`;
                                  const isParsing = parsingMessages.has(originalKey) && !parsedMessages.has(originalKey);
                                  const isParsed = parsedMessages.has(originalKey);
                                  
                                  return (
                                    <div className="p-2 bg-gradient-to-br from-bg-card to-bg-card/50 rounded-md border border-border-light mt-2 shadow-sm">
                                      <div className="flex items-center gap-2 mb-2">
                                        {message.source && (
                                          <>
                                            <span className="text-[10px] text-text-tertiary">•</span>
                                            <span className="text-[10px] text-text-secondary capitalize">{message.source}</span>
                                          </>
                                        )}
                                        {isParsing && (
                                          <div className="flex items-center gap-1.5 ml-auto">
                                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                                            <span className="text-[10px] text-text-tertiary italic">Parsing...</span>
                                          </div>
                                        )}
                                      </div>
                                      {isParsing ? (
                                        <ParsingMessage
                                          text={message.original || message.text}
                                          showContextAnalysis={false}
                                          onComplete={() => {
                                            setParsedMessages(prev => new Set([...prev, originalKey]));
                                            setParsingMessages(prev => {
                                              const newSet = new Set(prev);
                                              newSet.delete(originalKey);
                                              return newSet;
                                            });
                                          }}
                                        />
                                      ) : (
                                        <p className="text-[10px] text-text-primary leading-relaxed whitespace-pre-wrap">{message.original || message.text}</p>
                                      )}
                                    </div>
                                  );
                                })()}
                              </div>
                            )}
                            
                            {/* Categorized Versions with AI Animation */}
                            {message.categorizedVersions && message.categorizedVersions.length > 0 && (
                              <div className="space-y-2">
                                {!categorizedMessages.has(messageKey) ? (
                                  <CategorizingMessage
                                    originalText={message.original || message.text}
                                    categorizedVersions={message.categorizedVersions}
                                    onCategorizationComplete={() => {
                                      setCategorizedMessages(prev => new Set([...prev, messageKey]));
                                      setCategorizingMessages(prev => {
                                        const newSet = new Set(prev);
                                        newSet.delete(messageKey);
                                        return newSet;
                                      });
                                    }}
                                  />
                                ) : (
                                  <>
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-xs font-semibold text-text-primary">AI Categorized Versions:</span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {message.categorizedVersions.map((version, versionIndex) => (
                                          <AnimatedTag
                                            key={versionIndex}
                                            label={version.type}
                                            colorClass={getMessageTypeColor(version.type)}
                                            delay={versionIndex * 50}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                    {message.categorizedVersions.map((version, versionIndex) => (
                                      <div
                                        key={versionIndex}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedMember(member.id);
                                          if (onMemberSelect) {
                                            onMemberSelect(member, team, project);
                                          }
                                          onMessageClick(member.name, version.type, version.text, project.name, team.name, version.source || 'outlook', documents);
                                        }}
                                        className="p-4 bg-bg-card rounded-md border border-border-light hover:border-primary hover:shadow-md cursor-pointer transition-all animate-in fade-in slide-in-from-bottom-2"
                                        style={{ animationDelay: `${versionIndex * 100}ms` }}
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-sm ${getMessageTypeColor(version.type)}`}>
                                              {version.type}
                                            </span>
                                            <span className="text-xs text-text-tertiary">
                                              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                          </div>
                                        </div>
                                        {version.source && (
                                          <div className="mb-2 flex items-center gap-1.5 flex-wrap">
                                            <span className="text-xs text-text-tertiary">Sent from</span>
                                            <span className="text-xs font-medium text-text-secondary capitalize">{version.source}</span>
                                            <span className="text-xs text-text-tertiary">•</span>
                                            <span className="text-xs text-primary font-normal">
                                              {member.name.toLowerCase()}@{version.source === 'outlook' ? 'outlook.com' : version.source === 'slack' ? 'slack.com' : 'teams.microsoft.com'}
                                            </span>
                                          </div>
                                        )}
                                        <p className="text-sm text-text-primary leading-relaxed">{version.text}</p>
                                      </div>
                                    ))}
                                  </>
                                )}
                              </div>
                            )}
                            </div>
                          );
                        })
                        ) : (
                          <div className="text-center py-4 text-sm text-text-secondary">
                            No messages for this date
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-text-secondary text-sm">
              No members found in this team.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamMembersPanel;
