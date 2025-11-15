import React, { useState } from 'react';
import { deliverables } from '../mockData/comprehensiveMockData';

/**
 * DeliverableReview Component
 * Lists deliverables with AI summary/review and approval actions
 * Includes slide-out drawer for detailed AI reasoning steps
 */
const DeliverableReview = () => {
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [deliverableStates, setDeliverableStates] = useState(
    deliverables.reduce((acc, d) => {
      acc[d.id] = { status: d.status, localStatus: d.status };
      return acc;
    }, {})
  );

  const handleApprove = (deliverableId) => {
    setDeliverableStates(prev => ({
      ...prev,
      [deliverableId]: { ...prev[deliverableId], localStatus: 'Approved' }
    }));
  };

  const handleNeedsRevision = (deliverableId) => {
    setDeliverableStates(prev => ({
      ...prev,
      [deliverableId]: { ...prev[deliverableId], localStatus: 'Needs Revision' }
    }));
  };

  const openDrawer = (deliverable) => {
    setSelectedDeliverable(deliverable);
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Needs Revision':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Deliverable Review</h1>
        <p className="text-gray-600">Review project deliverables with AI-powered analysis</p>
      </div>

      {/* Deliverables List */}
      <div className="space-y-6">
        {deliverables.map((deliverable) => {
          const currentStatus = deliverableStates[deliverable.id]?.localStatus || deliverable.status;
          
          return (
            <div 
              key={deliverable.id} 
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {deliverable.title}
                    </h2>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        📄 {deliverable.fileName}
                      </span>
                      <span className="flex items-center gap-1">
                        👤 {deliverable.uploadedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        📅 {formatDate(deliverable.uploadDate)}
                      </span>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(currentStatus)}`}>
                    {currentStatus}
                  </span>
                </div>
              </div>

              {/* AI Summary Section */}
              <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    🤖 AI SUMMARY
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {deliverable.aiSummaryPlaceholder}
                </p>
              </div>

              {/* AI Review Section */}
              <div className="px-6 py-4 bg-purple-50 border-b border-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    🤖 AI REVIEW
                  </span>
                  <button
                    onClick={() => openDrawer(deliverable)}
                    className="ml-auto text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1"
                  >
                    View Reasoning Steps →
                  </button>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {deliverable.aiReviewPlaceholder}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gray-50 flex gap-3">
                <button
                  onClick={() => handleApprove(deliverable.id)}
                  disabled={currentStatus === 'Approved'}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    currentStatus === 'Approved'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md'
                  }`}
                >
                  ✅ Approve Deliverable
                </button>
                <button
                  onClick={() => handleNeedsRevision(deliverable.id)}
                  disabled={currentStatus === 'Needs Revision'}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    currentStatus === 'Needs Revision'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-md'
                  }`}
                >
                  🔄 Needs Revision
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-out Drawer for AI Reasoning Steps */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeDrawer}
          />
          
          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-2xl flex flex-col">
            {/* Drawer Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">AI Reasoning Steps</h2>
                <button
                  onClick={closeDrawer}
                  className="text-white hover:text-gray-200 text-3xl font-light"
                >
                  ×
                </button>
              </div>
              <p className="text-indigo-100 text-sm mt-1">
                {selectedDeliverable?.title}
              </p>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedDeliverable?.detailedSteps ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                    <p className="text-sm text-blue-800 font-medium">
                      The AI analyzed this deliverable through a multi-step reasoning process to ensure comprehensive review against project requirements.
                    </p>
                  </div>

                  {selectedDeliverable.detailedSteps.map((step, index) => (
                    <div 
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 leading-relaxed">{step}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg mt-6">
                    <p className="text-sm text-green-800 font-medium">
                      ✓ Analysis complete. Review recommendation provided above.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No detailed reasoning steps available for this deliverable.</p>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <button
                onClick={closeDrawer}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliverableReview;
