import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyDatabase() {
  console.log('🔍 ResearchMind Database Health Check & Verification Script');
  console.log('============================================================');

  try {
    // 1. Connection Health Check
    console.log('⏳ Connecting to Supabase PostgreSQL...');
    await prisma.$connect();
    console.log('✅ Connected to database successfully!');

    // 2. Query pgvector Extension Status
    console.log('⏳ Checking PostgreSQL pgvector extension status...');
    const result: any[] = await prisma.$queryRaw`
      SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';
    `;

    if (result && result.length > 0) {
      console.log(`✅ pgvector extension active! Version: ${result[0].extversion}`);
    } else {
      console.log('⚠️ pgvector extension not found in pg_extension table. Attempting to create...');
      await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);
      console.log('✅ Executed CREATE EXTENSION IF NOT EXISTS vector;');
    }

    // 3. Model Table Count Verification
    const usersCount = await prisma.user.count();
    const workspacesCount = await prisma.workspace.count();
    const papersCount = await prisma.paper.count();

    console.log('\n📊 Database Table Summary:');
    console.log(`  - Users: ${usersCount}`);
    console.log(`  - Workspaces: ${workspacesCount}`);
    console.log(`  - Papers: ${papersCount}`);

    console.log('\n🚀 Database Verification Passed Cleanly!');
  } catch (error: any) {
    console.error('❌ Database Health Check Failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();
