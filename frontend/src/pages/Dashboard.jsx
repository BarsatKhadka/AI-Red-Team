import { useState } from 'react';
import MessageList from '../components/MessageList';
import PDFViewer from '../components/PDFViewer';
import ActionButtons from '../components/ActionButtons';

function Dashboard() {
  const [pdfURL, setPdfURL] = useState(null);
  const [currentMessage, setCurrentMessage] = useState(null);

  const handleMessageSelect = (url, messageData) => {
    setPdfURL(url);
    setCurrentMessage(messageData);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Team Message Dashboard</h1>
      </header>
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Message List */}
        <div className="w-1/2 border-r border-gray-300 bg-white">
          <MessageList onMessageSelect={handleMessageSelect} />
        </div>
        
        {/* Right Panel - PDF Viewer and Actions */}
        <div className="w-1/2 flex flex-col bg-gray-50">
          <div className="flex-1 overflow-hidden">
            <PDFViewer pdfURL={pdfURL} />
          </div>
          <ActionButtons currentMessage={currentMessage} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

