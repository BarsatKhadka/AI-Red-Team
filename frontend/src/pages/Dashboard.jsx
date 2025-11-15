import { useState } from 'react';
import ProjectsSidebar from '../components/ProjectsSidebar';
import TeamMembersPanel from '../components/TeamMembersPanel';
import AIReplyViewer from '../components/AIReplyViewer';
import ProjectFiles from '../components/ProjectFiles';
import MemberBioSummary from '../components/MemberBioSummary';
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
  const [editRequested, setEditRequested] = useState(0);
  const [saveRequested, setSaveRequested] = useState(0);
  const [cancelRequested, setCancelRequested] = useState(0);

  const handleMessageSelect = (replyData, messageData) => {
    setAiReply(replyData);
    setCurrentMessage(messageData);
  };

  const handleReplyEdit = (editedReply) => {
    setAiReply(editedReply);
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

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
  };

  const handleMessageClick = async (memberName, messageType, messageText, projectName, teamName) => {
    // Find and set the selected member
    if (selectedTeam && selectedTeam.members) {
      const member = selectedTeam.members.find(m => m.name === memberName);
      if (member) {
        setSelectedMember(member);
      }
    }
    
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
        teamName 
      });
    } catch (error) {
      console.error('Error getting AI reply:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Projects Sidebar (narrow) */}
        <div className="w-48 border-r border-gray-300 bg-white">
          <ProjectsSidebar 
            onProjectSelect={handleProjectSelect}
            refreshTrigger={refreshTrigger}
            onProjectClick={handleProjectClick}
            selectedProjectId={selectedProject?.id}
            selectedTeamId={selectedTeam?.id}
            onTeamClick={handleTeamClick}
          />
        </div>
        
        {/* Middle Panel - Team Members (medium) */}
        <div className="w-80 border-r border-gray-300 bg-white">
          <TeamMembersPanel 
            project={selectedProject}
            team={selectedTeam}
            onMemberSelect={handleMemberSelect}
            onMessageClick={handleMessageClick}
            documents={{}}
          />
        </div>
        
        {/* Right Panel - Project Files, Member Bio, and AI Reply */}
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          {/* Project Files - Top */}
          <div className="flex-shrink-0 border-b border-gray-300 bg-white">
            <ProjectFiles />
          </div>
          
          {/* Member Bio Summary - Directly below Project Files */}
          <div className="flex-shrink-0 border-b border-gray-300 bg-white px-4 py-3">
            <MemberBioSummary 
              member={selectedMember}
              project={selectedProject}
              team={selectedTeam}
            />
          </div>
          
          {/* AI Reply Viewer - Below Member Bio */}
          <div className="flex-1 overflow-hidden">
            <AIReplyViewer 
              reply={aiReply} 
              loading={loading}
              messageData={currentMessage}
              onReplyEdit={handleReplyEdit}
              onEditChange={setIsEditing}
              externalIsEditing={isEditing}
              onEditRequest={editRequested}
              onSaveRequest={saveRequested}
              onCancelRequest={cancelRequested}
            />
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

