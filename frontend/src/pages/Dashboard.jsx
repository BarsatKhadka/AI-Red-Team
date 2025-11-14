import { useState } from 'react';
import ProjectList from '../components/ProjectList';
import AIReplyViewer from '../components/AIReplyViewer';
import DocumentButtons from '../components/DocumentButtons';
import NewProjectModal from '../components/NewProjectModal';

function Dashboard() {
  const [aiReply, setAiReply] = useState(null);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [documents, setDocuments] = useState({});

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
    // Trigger refresh of project list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Project Manager Dashboard</h1>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Project List */}
        <div className="w-1/2 border-r border-gray-300 bg-white">
          <ProjectList 
            onMessageSelect={handleMessageSelect}
            onProjectSelect={handleProjectSelect}
            refreshTrigger={refreshTrigger}
            documents={documents}
          />
        </div>
        
        {/* Right Panel - Document Buttons and AI Reply */}
        <div className="w-1/2 flex flex-col bg-gray-50 overflow-hidden">
          {/* Document Buttons - Top Right */}
          <div className="flex-shrink-0 p-2 border-b border-gray-300 bg-white">
            <DocumentButtons onDocumentsChange={setDocuments} />
          </div>
          
          {/* AI Reply Viewer - Takes rest of space */}
          <div className="flex-1 overflow-hidden">
            <AIReplyViewer 
              reply={aiReply} 
              loading={loading}
              messageData={currentMessage}
              onReplyEdit={handleReplyEdit}
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

