import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.user.findFirst({ where: { role: UserRole.ADMIN } });
  
  if (!adminExists) {
    const passwordHash = await bcrypt.hash('Admin123!', 12);
    
    await prisma.user.create({
      data: {
        email: 'admin@agenda.local',
        passwordHash,
        firstName: 'Super',
        lastName: 'Admin',
        role: UserRole.ADMIN,
        isActive: true,
      },
    });
    
    console.log('✅ Admin créé : admin@agenda.local / Admin123!');
  }

  const directorExists = await prisma.user.findFirst({ where: { role: UserRole.DIRECTOR } });
  
  if (!directorExists) {
    const passwordHash = await bcrypt.hash('Directeur123!', 12);
    
    await prisma.user.create({
      data: {
        email: 'directeur@agenda.local',
        passwordHash,
        firstName: 'Jean',
        lastName: 'Directeur',
        role: UserRole.DIRECTOR,
        isActive: true,
      },
    });
    
    console.log('✅ Directeur créé : directeur@agenda.local / Directeur123!');
  }

  const assistantExists = await prisma.user.findFirst({ where: { role: UserRole.ASSISTANT } });
  
  if (!assistantExists) {
    const passwordHash = await bcrypt.hash('Assistant123!', 12);
    
    await prisma.user.create({
      data: {
        email: 'assistant@agenda.local',
        passwordHash,
        firstName: 'Marie',
        lastName: 'Assistante',
        role: UserRole.ASSISTANT,
        isActive: true,
      },
    });
    
    console.log('✅ Assistant créé : assistant@agenda.local / Assistant123!');
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });