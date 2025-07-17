import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { sectionId } = req.query;
    try {
      const subsections = await prisma.subsection.findMany({
        where: { sectionId: parseInt(sectionId) },
      });
      res.status(200).json(subsections);
    } catch (error) {
      console.error('Error fetching subsections:', error);
      res.status(500).json({ message: 'Error fetching subsections', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
