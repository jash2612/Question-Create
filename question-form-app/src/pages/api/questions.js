import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { sectionId, subsectionId, questionText, questionType, options } = req.body;

      if (!sectionId || !subsectionId || !questionText || !questionType || !options) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const question = await prisma.question.create({
        data: {
          text: questionText,
          type: questionType,
          sectionId: parseInt(sectionId),
          subsectionId: parseInt(subsectionId),
          options: {
            create: options.map((option) => ({
              text: option.text,
              marks: parseFloat(option.marks),
              image: option.image || null,
            })),
          },
        },
        include: {
          section: true,
          subsection: true,
          options: true,
        },
      });
      res.status(200).json(question);
    } catch (error) {
      console.error('Error saving question:', error);
      res.status(500).json({ message: 'Error saving question', error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const questions = await prisma.question.findMany({
        include: {
          section: true,
          subsection: true,
          options: true,
        },
      });
      res.status(200).json(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'Question ID is required' });
    }
    try {
      const question = await prisma.question.findUnique({
        where: { id: parseInt(id) },
      });
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }
      await prisma.option.deleteMany({ where: { questionId: parseInt(id) } });
      await prisma.question.delete({ where: { id: parseInt(id) } });
      res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ message: 'Error deleting question', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
