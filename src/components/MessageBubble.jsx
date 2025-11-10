import React, { useState } from 'react';
import { format } from 'date-fns';

export default function MessageBubble({ message, isDark, chatId }) {
  const [imageModal, setImageModal] = useState(false);
  const isMe = message.sender_is_me;

  const getMediaUrl = (media, thumb = false) => {
    const userId = localStorage.getItem('chatvault-auth') ? 
      JSON.parse(localStorage.getItem('chatvault-auth')).state.user.id : '';
    return `http://localhost:3000/media/${userId}/${chatId}/${media.original_name}${thumb ? '?thumb=true' : ''}`;
  };

  const renderMedia = () => {
    if (!message.media || message.media.length === 0) return null;

    const media = message.media[0];

    switch (message.message_type) {
      case 'image':
        return (
          <div className="mb-1 cursor-pointer" onClick={() => setImageModal(true)}>
            <img
              src={getMediaUrl(media, true)}
              alt={media.original_name}
              className="rounded-lg max-w-xs w-full h-auto"
              loading="lazy"
            />
          </div>
        );

      case 'video':
        return (
          <div className="mb-1">
            <video
              src={getMediaUrl(media)}
              controls
              className="rounded-lg max-w-xs w-full"
            />
          </div>
        );

      case 'audio':
        return (
          <div className="mb-1">
            <audio src={getMediaUrl(media)} controls className="w-full max-w-xs" />
          </div>
        );

      case 'document':
        return (
          <a
            href={getMediaUrl(media)}
            download={media.original_name}
            className="flex items-center space-x-2 mb-1 p-2 bg-black/10 rounded-lg hover:bg-black/20 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{media.original_name}</p>
              <p className="text-xs opacity-70">{(media.size_bytes / 1024).toFixed(1)} KB</p>
            </div>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        );

      default:
        return null;
    }
  };

  const renderBody = () => {
    if (!message.body) return null;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = message.body.split(urlRegex);

    return (
      <div className="whitespace-pre-wrap break-words">
        {parts.map((part, i) => {
          if (part.match(urlRegex)) {
            return (
              <a
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {part}
              </a>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <>
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className={`max-w-md ${isMe ? 'ml-12' : 'mr-12'}`}>
          {!isMe && (
            <p className={`text-xs ${isDark ? 'text-whatsapp-text-secondary' : 'text-gray-600'} mb-1 px-2`}>
              {message.sender_name}
            </p>
          )}
          <div
            className={`rounded-lg px-3 py-2 shadow-sm ${
              isMe
                ? isDark
                  ? 'bg-whatsapp-message-out text-white'
                  : 'bg-whatsapp-message-out-light text-gray-900'
                : isDark
                ? 'bg-whatsapp-message-in text-whatsapp-text-primary'
                : 'bg-whatsapp-message-in-light text-gray-900'
            }`}
            style={{
              borderRadius: isMe ? '8px 8px 0 8px' : '8px 8px 8px 0'
            }}
          >
            {renderMedia()}
            {renderBody()}
            <div className="flex items-center justify-end space-x-1 mt-1">
              <span className={`text-xs ${isMe ? 'text-white/70' : isDark ? 'text-whatsapp-text-secondary' : 'text-gray-500'}`}>
                {format(new Date(message.timestamp), 'h:mm a')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {imageModal && message.media && message.media[0] && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setImageModal(false)}
        >
          <button
            onClick={() => setImageModal(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={getMediaUrl(message.media[0])}
            alt={message.media[0].original_name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
