import dotenv from 'dotenv';
import './queue/processor.js';

dotenv.config();

console.log('🔄 Worker started - processing upload jobs');

process.on('SIGTERM', () => {
  console.log('Worker shutting down...');
  process.exit(0);
});
```
