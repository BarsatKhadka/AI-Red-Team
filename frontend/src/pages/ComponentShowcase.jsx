import React, { useState } from 'react';
import DeliverableReview from '../components/DeliverableReview';
import SmartSuggestionsPanel from '../components/SmartSuggestionsPanel';
import MockTimeline from '../components/MockTimeline';
import DocumentExplorer from '../components/DocumentExplorer';
import PricingPlans from '../components/PricingPlans';

/**
 * ComponentShowcase Page
 * Demonstrates all new AI-powered components
 */
const ComponentShowcase = () => {
  const [activeTab, setActiveTab] = useState('deliverables');

  const tabs = [
    { id: 'deliverables', name: 'Deliverable Review', icon: '📦', component: DeliverableReview },
    { id: 'pricing', name: 'Pricing Plans', icon: '💰', component: PricingPlans },
    { id: 'suggestions', name: 'Smart Suggestions', icon: '💡', component: SmartSuggestionsPanel },
    { id: 'timeline', name: 'Project Timeline', icon: '📅', component: MockTimeline },
    { id: 'explorer', name: 'Document Explorer', icon: '🔍', component: DocumentExplorer }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-bg">
      {/* Navigation Tabs */}
      <div className="bg-bg-card border-b border-border-light sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-bg-elevated text-text-primary hover:bg-border-light border border-border-light'
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
