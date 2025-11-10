import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MediaFile = sequelize.define('MediaFile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  message_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'messages',
      key: 'id'
    },
    onDelete: 'CASCADE'
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
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  original_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  storage_path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  thumb_path: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mime_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size_bytes: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  duration: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  tableName: 'media_files',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['chat_id']
    },
    {
      fields: ['message_id']
    },
    {
      fields: ['user_id']
    }
  ]
});

export default MediaFile;
