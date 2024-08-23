"use client";

import { useState } from 'react';
import axios from 'axios';
import { FaUser, FaLock } from 'react-icons/fa';
import MenuBar from '../components/MenuBar';
import { useRouter } from 'next/navigation';

export default function AdminSettings() {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post('http://localhost:8000/api/update-admin/', 
        { username: newUsername },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.data.message) {
        setSuccess('Username updated successfully');
        setNewUsername('');
      } else if (response.data.error) {
        setError(response.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || 'Failed to update username');
      } else {
        setError('Failed to update username');
      }
      console.error(error);
    }
  };


  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post('http://localhost:8000/api/update-admin/', 
        { password: newPassword },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.data.message) {
        setSuccess('Password updated successfully');
        setNewPassword('');
        setConfirmPassword('');
      } else if (response.data.error) {
        setError(response.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || 'Failed to update password');
      } else {
        setError('Failed to update password');
      }
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('adminSession');
    router.push('/admin');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <MenuBar onLogout={handleLogout} />
      <div className="flex-grow p-8">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-800 text-white text-xl font-bold">
            Admin Settings
          </div>
          <div className="p-6 space-y-6">
            <form onSubmit={handleUsernameChange} className="space-y-4">
              <div className="flex items-center space-x-2">
                <FaUser className="text-gray-400" />
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="New Username"
                  className="flex-grow p-2 border rounded"
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Change Username
              </button>
            </form>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="flex items-center space-x-2">
                <FaLock className="text-gray-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="flex-grow p-2 border rounded"
                />
              </div>
              <div className="flex items-center space-x-2">
                <FaLock className="text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="flex-grow p-2 border rounded"
                />
              </div>
              <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                Change Password
              </button>
            </form>

            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-500">{success}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}