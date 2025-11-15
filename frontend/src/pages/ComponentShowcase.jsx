import React, { useState } from 'react';
import DeliverableReview from '../components/DeliverableReview';
import SmartSuggestionsPanel from '../components/SmartSuggestionsPanel';
import MockTimeline from '../components/MockTimeline';
import DocumentExplorer from '../components/DocumentExplorer';

/**
 * ComponentShowcase Page
 * Demonstrates all new AI-powered components
 */
const ComponentShowcase = () => {
  const [activeTab, setActiveTab] = useState('deliverables');

  const tabs = [
    { id: 'deliverables', name: 'Deliverable Review', icon: '📦', component: DeliverableReview },
    { id: 'suggestions', name: 'Smart Suggestions', icon: '💡', component: SmartSuggestionsPanel },
    { id: 'timeline', name: 'Project Timeline', icon: '📅', component: MockTimeline },
    { id: 'explorer', name: 'Document Explorer', icon: '🔍', component: DocumentExplorer }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Component Display Area */}
      <div className="py-8">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default ComponentShowcase;
