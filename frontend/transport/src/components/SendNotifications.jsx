import React, { useState } from 'react';

const AdminNotifications = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [role, setRole] = useState('all');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSendNotification = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, type, role }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess('Notification sent successfully!');
        setTitle('');
        setMessage('');
      } else {
        setError(result.error || 'Failed to send notification.');
      }
    } catch (err) {
      setError('Error sending notification.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Send Notification</h2>

      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        placeholder="Title"
        className="border px-4 py-2 rounded w-full mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Message"
        className="border px-4 py-2 rounded w-full mb-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <select className="border px-4 py-2 rounded w-full mb-2" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="info">Info</option>
        <option value="alert">Alert</option>
        <option value="warning">Warning</option>
      </select>

      <select className="border px-4 py-2 rounded w-full mb-2" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="all">All</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>

      <button onClick={handleSendNotification} className="bg-blue-500 text-white px-4 py-2 rounded">
        Send Notification
      </button>
    </div>
  );
};

export default AdminNotifications;
