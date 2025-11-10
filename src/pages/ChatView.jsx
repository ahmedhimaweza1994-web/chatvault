import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import api from '../api/client';
import MessageBubble from '../components/MessageBubble';
import { format } from 'date-fns';

export default function ChatView() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useThemeStore();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    loadChat();
    loadMessages();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChat = async () => {
    try {
      const data = await api.get(`/chats/${chatId}`);
      setChat(data.chat);
    } catch (error) {
      console.error('Failed to load chat:', error);
      navigate('/');
    }
  };

  const loadMessages = async () => {
    try {
      const data = await api.get(`/chats/${chatId}/messages?limit=1000`);
      setMessages(data.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const data = await api.get(`/chats/${chatId}/search?q=${encodeURIComponent(searchQuery)}`);
      setMessages(data.messages);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearch(false);
    loadMessages();
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(msg => {
      const date = format(new Date(msg.timestamp), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-whatsapp-bg' : 'bg-whatsapp-bg-light'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-whatsapp-teal border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-whatsapp-bg' : 'bg-whatsapp-bg-light'}`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-whatsapp-panel-header' : 'bg-whatsapp-panel-header-light'} border-b ${isDark ? 'border-whatsapp-border' : 'border-whatsapp-border-light'} px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className={`p-2 rounded-full ${isDark ? 'hover:bg-whatsapp-hover' : 'hover:bg-whatsapp-hover-light'} transition`}
            >
              <svg className={`w-6 h-6 ${isDark ? 'text-whatsapp-icon' : 'text-whatsapp-icon-light'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-whatsapp-teal rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {chat?.chat_name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className={`font-semibold ${isDark ? 'text-whatsapp-text-primary' : 'text-whatsapp-text-primary-light'}`}>
                  {chat?.chat_name}
                </h1>
                <p className={`text-sm ${isDark ? 'text-whatsapp-text-secondary' : 'text-whatsapp-text-secondary-light'}`}>
                  {messages.length} messages
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-full ${isDark ? 'hover:bg-whatsapp-hover' : 'hover:bg-whatsapp-hover-light'} transition`}
            >
              <svg className={`w-6 h-6 ${isDark ? 'text-whatsapp-icon' : 'text-whatsapp-icon-light'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="mt-3 flex items-center space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search messages..."
              className={`flex-1 px-4 py-2 rounded-lg ${isDark ? 'bg-whatsapp-bg text-whatsapp-text-primary' : 'bg-white text-gray-900'} border ${isDark ? 'border-whatsapp-border' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-whatsapp-teal`}
            />
            <button
              onClick={handleSearch}
              className="bg-whatsapp-teal hover:bg-whatsapp-secondary text-white px-4 py-2 rounded-lg transition"
            >
              Search
            </button>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className={`px-4 py-2 rounded-lg ${isDark ? 'bg-whatsapp-hover hover:bg-whatsapp-border text-whatsapp-text-primary' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} transition`}
              >
                Clear
              </button>
            )}
          </div>
        )}
      </header>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6"
        style={{
          backgroundImage: isDark 
            ? 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'%230b141a\'/%3E%3Cpath d=\'M20 20h60v60H20z\' fill=\'none\' stroke=\'%23182229\' stroke-width=\'0.5\' opacity=\'0.1\'/%3E%3C/svg%3E")'
            : 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'%23efeae2\'/%3E%3Cpath d=\'M20 20h60v60H20z\' fill=\'none\' stroke=\'%23d1d7db\' stroke-width=\'0.5\' opacity=\'0.3\'/%3E%3C/svg%3E")'
        }}
      >
        <div className="max-w-4xl mx-auto space-y-4">
          {Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date}>
              <div className="flex justify-center my-4">
                <div className={`${isDark ? 'bg-whatsapp-panel' : 'bg-white'} px-3 py-1 rounded-lg shadow-sm`}>
                  <span className={`text-xs ${isDark ? 'text-whatsapp-text-secondary' : 'text-gray-600'}`}>
                    {format(new Date(date), 'MMMM d, yyyy')}
                  </span>
                </div>
              </div>

              {msgs.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isDark={isDark}
                  chatId={chatId}
                />
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
