import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MemberMemoryPanel from '../components/MemberMemoryPanel';
import ProjectsSidebar from '../components/ProjectsSidebar';
import TeamMembersPanel from '../components/TeamMembersPanel';

/**
 * MemoryPage Component
 * Dedicated page for viewing AI memory and context for team members
 */
function MemoryPage() {
  const location = useLocation();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Restore state from localStorage on mount
  useEffect(() => {
    const fetchProjectsAndRestore = async () => {
      try {
        const response = await fetch('http://localhost:8000/projects');
        if (response.ok) {
          const projectsData = await response.json();
          
          // Restore saved state
          const savedState = localStorage.getItem('dashboardState');
          if (savedState) {
            try {
              const state = JSON.parse(savedState);
              
              if (state.projectId) {
                const project = projectsData.find(p => p.id === state.projectId);
                if (project) {
                  setSelectedProject(project);
                  
                  if (state.teamId && project.teams) {
                    const team = project.teams.find(t => t.id === state.teamId);
                    if (team) {
                      setSelectedTeam(team);
                      
                      if (state.memberId && team.members) {
                        const member = team.members.find(m => m.id === state.memberId);
                        if (member) {
                          setTimeout(() => {
                            setSelectedMember(member);
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
      }
    };

    fetchProjectsAndRestore();
  }, []);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setSelectedTeam(null);
    setSelectedMember(null);
  };

  const handleTeamClick = (team, project) => {
    setSelectedTeam(team);
    setSelectedProject(project);
    setSelectedMember(null);
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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Projects Sidebar */}
        <div className="w-56 border-r border-border-light bg-bg-card">
          <ProjectsSidebar 
            onProjectSelect={() => {}}
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
            onMessageClick={() => {}}
            documents={{}}
          />
        </div>
        
        {/* Main Content - AI Memory Panel */}
        <div className="flex-1 bg-bg overflow-hidden">
          <MemberMemoryPanel 
            member={selectedMember}
            project={selectedProject}
            team={selectedTeam}
          />
        </div>
      </div>
    </div>
  );
}

export default MemoryPage;

