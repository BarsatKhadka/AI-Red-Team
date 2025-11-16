import { useState, useEffect } from 'react';
import AILoadingIndicator from './AILoadingIndicator';

/**
 * MemberMemoryPanel Component
 * Shows AI's memory and understanding of each team member
 */
function MemberMemoryPanel({ member, project, team }) {
  const [memory, setMemory] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [contextReferences, setContextReferences] = useState([]);

  useEffect(() => {
    if (!member) {
      setMemory(null);
      return;
    }

    // Simulate AI analyzing member's memory
    setIsAnalyzing(true);
    const analyzeMemory = async () => {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate AI memory based on member's messages
      const messages = member.messages || [];
      const clarifyCount = messages.filter(m => 
        m.categorizedVersions?.some(v => v.type === '@clarify')
      ).length;
      const progressCount = messages.filter(m => 
        m.categorizedVersions?.some(v => v.type === '@progress_update')
      ).length;
      const availabilityCount = messages.filter(m => 
        m.categorizedVersions?.some(v => v.type === '@availability')
      ).length;

      // Generate context references
      const references = [];
      if (project) {
        references.push({
          type: 'project',
          label: `Project: ${project.name}`,
          icon: '📁',
          relevance: 'High'
        });
      }
      if (team) {
        references.push({
          type: 'team',
          label: `Team: ${team.name}`,
          icon: '👥',
          relevance: 'High'
        });
      }
      if (clarifyCount > 0) {
        references.push({
          type: 'pattern',
          label: `${clarifyCount} clarification requests`,
          icon: '❓',
          relevance: 'Medium'
        });
      }
      if (progressCount > 0) {
        references.push({
          type: 'pattern',
          label: `${progressCount} progress updates`,
          icon: '📊',
          relevance: 'Medium'
        });
      }

      setMemory({
        memberId: member.id,
        memberName: member.name,
        totalInteractions: messages.length,
        communicationPattern: clarifyCount > progressCount ? 'Proactive' : 'Results-focused',
        keyTopics: [
          ...new Set(
            messages.flatMap(m => 
              m.categorizedVersions?.map(v => {
                if (v.text.toLowerCase().includes('api')) return 'API Integration';
                if (v.text.toLowerCase().includes('design')) return 'Design';
                if (v.text.toLowerCase().includes('deadline')) return 'Timeline';
                if (v.text.toLowerCase().includes('blocked')) return 'Blockers';
                return null;
              }).filter(Boolean)
            )
          )
        ],
        lastInteraction: messages.length > 0 ? new Date().toISOString() : null,
        contextReferences: references
      });

      setContextReferences(references);
      setIsAnalyzing(false);
    };

    analyzeMemory();
  }, [member, project, team]);

  if (!member) {
    return (
      <div className="h-full flex items-center justify-center bg-bg p-8">
        <div className="text-center space-y-3 max-w-md">
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-xl font-bold text-text-primary">AI Memory & Context</h2>
          <p className="text-sm text-text-secondary">
            Select a team member from the sidebar to view their AI memory, context references, and interaction patterns.
          </p>
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-xs text-text-secondary mb-2">AI Memory includes:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">💬 Past Messages</span>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">📁 Project Files</span>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">📊 Task History</span>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">🔗 Context Links</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-bg to-primary/5">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border-light bg-bg">
        <div>
          <h3 className="text-sm font-bold text-text-primary">🧠 AI Memory</h3>
          <p className="text-xs text-text-tertiary mt-0.5">{member.name}</p>
        </div>
        {isAnalyzing && (
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isAnalyzing ? (
          <div className="space-y-3">
            <AILoadingIndicator message="Analyzing member context..." size="sm" />
            <div className="space-y-2">
              <div className="h-2 bg-primary/20 rounded-full animate-pulse" style={{ width: '70%' }} />
              <div className="h-2 bg-primary/20 rounded-full animate-pulse" style={{ width: '50%' }} />
            </div>
          </div>
        ) : memory ? (
          <>
            {/* Context References */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-3 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-primary">🔗 Active Context References</span>
              </div>
              <div className="space-y-1.5">
                {contextReferences.map((ref, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs animate-in fade-in"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <span>{ref.icon}</span>
                    <span className="text-text-primary flex-1">{ref.label}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${
                      ref.relevance === 'High' 
                        ? 'bg-success/20 text-success' 
                        : 'bg-primary/20 text-primary'
                    }`}>
                      {ref.relevance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Memory Summary */}
            <div className="bg-bg-card rounded-lg p-3 border border-border-light">
              <h4 className="text-xs font-semibold text-text-primary mb-2">Memory Summary</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Interactions:</span>
                  <span className="font-medium text-text-primary">{memory.totalInteractions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Communication Style:</span>
                  <span className="font-medium text-primary">{memory.communicationPattern}</span>
                </div>
                {memory.keyTopics.length > 0 && (
                  <div>
                    <span className="text-text-secondary">Key Topics:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {memory.keyTopics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs animate-in fade-in"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-primary-light to-primary/5 rounded-lg p-3 border border-primary/20">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-xs">AI</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-primary mb-1">AI Insights</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Based on {memory.totalInteractions} interactions, {member.name} demonstrates a{' '}
                    <span className="font-medium text-text-primary">{memory.communicationPattern.toLowerCase()}</span>{' '}
                    communication approach. The AI has cross-referenced this with project files and past interactions
                    to build a comprehensive understanding of working patterns and preferences.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default MemberMemoryPanel;

