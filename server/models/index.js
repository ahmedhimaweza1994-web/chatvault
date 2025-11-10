import User from './User.js';
import Chat from './Chat.js';
import Message from './Message.js';
import MediaFile from './MediaFile.js';

// Define associations
User.hasMany(Chat, { foreignKey: 'user_id', as: 'chats' });
Chat.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Chat.hasMany(Message, { foreignKey: 'chat_id', as: 'messages' });
Message.belongsTo(Chat, { foreignKey: 'chat_id', as: 'chat' });

Message.hasMany(MediaFile, { foreignKey: 'message_id', as: 'media' });
MediaFile.belongsTo(Message, { foreignKey: 'message_id', as: 'message' });

Chat.hasMany(MediaFile, { foreignKey: 'chat_id', as: 'media' });
MediaFile.belongsTo(Chat, { foreignKey: 'chat_id', as: 'chat' });

User.hasMany(MediaFile, { foreignKey: 'user_id', as: 'media' });
MediaFile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export { User, Chat, Message, MediaFile };
