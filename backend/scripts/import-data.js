import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

const backupFile = path.join(process.cwd(), 'backup.sql');

console.log('🔄 Starting data import...');

// Check if backup.sql exists
if (!existsSync(backupFile)) {
  console.error('❌ backup.sql file not found. Please ensure the file exists in the project root.');
  process.exit(1);
}

// Run Prisma db execute to import data
try {
  console.log('📥 Importing data from backup.sql...');
  execSync(`npx prisma db execute --file ${backupFile}`, { stdio: 'inherit' });
  console.log('✅ Data import completed successfully!');
} catch (error) {
  console.error('❌ Error during data import:', error.message);
  process.exit(1);
}
