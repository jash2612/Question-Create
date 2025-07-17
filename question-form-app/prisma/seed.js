const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

async function main() {
  try {
    // Clear existing data
    await prisma.option.deleteMany();
    await prisma.question.deleteMany();
    await prisma.subsection.deleteMany();
    await prisma.section.deleteMany();

    // Seed Sections
    const sections = await prisma.section.createMany({
      data: [
        { name: 'Physics' },
        { name: 'Chemistry' },
        { name: 'Biology' },
        { name: 'Mathematics' },
        { name: 'Computer Science' },
      ],
      skipDuplicates: true,
    });

    // Get created section IDs
    const physics = await prisma.section.findFirst({ where: { name: 'Physics' } });
    const chemistry = await prisma.section.findFirst({ where: { name: 'Chemistry' } });
    const biology = await prisma.section.findFirst({ where: { name: 'Biology' } });
    const mathematics = await prisma.section.findFirst({ where: { name: 'Mathematics' } });
    const compSci = await prisma.section.findFirst({ where: { name: 'Computer Science' } });

    // Seed Subsections
    await prisma.subsection.createMany({
      data: [
        { name: 'Mechanics', sectionId: physics.id },
        { name: 'Electromagnetism', sectionId: physics.id },
        { name: 'Thermodynamics', sectionId: physics.id },
        { name: 'Organic Chemistry', sectionId: chemistry.id },
        { name: 'Inorganic Chemistry', sectionId: chemistry.id },
        { name: 'Physical Chemistry', sectionId: chemistry.id },
        { name: 'Botany', sectionId: biology.id },
        { name: 'Zoany', sectionId: biology.id },
        { name: 'Genetics', sectionId: biology.id },
        { name: 'Algebra', sectionId: mathematics.id },
        { name: 'Calculus', sectionId: mathematics.id },
        { name: 'Geometry', sectionId: mathematics.id },
        { name: 'Programming', sectionId: compSci.id },
        { name: 'Data Structures', sectionId: compSci.id },
        { name: 'Algorithms', sectionId: compSci.id },
      ],
      skipDuplicates: true,
    });

    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  });
