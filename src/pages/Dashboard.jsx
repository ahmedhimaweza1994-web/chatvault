import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import api from '../api/client';
import ChatList from '../components/ChatList';
import UploadModal from '../components/UploadModal';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const data = await api.get('/chats');
      setChats(data.chats);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (chatId) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;

    try {
      await api.delete(`/chats/${chatId}`);
      setChats(chats.filter(c => c.id !== chatId));
    } catch (error) {
      console.error('Failed to delete chat:', error);
      alert('Failed to delete chat');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-whatsapp-bg' : 'bg-whatsapp-bg-light'}`}>
      <header className={`${isDark ? 'bg-whatsapp-panel-header' : 'bg-whatsapp-panel-header-light'} border-b ${isDark ? 'border-whatsapp-border' : 'border-whatsapp-border-light'} sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-whatsapp-teal rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isDark ? 'text-whatsapp-text-primary' : 'text-whatsapp-text-primary-light'}`}>
                  ChatVault
                </h1>
                <p className={`text-sm ${isDark ? 'text-whatsapp-text-secondary' : 'text-whatsapp-text-secondary-light'}`}>
                  Welcome, {user?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${isDark ? 'hover:bg-whatsapp-hover' : 'hover:bg-whatsapp-hover-light'} transition`}
              >
                {isDark ? (
                  <svg className="w-6 h-6 text-whatsapp-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-whatsapp-icon-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <button
                onClick={handleLogout}
                className={`px-4 py-2 rounded-lg font-semibold transition ${isDark ? 'bg-whatsapp-hover hover:bg-whatsapp-border text-whatsapp-text-primary' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-whatsapp-text-primary' : 'text-whatsapp-text-primary-light'}`}>
            Your Chats
          </h2>
          <button
            onClick={() => setShowUpload(true)}
            className="bg-whatsapp-teal hover:bg-whatsapp-secondary text-white px-6 py-3 rounded-lg font-semibold transition flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Upload Chat</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-whatsapp-teal border-t-transparent"></div>
          </div>
        ) : chats.length === 0 ? (
          <div className={`text-center py-12 ${isDark ? 'bg-whatsapp-panel' : 'bg-white'} rounded-xl border ${isDark ? 'border-whatsapp-border' : 'border-gray-200'}`}>
            <svg className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-whatsapp-icon' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.97-4.03 4.03-4.03 4.03 0 0 1 4.03 4.03c0 4.97-4.03 4.03-4.03 4.03z" />
            </svg>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-whatsapp-text-primary' : 'text-gray-900'}`}>
              No chats yet
            </h3>
            <p className={`${isDark ? 'text-whatsapp-text-secondary' : 'text-gray-600'} mb-4`}>
              Upload your first WhatsApp chat to get started
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-whatsapp-teal hover:bg-whatsapp-secondary text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Upload Chat
            </button>
          </div>
        ) : (
          <ChatList chats={chats} onDelete={handleDelete} isDark={isDark} />
        )}
      </main>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onComplete={() => {
            setShowUpload(false);
            loadChats();
          }}
          isDark={isDark}
        />
      )}
    </div>
  );
}
