import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const sections = await prisma.section.findMany();
      res.status(200).json(sections);
    } catch (error) {
      console.error('Error fetching sections:', error);
      res.status(500).json({ message: 'Error fetching sections', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
