import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000';

function ProjectList({ onMessageSelect, onProjectSelect, refreshTrigger, documents }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [expandedTeams, setExpandedTeams] = useState(new Set());
  const [selectedMessage, setSelectedMessage] = useState(null);

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
      // Auto-expand first project
      if (data.length > 0) {
        setExpandedProjects(new Set([data[0].id]));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(`Failed to load projects: ${error.message}. Make sure the backend is running on ${API_BASE_URL}`);
      setLoading(false);
    }
  };

  const toggleProject = (projectId) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const toggleTeam = (projectId, teamId) => {
    const key = `${projectId}-${teamId}`;
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedTeams(newExpanded);
  };

  const handleMessageClick = async (memberName, messageType, messageText, projectName, teamName, documents) => {
    const messageKey = `${projectName}-${teamName}-${memberName}-${messageType}-${messageText}`;
    setSelectedMessage(messageKey);
    
    try {
      const response = await fetch(`${API_BASE_URL}/clarify-reply`, {
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
          documents: documents || {},
        }),
      });

      const data = await response.json();
      onMessageSelect(data, { 
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

  if (loading) {
    return <div className="p-4">Loading projects...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={fetchProjects}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Projects</h2>
        <button
          onClick={() => onProjectSelect('new')}
          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          <span>+</span>
          New Project
        </button>
      </div>
      
      <div className="space-y-2">
        {projects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg">
            {/* Project Header */}
            <div
              className="p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
              onClick={() => toggleProject(project.id)}
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-bold">
                  {expandedProjects.has(project.id) ? '▼' : '▶'}
                </span>
                <span className="font-semibold text-lg">{project.name}</span>
              </div>
              <span className="text-xs text-gray-500">
                {project.teams?.length || 0} team{project.teams?.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Teams */}
            {expandedProjects.has(project.id) && (
              <div className="p-2 space-y-2">
                {project.teams?.map((team) => {
                  const teamKey = `${project.id}-${team.id}`;
                  return (
                    <div key={team.id} className="border border-gray-200 rounded bg-white">
                      {/* Team Header */}
                      <div
                        className="p-2 bg-blue-50 hover:bg-blue-100 cursor-pointer flex items-center justify-between"
                        onClick={() => toggleTeam(project.id, team.id)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 text-sm">
                            {expandedTeams.has(teamKey) ? '▼' : '▶'}
                          </span>
                          <span className="font-medium">{team.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {team.members?.length || 0} member{team.members?.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Team Members */}
                      {expandedTeams.has(teamKey) && (
                        <div className="p-2 space-y-2">
                          {team.members?.map((member) => (
                            <div key={member.id} className="ml-4">
                              <div className="font-medium text-sm text-gray-700 mb-1">
                                {member.name}
                              </div>
                              <div className="space-y-1">
                                {member.messages?.map((message, msgIndex) => {
                                  const messageKey = `${project.name}-${team.name}-${member.name}-${message.type}-${message.text}`;
                                  const isSelected = selectedMessage === messageKey;
                                  return (
                                    <div
                                      key={msgIndex}
                                      onClick={() => handleMessageClick(
                                        member.name,
                                        message.type,
                                        message.text,
                                        project.name,
                                        team.name,
                                        documents
                                      )}
                                      className={`p-2 rounded transition-all text-xs cursor-pointer ${
                                        isSelected
                                          ? 'bg-blue-200 border-2 border-blue-500'
                                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                      }`}
                                    >
                                      <span
                                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mb-1 ${getMessageTypeColor(
                                          message.type
                                        )}`}
                                      >
                                        {message.type}
                                      </span>
                                      <p className="text-xs text-gray-700">{message.text}</p>
                                    </div>
                                  );
                                })}
                              </div>
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
        ))}
      </div>
    </div>
  );
}

export default ProjectList;

