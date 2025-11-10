import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function ChatList({ chats, onDelete, isDark }) {
  const navigate = useNavigate();

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusBadge = (status) => {
    const badges = {
      ready: { text: 'Ready', class: 'bg-green-100 text-green-800' },
      processing: { text: 'Processing', class: 'bg-yellow-100 text-yellow-800' },
      uploading: { text: 'Uploading', class: 'bg-blue-100 text-blue-800' },
      error: { text: 'Error', class: 'bg-red-100 text-red-800' }
    };
    const badge = badges[status] || badges.ready;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.class}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`${isDark ? 'bg-whatsapp-panel hover:bg-whatsapp-hover' : 'bg-whatsapp-panel-light hover:bg-whatsapp-hover-light'} rounded-xl p-5 border ${isDark ? 'border-whatsapp-border' : 'border-whatsapp-border-light'} transition cursor-pointer group`}
          onClick={() => chat.status === 'ready' && navigate(`/chat/${chat.id}`)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-whatsapp-text-primary' : 'text-whatsapp-text-primary-light'} truncate mb-1`}>
                {chat.chat_name}
              </h3>
              <p className={`text-sm ${isDark ? 'text-whatsapp-text-secondary' : 'text-whatsapp-text-secondary-light'}`}>
                {chat.message_count} messages
              </p>
            </div>
            {getStatusBadge(chat.status)}
          </div>

          {chat.last_message_preview && (
            <p className={`text-sm ${isDark ? 'text-whatsapp-text-secondary' : 'text-whatsapp-text-secondary-light'} line-clamp-2 mb-3`}>
              {chat.last_message_preview}
            </p>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className={isDark ? 'text-whatsapp-text-secondary' : 'text-whatsapp-text-secondary-light'}>
              {formatSize(chat.size_bytes)}
            </span>
            <span className={isDark ? 'text-whatsapp-text-secondary' : 'text-whatsapp-text-secondary-light'}>
              {formatDistanceToNow(new Date(chat.created_at), { addSuffix: true })}
            </span>
          </div>

          {chat.status === 'ready' && (
            <div className="mt-4 pt-4 border-t border-whatsapp-border flex items-center justify-between opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/chat/${chat.id}`);
                }}
                className="text-whatsapp-teal hover:text-whatsapp-secondary font-medium text-sm"
              >
                Open Chat
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(chat.id);
                }}
                className="text-red-500 hover:text-red-600 font-medium text-sm"
              >
                Delete
              </button>
            </div>
          )}

          {chat.status === 'error' && chat.error_message && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              {chat.error_message}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
