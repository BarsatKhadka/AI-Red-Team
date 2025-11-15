import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000';

function ProjectsSidebar({ onProjectSelect, refreshTrigger, onProjectClick, selectedProjectId, selectedTeamId, onTeamClick }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProjects, setExpandedProjects] = useState(new Set());

  useEffect(() => {
    fetchProjects();
  }, [refreshTrigger]);

  const fetchProjects = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProjects(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(`Failed to load projects: ${error.message}`);
      setLoading(false);
    }
  };

  const handleProjectClick = (project, e) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(project.id)) {
      newExpanded.delete(project.id);
    } else {
      newExpanded.add(project.id);
    }
    setExpandedProjects(newExpanded);
    onProjectClick(project);
  };

  const handleTeamClick = (team, project, e) => {
    e.stopPropagation();
    if (onTeamClick) {
      onTeamClick(team, project);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3">
        <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-700">
          <p className="font-semibold mb-1">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-800">Projects</h3>
          <button
            onClick={() => onProjectSelect('new')}
            className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            + New
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {projects.map((project) => {
            const isExpanded = expandedProjects.has(project.id);
            const isSelected = selectedProjectId === project.id;
            
            return (
              <div key={project.id}>
                {/* Project Row */}
                <div
                  onClick={(e) => handleProjectClick(project, e)}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-100 border-l-2 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                    <span className="text-xs">📁</span>
                    <span className="text-sm font-medium text-gray-800 truncate">{project.name}</span>
                  </div>
                </div>

                {/* Teams - Shown when project is expanded */}
                {isExpanded && project.teams && project.teams.length > 0 && (
                  <div className="ml-4 space-y-0.5 mt-0.5">
                    {project.teams.map((team) => {
                      const isSelected = selectedTeamId === team.id;
                      return (
                        <div
                          key={team.id}
                          onClick={(e) => handleTeamClick(team, project, e)}
                          className={`py-1 px-2 cursor-pointer rounded text-sm ${
                            isSelected
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {team.name}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProjectsSidebar;

