import { useState, useCallback, useRef, useEffect } from 'react';
import ProjectsSidebar from '../components/ProjectsSidebar';
import TeamMembersPanel from '../components/TeamMembersPanel';
import ProjectFiles from '../components/ProjectFiles';
import MemberBioSummary from '../components/MemberBioSummary';
import SuggestionBox from '../components/SuggestionBox';
import NewProjectModal from '../components/NewProjectModal';
import StreamingText from '../components/StreamingText';
import AILoadingIndicator from '../components/AILoadingIndicator';
import ParsingMessage from '../components/ParsingMessage';
import { getMemberImage } from '../utils/memberImages';

function Dashboard() {
  const [aiReply, setAiReply] = useState(null);
  const [streamedReplyText, setStreamedReplyText] = useState('');
  const streamedReplyTextRef = useRef('');
  const [currentMessage, setCurrentMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReply, setEditedReply] = useState('');
  const [showSendOptions, setShowSendOptions] = useState(false);
  const [showTeamRouting, setShowTeamRouting] = useState(false);
  const [expandedProfile, setExpandedProfile] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamComplete, setStreamComplete] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parsingComplete, setParsingComplete] = useState(false);
  const expandedProfileRef = useRef(false);
  const [projects, setProjects] = useState([]);
  const [isRestoring, setIsRestoring] = useState(true);
  const [promptText, setPromptText] = useState('');

  // Save state to localStorage whenever selections change
  useEffect(() => {
    if (!isRestoring) {
      const state = {
        projectId: selectedProject?.id || null,
        teamId: selectedTeam?.id || null,
        memberId: selectedMember?.id || null,
        expandedProfile: expandedProfile,
      };
      localStorage.setItem('dashboardState', JSON.stringify(state));
    }
  }, [selectedProject?.id, selectedTeam?.id, selectedMember?.id, expandedProfile, isRestoring]);

  // Restore state from localStorage on mount
  useEffect(() => {
    const fetchProjectsAndRestore = async () => {
      try {
        const response = await fetch('http://localhost:8000/projects');
        if (response.ok) {
          const projectsData = await response.json();
          setProjects(projectsData);
          
          // Small delay to ensure components are mounted
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Restore saved state
          const savedState = localStorage.getItem('dashboardState');
          if (savedState) {
            try {
              const state = JSON.parse(savedState);
              
              // Find and restore project
              if (state.projectId) {
                const project = projectsData.find(p => p.id === state.projectId);
                if (project) {
                  setSelectedProject(project);
                  
                  // Find and restore team
                  if (state.teamId && project.teams) {
                    const team = project.teams.find(t => t.id === state.teamId);
                    if (team) {
                      setSelectedTeam(team);
                      setSelectedProject(project);
                      
                      // Find and restore member
                      if (state.memberId && team.members) {
                        const member = team.members.find(m => m.id === state.memberId);
                        if (member) {
                          // Small delay to ensure UI is ready
                          setTimeout(() => {
                            setSelectedMember(member);
                            if (state.expandedProfile) {
                              setExpandedProfile(true);
                              expandedProfileRef.current = true;
                            }
                          }, 200);
                        }
                      }
                    }
                  }
                }
              }
            } catch (e) {
              console.warn('Failed to restore state:', e);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsRestoring(false);
      }
    };

    fetchProjectsAndRestore();
  }, []);

  // Sync ref with state (backup sync, but we update ref directly in handlers)
  useEffect(() => {
    if (expandedProfileRef.current !== expandedProfile) {
      console.log('useEffect syncing ref: state is', expandedProfile, 'ref was', expandedProfileRef.current);
      expandedProfileRef.current = expandedProfile;
    }
  }, [expandedProfile]);

  const handleExpandProfile = useCallback(() => {
    console.log('handleExpandProfile called, current ref:', expandedProfileRef.current);
    // Update ref FIRST, then state
    expandedProfileRef.current = true;
    setExpandedProfile(true);
    console.log('Set expandedProfile to true, ref updated to:', expandedProfileRef.current);
  }, []);

  const handleCollapseProfile = useCallback(() => {
    setExpandedProfile(false);
  }, []);

  const handleMessageSelect = (replyData, messageData) => {
    console.log('handleMessageSelect called, expandedProfile ref:', expandedProfileRef.current);
    const wasExpanded = expandedProfileRef.current;
    console.log('Was expanded before message select:', wasExpanded);
    
    // Only restart streaming if this is a new message (different from current)
    const isNewMessage = !currentMessage || 
      currentMessage.memberName !== messageData.memberName ||
      currentMessage.messageText !== messageData.messageText ||
      currentMessage.messageType !== messageData.messageType;
    
    setAiReply(replyData);
    setCurrentMessage(messageData);
    setEditedReply(replyData?.reply || '');
    setIsEditing(false);
    
    // Only start streaming if it's a new message
    if (isNewMessage) {
      setIsStreaming(true);
      setStreamComplete(false);
    }
    
    setIsParsing(false);
    setParsingComplete(false);
    setPromptText('');
    
    // Explicitly preserve expandedProfile state when a message is selected
    // Use a longer timeout to ensure this happens after ALL state updates
    if (wasExpanded) {
      console.log('Preserving expandedProfile state...');
      setTimeout(() => {
        console.log('Restoring expandedProfile to true');
        setExpandedProfile(true);
        expandedProfileRef.current = true;
      }, 50);
    } else {
      console.log('Not preserving - was not expanded');
    }
  };

  const handleReplyEdit = (editedText) => {
    setAiReply({
      ...aiReply,
      reply: editedText
    });
    setEditedReply(editedText);
  };

  const handleSave = () => {
    handleReplyEdit(editedReply);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedReply(aiReply?.reply || '');
    setIsEditing(false);
  };

  const handleProjectSelect = (action) => {
    if (action === 'new') {
      setShowNewProjectModal(true);
    }
  };

  const handleProjectCreated = () => {
    setShowNewProjectModal(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setSelectedTeam(null);
    setSelectedMember(null);
    setAiReply(null);
    setCurrentMessage(null);
  };

  const handleTeamClick = (team, project) => {
    setSelectedTeam(team);
    setSelectedProject(project);
    setSelectedMember(null);
    setAiReply(null);
    setCurrentMessage(null);
  };

  const handleMemberSelect = (member, team, project) => {
    console.log('handleMemberSelect called, expandedProfile ref:', expandedProfileRef.current);
    // Only reset if it's a different member
    if (selectedMember?.id !== member?.id) {
      setExpandedProfile(false); // Reset to compact when selecting a new member
      expandedProfileRef.current = false;
    }
    setSelectedMember(member);
    if (team) {
      setSelectedTeam(team);
    }
    if (project) {
      setSelectedProject(project);
    }
  };

  const handleMessageClick = async (memberName, messageType, messageText, projectName, teamName, messageSource) => {
    console.log('handleMessageClick called, expandedProfile ref:', expandedProfileRef.current);
    // Find and set the selected member (only if different to avoid unnecessary re-renders)
    if (selectedTeam && selectedTeam.members) {
      const member = selectedTeam.members.find(m => m.name === memberName);
      if (member) {
        // Only update if it's a different member
        if (selectedMember?.id !== member.id) {
          setSelectedMember(member);
          // Reset expanded profile when clicking a message from a different member
          // But check if user just expanded it
          if (!expandedProfileRef.current) {
            setExpandedProfile(false);
          }
        }
        // If it's the same member, DO NOT reset expandedProfile - preserve user's choice
      }
    }
    
    // Set message data and start streaming directly
    const messageData = { 
      memberName, 
      messageType, 
      messageText,
      text: messageText,
      messageText: messageText,
      projectName,
      teamName,
      messageSource: messageSource || 'outlook'
    };
    
    // Set the current message and start streaming
    setCurrentMessage(messageData);
    setIsStreaming(true);
    setStreamComplete(false);
    setLoading(false);
    setStreamedReplyText(''); // Reset streamed text
    streamedReplyTextRef.current = ''; // Reset ref
    
    // Store request body for streaming - use a stable object
    const requestBody = {
          member_name: memberName,
          message_type: messageType,
          message_text: messageText,
          project_name: projectName,
          team_name: teamName,
          documents: {},
    };
    
    setAiReply({
      reply: '',
      sourceDocuments: ['Technical Design Document'],
      requestBody: requestBody
    });
  };

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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Projects Sidebar */}
        <div className="w-56 border-r border-border-light bg-bg-card">
          <ProjectsSidebar 
            onProjectSelect={handleProjectSelect}
            refreshTrigger={refreshTrigger}
            onProjectClick={handleProjectClick}
            selectedProjectId={selectedProject?.id}
            selectedTeamId={selectedTeam?.id}
            selectedMemberId={selectedMember?.id}
            onTeamClick={handleTeamClick}
            onMemberClick={handleMemberSelect}
          />
        </div>
        
        {/* Middle Panel - Team Members */}
        <div className="w-96 border-r border-border-light bg-bg-card">
          <TeamMembersPanel 
            project={selectedProject}
            team={selectedTeam}
            selectedMemberId={selectedMember?.id}
            onMemberSelect={handleMemberSelect}
            onMessageClick={handleMessageClick}
            documents={{}}
          />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex bg-bg overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Project Files - Top */}
            <div className="flex-shrink-0 border-b border-border-light bg-bg-card">
              <ProjectFiles />
            </div>
            
            {/* Member Bio Summary - Profile Analysis */}
            {selectedMember && (
              <>
              <div 
                className="flex-shrink-0 border-b border-border-light bg-bg-card px-6 py-3"
                onClick={(e) => e.stopPropagation()}
              >
                <MemberBioSummary 
                  member={selectedMember}
                  project={selectedProject}
                  team={selectedTeam}
                  compact={currentMessage !== null && expandedProfile === false}
                  onExpand={handleExpandProfile}
                  onCollapse={handleCollapseProfile}
                />
              </div>
              </>
            )}
            
            {/* AI Conversation - Below Profile Analysis */}
            {currentMessage && (
              <div className="flex-1 overflow-y-auto bg-bg border-b border-border-light">
                <div className="p-4 space-y-3">
                  {/* Categorized Message - Show the clicked version */}
                  <div className="flex items-start gap-3">
                    {getMemberImage(currentMessage.memberName) ? (
                      <img 
                        src={getMemberImage(currentMessage.memberName)}
                        alt={currentMessage.memberName}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-avatar-alice flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                        {currentMessage.memberName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-text-primary">{currentMessage.memberName || 'User'}</span>
                        <span className="text-xs text-text-tertiary">
                          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        {currentMessage.messageSource && (
                          <>
                            <span className="text-xs text-text-tertiary">•</span>
                            <span className="text-xs font-medium text-text-secondary capitalize">{currentMessage.messageSource}</span>
                          </>
                        )}
                      </div>
                      <div className="bg-gradient-to-br from-bg-card to-bg-card/50 rounded-md p-4 border border-border-light shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-sm ${getMessageTypeColor(currentMessage.messageType)}`}>
                          {currentMessage.messageType}
                        </span>
                        </div>
                        <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{currentMessage.messageText}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Reply */}
                  {loading && (
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                      <img 
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=AI-Assistant&backgroundColor=4f46e5"
                        alt="AI Assistant"
                          className="w-8 h-8 rounded-full object-cover"
                      />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-bg-card animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-md p-4 border border-primary/20 shadow-sm">
                          <AILoadingIndicator message="AI is analyzing..." size="sm" />
                          <div className="mt-3 space-y-2">
                            <div className="h-2 bg-primary/20 rounded-full animate-pulse" style={{ width: '60%' }} />
                            <div className="h-2 bg-primary/20 rounded-full animate-pulse mt-2" style={{ width: '80%' }} />
                            <div className="h-2 bg-primary/20 rounded-full animate-pulse mt-2" style={{ width: '40%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {(aiReply || isStreaming) && !loading && (
                    <div className="flex items-start gap-3">
                      <img 
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=AI-Assistant&backgroundColor=4f46e5"
                        alt="AI Assistant"
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-primary">AI Assistant</span>
                            <span className="text-xs text-text-tertiary">
                              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          
                          {/* Action Buttons - Always visible when not editing */}
                          {!isEditing && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {/* Route to Team Dropdown */}
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowTeamRouting(!showTeamRouting);
                                  }}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-medium text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                  </svg>
                                  <span>Route to Team</span>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                
                                {showTeamRouting && selectedProject && selectedProject.teams && (
                                  <div className="absolute right-0 top-full mt-2 bg-white border border-border-light rounded-lg shadow-xl min-w-[200px] z-50 overflow-hidden">
                                    <div className="py-1.5">
                                      {selectedProject.teams.map((team) => (
                                        <button
                                          key={team.id}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const teamName = team.name.toLowerCase().replace(/\s+/g, '-');
                                            alert(`Issue routed to @${teamName} team channel`);
                                            setShowTeamRouting(false);
                                          }}
                                          className="w-full text-left px-4 py-2.5 hover:bg-primary-light flex items-center gap-3 text-xs transition-colors group"
                                        >
                                          <div className="w-7 h-7 rounded bg-primary-light flex items-center justify-center group-hover:bg-primary transition-colors">
                                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                          </div>
                                          <div className="flex-1">
                                            <div className="font-semibold text-text-primary text-xs">@{team.name}</div>
                                            <div className="text-xs text-text-secondary mt-0.5">Team channel</div>
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Send Options Dropdown */}
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowSendOptions(!showSendOptions);
                                  }}
                                  className="px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white rounded font-medium text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
                                >
                                  <span>Send to {currentMessage.memberName}</span>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                
                                {showSendOptions && (
                                  <div className="absolute right-0 top-full mt-2 bg-white border border-border-light rounded-lg shadow-xl min-w-[220px] z-50 overflow-hidden">
                                    <div className="py-1.5">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const email = `${currentMessage.memberName.toLowerCase()}@outlook.com`;
                                          alert(`Reply sent to ${currentMessage.memberName} via Outlook (${email})`);
                                          setShowSendOptions(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-primary-light flex items-center gap-3 text-xs transition-colors group"
                                      >
                                        <div className="w-7 h-7 rounded bg-primary-light flex items-center justify-center group-hover:bg-primary transition-colors">
                                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <div className="font-semibold text-text-primary text-xs">Outlook</div>
                                          <div className="text-xs text-text-secondary mt-0.5">{currentMessage.memberName.toLowerCase()}@outlook.com</div>
                                        </div>
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          alert(`Reply sent to ${currentMessage.memberName} via Slack`);
                                          setShowSendOptions(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-primary-light flex items-center gap-3 text-xs transition-colors group border-t border-border-light"
                                      >
                                        <div className="w-7 h-7 rounded bg-primary-light flex items-center justify-center group-hover:bg-primary transition-colors">
                                          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52 2.527 2.527 0 0 1 2.52 2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52 2.528 2.528 0 0 1-2.521 2.523 2.528 2.528 0 0 1-2.521-2.523zm2.521-9.043A2.528 2.528 0 0 1 11.355 8.647a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.525zm9.043 9.043a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.521-2.523 2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.52 2.52zm2.521-9.043a2.528 2.528 0 0 1-2.525 2.525 2.528 2.528 0 0 1-2.523-2.525 2.528 2.528 0 0 1 2.523-2.521 2.528 2.528 0 0 1 2.525 2.521zM15.165 21.313a2.528 2.528 0 0 1-2.523 2.521 2.528 2.528 0 0 1-2.525-2.521 2.528 2.528 0 0 1 2.525-2.523 2.528 2.528 0 0 1 2.523 2.523zM21.313 12.042a2.528 2.528 0 0 1-2.521 2.52 2.528 2.528 0 0 1-2.523-2.52 2.528 2.528 0 0 1 2.523-2.521 2.528 2.528 0 0 1 2.521 2.521z"/>
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <div className="font-semibold text-text-primary text-xs">Slack</div>
                                          <div className="text-xs text-text-secondary mt-0.5">Direct message</div>
                                        </div>
                                      </button>
                                      <button
                                        onClick={() => {
                                          alert(`Reply sent to ${currentMessage.memberName} via Microsoft Teams`);
                                          setShowSendOptions(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-primary-light flex items-center gap-3 text-xs transition-colors group border-t border-border-light"
                                      >
                                        <div className="w-7 h-7 rounded bg-primary-light flex items-center justify-center group-hover:bg-primary transition-colors">
                                          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19.5 4.5h-15A1.5 1.5 0 0 0 3 6v12a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5zm-1.5 9h-3v3h-3v-3H9v-3h3V7.5h3V9h3v4.5z"/>
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <div className="font-semibold text-text-primary text-xs">Microsoft Teams</div>
                                          <div className="text-xs text-text-secondary mt-0.5">Chat message</div>
                                        </div>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Edit Button */}
                              <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded font-medium text-xs transition-colors whitespace-nowrap"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {isEditing ? (
                          <div className="space-y-2">
                            <textarea
                              value={editedReply}
                              onChange={(e) => setEditedReply(e.target.value)}
                              className="w-full px-3 py-2 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs resize-none"
                              rows="8"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={handleCancel}
                                className="px-3 py-1.5 bg-border-medium text-text-primary rounded hover:bg-border-light text-xs"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSave}
                                className="px-3 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded text-xs transition-colors"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gradient-to-br from-primary-light to-primary/5 rounded-md p-4 border border-primary/20 shadow-sm">
                            {isStreaming && !streamComplete ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                  <span className="text-xs font-medium text-primary">
                                    {aiReply?.requestBody?.modification_prompt ? 'AI is updating reply...' : 'AI is writing...'}
                                  </span>
                                </div>
                                <StreamingText
                                  key={aiReply?.requestBody ? JSON.stringify(aiReply.requestBody) : `default-${streamComplete ? 'complete' : 'streaming'}`}
                                  endpoint={aiReply?.requestBody ? 'http://localhost:8000/clarify-reply-stream' : (aiReply?.reply ? 'http://localhost:8000/clarify-reply-stream' : 'http://localhost:8000/streaming-text')}
                                  requestBody={aiReply?.requestBody || (aiReply?.reply ? {
                                    member_name: currentMessage?.memberName || '',
                                    message_type: currentMessage?.messageType || '',
                                    message_text: currentMessage?.text || currentMessage?.messageText || '',
                                    project_name: selectedProject?.name || '',
                                    team_name: selectedTeam?.name || '',
                                    documents: {}
                                  } : { text: aiReply?.reply || '' })}
                                  onTextUpdate={(text) => {
                                    // Update the ref and state - this is the source of truth during streaming
                                    setStreamedReplyText(text);
                                    streamedReplyTextRef.current = text;
                                    console.log('Text update - length:', text.length, 'preview:', text.substring(0, 50));
                                  }}
                                  onComplete={() => {
                                    // Get the final text from ref (always has latest value)
                                    const finalText = streamedReplyTextRef.current || streamedReplyText || '';
                                    
                                    console.log('Streaming complete, final text:', finalText.substring(0, 150));
                                    console.log('Streaming complete, final text length:', finalText.length);
                                    
                                    // Update aiReply with final text immediately (before clearing requestBody)
                                    setAiReply(prev => {
                                      if (prev) {
                                        return { 
                                          ...prev, 
                                          reply: finalText,
                                          requestBody: null // Clear requestBody so it shows the final reply
                                        };
                                      }
                                      return { 
                                        reply: finalText, 
                                        sourceDocuments: ['Technical Design Document'], 
                                        requestBody: null 
                                      };
                                    });
                                    
                                    // Update state flags after aiReply is updated
                                    // Use a small delay to ensure React processes the aiReply update first
                                    setTimeout(() => {
                                      setIsStreaming(false);
                                      setStreamComplete(true);
                                    }, 100);
                                  }}
                                  className="text-sm text-text-primary leading-relaxed"
                                />
                                
                                {/* Prompt Input to Modify AI Reply - Below streaming */}
                                <div className="mt-4 pt-4 border-t border-primary/20">
                                  <div className="mb-2">
                                    <label className="text-xs font-medium text-text-secondary mb-1 block">
                                      Prompt AI to Modify Reply
                                    </label>
                                  </div>
                                  <textarea
                                    value={promptText}
                                    onChange={(e) => setPromptText(e.target.value)}
                                    className="w-full px-3 py-2 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none bg-bg"
                                    rows="2"
                                    placeholder="e.g., Make it more concise, add more technical details..."
                                  />
                                  <div className="flex gap-2 mt-2 justify-end">
                                    <button
                                      onClick={() => setPromptText('')}
                                      className="px-3 py-1.5 bg-border-medium text-text-primary rounded hover:bg-border-light text-xs transition-colors"
                                    >
                                      Clear
                                    </button>
                                    <button
                                      onClick={async () => {
                                        if (!currentMessage || !promptText.trim()) return;
                                        setIsStreaming(true);
                                        setStreamComplete(false);
                                        setLoading(false);
                                        
                                        // Use the streamed reply text or fallback to aiReply.reply
                                        // Get the latest text from ref first, then state, then aiReply
                                        const previousReply = streamedReplyTextRef.current || streamedReplyText || aiReply?.reply || '';
                                        
                                        console.log('Modify Reply - Previous reply:', previousReply.substring(0, 100));
                                        console.log('Modify Reply - Prompt:', promptText);
                                        
                                        // Create stable request body object
                                        const newRequestBody = {
                                          member_name: currentMessage.memberName,
                                          message_type: currentMessage.messageType,
                                          message_text: currentMessage.text || currentMessage.messageText || '',
                                          project_name: selectedProject?.name || '',
                                          team_name: selectedTeam?.name || '',
                                          modification_prompt: promptText,
                                          previous_reply: previousReply, // Make sure this is the actual previous reply
                                          documents: {}
                                        };
                                        
                                        // Force a new stream by clearing and resetting
                                        setStreamedReplyText('');
                                        streamedReplyTextRef.current = '';
                                        setStreamComplete(false);
                                        
                                        // Update aiReply with new request body for streaming
                                        // This will trigger the StreamingText component to call /clarify-reply-stream with AI
                                        setAiReply({
                                          reply: '', // Clear old reply
                                          sourceDocuments: aiReply?.sourceDocuments || ['Technical Design Document'],
                                          requestBody: newRequestBody // This ensures it uses /clarify-reply-stream endpoint (AI-powered)
                                        });
                                        
                                        setPromptText('');
                                        
                                        console.log('Modify Reply - Request body set:', {
                                          hasRequestBody: !!newRequestBody,
                                          hasModificationPrompt: !!newRequestBody.modification_prompt,
                                          hasPreviousReply: !!newRequestBody.previous_reply,
                                          previousReplyLength: newRequestBody.previous_reply?.length || 0
                                        });
                                      }}
                                      className="px-3 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded text-xs transition-colors"
                                    >
                                      Modify Reply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-2 h-2 bg-success rounded-full" />
                                  <span className="text-xs font-medium text-success">AI reply complete</span>
                                </div>
                                <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                                  {(() => {
                                    // Always prefer the most recent text - check ref first, then state, then aiReply
                                    const displayText = streamedReplyTextRef.current || streamedReplyText || aiReply?.reply || '';
                                    console.log('Displaying reply - length:', displayText.length, 'preview:', displayText.substring(0, 100));
                                    return displayText;
                                  })()}
                                </p>
                                
                                {/* Prompt Input to Modify AI Reply - Inside the box */}
                                <div className="mt-4 pt-4 border-t border-primary/20">
                                  <div className="mb-2">
                                    <label className="text-xs font-medium text-text-secondary mb-1 block">
                                      Prompt AI to Modify Reply
                                    </label>
                                  </div>
                                  <textarea
                                    value={promptText}
                                    onChange={(e) => setPromptText(e.target.value)}
                                    className="w-full px-3 py-2 border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none bg-bg"
                                    rows="2"
                                    placeholder="e.g., Make it more concise, add more technical details..."
                                  />
                                  <div className="flex gap-2 mt-2 justify-end">
                                    <button
                                      onClick={() => setPromptText('')}
                                      className="px-3 py-1.5 bg-border-medium text-text-primary rounded hover:bg-border-light text-xs transition-colors"
                                    >
                                      Clear
                                    </button>
                                    <button
                                      onClick={async () => {
                                        if (!currentMessage || !promptText.trim()) return;
                                        setLoading(true);
                                        setIsStreaming(true);
                                        setStreamComplete(false);
                                        setAiReply(null);
                                        
                                        try {
                                          const endpoint = currentMessage.messageType === '@clarify' 
                                            ? 'http://localhost:8000/clarify-reply'
                                            : 'http://localhost:8000/agent/reply';
                                          
                                          const response = await fetch(endpoint, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                              message_text: currentMessage.text || currentMessage.messageText || '',
                                              member_name: currentMessage.memberName,
                                              message_type: currentMessage.messageType,
                                              project_name: selectedProject?.name || '',
                                              team_name: selectedTeam?.name || '',
                                              modification_prompt: promptText,
                                              documents: {}
                                            })
                                          });
                                          
                                          if (response.ok) {
                                            const data = await response.json();
                                            setAiReply(data);
                                            setPromptText('');
                                          }
                                        } catch (error) {
                                          console.error('Error fetching AI reply:', error);
                                        } finally {
                                          setLoading(false);
                                        }
                                      }}
                                      disabled={!promptText.trim() || loading}
                                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      Update AI Reply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {!currentMessage && (
              <div className="flex-1 overflow-hidden bg-bg"></div>
            )}
          </div>
          
          {/* Suggestion Box - Right Side */}
          <div className="w-80 border-l border-border-light flex-shrink-0">
            <SuggestionBox />
          </div>
        </div>
      </div>
      
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}

export default Dashboard;
