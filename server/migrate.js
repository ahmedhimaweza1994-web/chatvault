import sequelize from './config/database.js';
import { User, Chat, Message, MediaFile } from './models/index.js';

async function migrate() {
  try {
    console.log('🔄 Starting database migration...');
    
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    await sequelize.sync({ alter: true });
    console.log('✅ Database schema synchronized');
    
    console.log('🎉 Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
