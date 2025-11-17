import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MemberMemoryPanel from '../components/MemberMemoryPanel';
import ProjectsSidebar from '../components/ProjectsSidebar';
import TeamMembersPanel from '../components/TeamMembersPanel';

async function fetchProjectsFromMCP() {
  try {
    const response = await fetch('http://localhost:8000/projects');
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Failed to fetch projects:', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

/**
 * MemoryPage Component
 * Dedicated page for viewing AI memory and context for team members
 */
function MemoryPage() {
  const location = useLocation();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchAndSetProjects = async () => {
      const projectsData = await fetchProjectsFromMCP();
      setProjects(projectsData);
    };

    fetchAndSetProjects();
  }, []);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    // Automatically select the first team when a project is clicked
    if (project && project.teams && project.teams.length > 0) {
      setSelectedTeam(project.teams[0]);
    } else {
      setSelectedTeam(null);
    }
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
            projects={projects}
            onProjectClick={handleProjectClick}
            selectedProjectId={selectedProject?.id}
          />
        </div>
        
        {/* Middle Panel - Team Members */}
        <div className="w-96 border-r border-border-light bg-bg-card">
          <TeamMembersPanel 
            project={selectedProject}
            team={selectedTeam}
            selectedMemberId={selectedMember?.id}
            onMemberSelect={handleMemberSelect}
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

