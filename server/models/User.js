import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  storage_used: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

User.prototype.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password_hash);
};

User.beforeCreate = async (user) => {
  if (user.password_hash) {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    user.password_hash = await bcrypt.hash(user.password_hash, rounds);
  }
};

export default User;
