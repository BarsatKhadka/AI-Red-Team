import { useState } from 'react';

const API_BASE_URL = 'http://localhost:8000';

function ActionButtons({ currentMessage }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!currentMessage) {
    return null;
  }

  const handleApprove = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
        }),
      });

      const data = await response.json();
      setStatus('approved');
      console.log('Approved:', data);
    } catch (error) {
      console.error('Error approving:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
        }),
      });

      const data = await response.json();
      setStatus('rejected');
      console.log('Rejected:', data);
    } catch (error) {
      console.error('Error rejecting:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-center gap-4">
      <button
        onClick={handleApprove}
        disabled={loading}
        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading && status === 'approved' ? 'Processing...' : 'Approve'}
      </button>
      <button
        onClick={handleReject}
        disabled={loading}
        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading && status === 'rejected' ? 'Processing...' : 'Reject'}
      </button>
      {status && status !== 'error' && (
        <span className={`text-sm font-semibold ${
          status === 'approved' ? 'text-green-600' : 'text-red-600'
        }`}>
          {status === 'approved' ? '✓ Approved' : '✗ Rejected'}
        </span>
      )}
      {status === 'error' && (
        <span className="text-sm font-semibold text-red-600">
          Error occurred
        </span>
      )}
    </div>
  );
}

export default ActionButtons;

