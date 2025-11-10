import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  chat_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  original_filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  upload_uuid: {
    type: DataTypes.UUID,
    allowNull: false
  },
  message_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  size_bytes: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('uploading', 'processing', 'ready', 'error'),
    defaultValue: 'uploading'
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  last_message_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_message_preview: {
    type: DataTypes.STRING(200),
    allowNull: true
  }
}, {
  tableName: 'chats',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    }
  ]
});

export default Chat;
