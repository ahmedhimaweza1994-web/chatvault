import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  chat_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'chats',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  sender_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sender_is_me: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  message_type: {
    type: DataTypes.ENUM('text', 'image', 'video', 'audio', 'document', 'link', 'system'),
    defaultValue: 'text'
  },
  order_index: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['chat_id', 'order_index']
    },
    {
      fields: ['chat_id', 'timestamp']
    },
    {
      fields: ['message_type']
    }
  ]
});

export default Message;
