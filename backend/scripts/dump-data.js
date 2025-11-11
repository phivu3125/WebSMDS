import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function exportData() {
  console.log('🔄 Exporting data to backup.sql...');

  try {
    // Fetch all data from tables
    const users = await prisma.user.findMany();
    const events = await prisma.event.findMany();
    const eventSections = await prisma.eventSection.findMany();
    const eventRegistrations = await prisma.eventRegistration.findMany();
    const products = await prisma.product.findMany();
    const productCategories = await prisma.product_categories.findMany();
    const orders = await prisma.order.findMany();
    const orderItems = await prisma.orderItem.findMany();
    const press = await prisma.press.findMany();
    const stories = await prisma.story.findMany();
    const ideas = await prisma.idea.findMany();
    const pastEvents = await prisma.pastEvent.findMany();
    const emailSubscriptions = await prisma.emailSubscription.findMany();
    const talkSections = await prisma.talkSection.findMany();

    let sql = '';

    // Generate INSERT statements
    sql += generateInserts('users', users);
    sql += generateInserts('events', events);
    sql += generateInserts('event_sections', eventSections);
    sql += generateInserts('event_registrations', eventRegistrations);
    sql += generateInserts('products', products);
    sql += generateInserts('product_categories', productCategories);
    sql += generateInserts('orders', orders);
    sql += generateInserts('order_items', orderItems);
    sql += generateInserts('press', press);
    sql += generateInserts('stories', stories);
    sql += generateInserts('ideas', ideas);
    sql += generateInserts('past_events', pastEvents);
    sql += generateInserts('email_subscriptions', emailSubscriptions);
    sql += generateInserts('talk_sections', talkSections);

    // Write to file
    fs.writeFileSync('backup.sql', sql);
    console.log('✅ backup.sql created successfully!');
  } catch (error) {
    console.error('❌ Error exporting data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function generateInserts(tableName, records) {
  if (records.length === 0) return '';

  const columns = Object.keys(records[0]);
  let sql = `TRUNCATE TABLE "${tableName}" CASCADE;\n-- INSERT INTO ${tableName}\n`;

  records.forEach(record => {
    const values = columns.map(col => {
      const val = record[col];
      if (val === null || typeof val === 'undefined') return 'NULL';
      if (val instanceof Date) return `'${val.toISOString()}'`;
      if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
      if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
      if (Array.isArray(val)) return `ARRAY[${val.map(item => `'${item.replace(/'/g, "''")}'`).join(',')}]`; // PostgreSQL array syntax
      if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`; // For JSON objects
      return val;
    });
    const quotedColumns = columns.map(col => `"${col}"`).join(', ');
    sql += `INSERT INTO "${tableName}" (${quotedColumns}) VALUES (${values.join(', ')});\n`;
  });

  sql += '\n';
  return sql;
}

exportData();
