import prisma from './config/prisma.js';
async function run() {
  await prisma.cmsPage.deleteMany({});
  console.log('Cleared CmsPage');
}
run().catch(console.error).finally(() => prisma.$disconnect());
