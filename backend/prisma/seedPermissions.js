import prisma from '../config/prisma.js';

async function main() {
  console.log('Starting seed for Modules and Permissions...');

  // 1. Define Modules
  const modulesData = [
    { name: 'User Management', slug: 'user_management' },
    { name: 'Travel', slug: 'travel' },
    { name: 'Dashboard', slug: 'dashboard' },
    { name: 'Newsletter', slug: 'newsletter' },
    { name: 'Access Control', slug: 'access_control' }
  ];

  // 2. Define Permissions grouped by Module slug
  const permissionsData = {
    user_management: ['view_users', 'create_user', 'edit_user', 'delete_user'],
    travel: ['view_packages', 'create_package', 'edit_package', 'delete_package'],
    dashboard: ['view_dashboard'],
    newsletter: ['view_newsletter', 'send_newsletter'],
    access_control: ['view_roles', 'manage_roles', 'view_permissions', 'manage_permissions']
  };

  // 3. Upsert Modules
  for (const mod of modulesData) {
    const createdModule = await prisma.accessModule.upsert({
      where: { slug: mod.slug },
      update: { name: mod.name },
      create: { name: mod.name, slug: mod.slug }
    });

    // 4. Upsert Permissions for this Module
    const perms = permissionsData[mod.slug];
    if (perms) {
      for (const permName of perms) {
        await prisma.accessPermission.upsert({
          where: { name: permName },
          update: { moduleId: createdModule.id },
          create: { name: permName, moduleId: createdModule.id }
        });
      }
    }
  }

  console.log('Modules and Permissions seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
