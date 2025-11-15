import { useState } from 'react';
import ProjectsSidebar from '../components/ProjectsSidebar';
import TeamMembersPanel from '../components/TeamMembersPanel';
import ProjectFiles from '../components/ProjectFiles';
import MemberBioSummary from '../components/MemberBioSummary';
import SuggestionBox from '../components/SuggestionBox';
import NewProjectModal from '../components/NewProjectModal';

function Dashboard() {
  const [aiReply, setAiReply] = useState(null);
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

  const handleMessageSelect = (replyData, messageData) => {
    setAiReply(replyData);
    setCurrentMessage(messageData);
    setEditedReply(replyData?.reply || '');
    setIsEditing(false);
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
    setSelectedMember(member);
    if (team) {
      setSelectedTeam(team);
    }
    if (project) {
      setSelectedProject(project);
    }
  };

  const handleMessageClick = async (memberName, messageType, messageText, projectName, teamName, messageSource) => {
    // Find and set the selected member
    if (selectedTeam && selectedTeam.members) {
      const member = selectedTeam.members.find(m => m.name === memberName);
      if (member) {
        setSelectedMember(member);
      }
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/clarify-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_name: memberName,
          message_type: messageType,
          message_text: messageText,
          project_name: projectName,
          team_name: teamName,
          documents: {},
        }),
      });

      const data = await response.json();
      handleMessageSelect(data, { 
        memberName, 
        messageType, 
        messageText,
        projectName,
        teamName,
        messageSource: messageSource || 'outlook'
      });
    } catch (error) {
      console.error('Error getting AI reply:', error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Projects Sidebar */}
        <div className="w-56 border-r border-gray-300 bg-white">
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
        <div className="w-80 border-r border-gray-300 bg-white">
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
        <div className="flex-1 flex bg-gray-50 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Project Files - Top */}
            <div className="flex-shrink-0 border-b border-gray-300 bg-white">
              <ProjectFiles />
            </div>
            
            {/* Member Bio Summary - Profile Analysis */}
            <div className="flex-shrink-0 border-b border-gray-300 bg-white px-6 py-3">
              <MemberBioSummary 
                member={selectedMember}
                project={selectedProject}
                team={selectedTeam}
              />
            </div>
            
            {/* AI Conversation - Below Profile Analysis */}
            {currentMessage && (
              <div className="flex-1 overflow-y-auto bg-gray-50 border-b border-gray-300">
                <div className="p-4 space-y-3">
                  {/* Original Message */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                      {currentMessage.memberName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-800">{currentMessage.memberName || 'User'}</span>
                        <span className="text-xs text-gray-500">
                          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        {currentMessage.messageSource && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500 capitalize">{currentMessage.messageSource}</span>
                          </>
                        )}
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <span className={`text-xs font-medium px-2 py-1 rounded mr-2 ${getMessageTypeColor(currentMessage.messageType)}`}>
                          {currentMessage.messageType}
                        </span>
                        <p className="text-xs text-gray-700 leading-relaxed mt-2">{currentMessage.messageText}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Reply */}
                  {loading && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        AI
                      </div>
                      <div className="flex-1">
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs text-blue-700">Generating reply...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {aiReply && !loading && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        AI
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-blue-800">AI Assistant</span>
                            <span className="text-xs text-gray-500">
                              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          
                          {/* Action Buttons */}
                          {!isEditing && (
                            <div className="flex items-center gap-2">
                              {/* Send Options Dropdown */}
                              <div className="relative">
                                <button
                                  onClick={() => setShowSendOptions(!showSendOptions)}
                                  className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium text-xs flex items-center gap-1.5"
                                >
                                  <span>Send to {currentMessage.memberName}</span>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                
                                {showSendOptions && (
                                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[220px] z-20 overflow-hidden">
                                    <div className="py-1.5">
                                      <button
                                        onClick={() => {
                                          const email = `${currentMessage.memberName.toLowerCase()}@outlook.com`;
                                          alert(`Reply sent to ${currentMessage.memberName} via Outlook (${email})`);
                                          setShowSendOptions(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center gap-3 text-xs transition-colors group"
                                      >
                                        <div className="w-7 h-7 rounded bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <div className="font-semibold text-gray-800 text-xs">Outlook</div>
                                          <div className="text-xs text-gray-500 mt-0.5">{currentMessage.memberName.toLowerCase()}@outlook.com</div>
                                        </div>
                                      </button>
                                      <button
                                        onClick={() => {
                                          alert(`Reply sent to ${currentMessage.memberName} via Slack`);
                                          setShowSendOptions(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-purple-50 flex items-center gap-3 text-xs transition-colors group border-t border-gray-100"
                                      >
                                        <div className="w-7 h-7 rounded bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52 2.527 2.527 0 0 1 2.52 2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52 2.528 2.528 0 0 1-2.521 2.523 2.528 2.528 0 0 1-2.521-2.523zm2.521-9.043A2.528 2.528 0 0 1 11.355 8.647a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.525zm9.043 9.043a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.521-2.523 2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.52 2.52zm2.521-9.043a2.528 2.528 0 0 1-2.525 2.525 2.528 2.528 0 0 1-2.523-2.525 2.528 2.528 0 0 1 2.523-2.521 2.528 2.528 0 0 1 2.525 2.521zM15.165 21.313a2.528 2.528 0 0 1-2.523 2.521 2.528 2.528 0 0 1-2.525-2.521 2.528 2.528 0 0 1 2.525-2.523 2.528 2.528 0 0 1 2.523 2.523zM21.313 12.042a2.528 2.528 0 0 1-2.521 2.52 2.528 2.528 0 0 1-2.523-2.52 2.528 2.528 0 0 1 2.523-2.521 2.528 2.528 0 0 1 2.521 2.521z"/>
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <div className="font-semibold text-gray-800 text-xs">Slack</div>
                                          <div className="text-xs text-gray-500 mt-0.5">Direct message</div>
                                        </div>
                                      </button>
                                      <button
                                        onClick={() => {
                                          alert(`Reply sent to ${currentMessage.memberName} via Microsoft Teams`);
                                          setShowSendOptions(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center gap-3 text-xs transition-colors group border-t border-gray-100"
                                      >
                                        <div className="w-7 h-7 rounded bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19.5 4.5h-15A1.5 1.5 0 0 0 3 6v12a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5zm-1.5 9h-3 v3h-3v-3H9v-3h3V7.5h3V9h3v4.5z"/>
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <div className="font-semibold text-gray-800 text-xs">Microsoft Teams</div>
                                          <div className="text-xs text-gray-500 mt-0.5">Chat message</div>
                                        </div>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Edit Button */}
                              <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-xs"
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs resize-none"
                              rows="8"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={handleCancel}
                                className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-xs"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSave}
                                className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">{aiReply.reply || ''}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {!currentMessage && (
              <div className="flex-1 overflow-hidden bg-gray-50"></div>
            )}
          </div>
          
          {/* Suggestion Box - Right Side */}
          <div className="w-80 border-l border-gray-300 flex-shrink-0">
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
