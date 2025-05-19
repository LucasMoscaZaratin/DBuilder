import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyReply } from 'fastify';
import PDFDocument from 'pdfkit';

const prisma = new PrismaClient();

const reportRoute = async (app: FastifyInstance) => {
  app.get('/projects/:projectId/report', async (request, reply: FastifyReply) => {
    const projectId = Number((request.params as { projectId: string }).projectId);

    if (isNaN(projectId) || projectId <= 0) {
      return reply.status(400).send({ message: 'ID do projeto inválido.' });
    }

    try {
      const tasks = await prisma.task.findMany({
        where: { projectId },
        select: {
          name: true,
          initial_percent: true,
          final_percent: true,
          value: true,
        },
      });

      if (tasks.length === 0) {
        return reply.status(404).send({ message: 'Nenhuma tarefa encontrada para este projeto.' });
      }

      // Configura cabeçalhos da resposta
      reply.header('Content-Type', 'application/pdf');
      reply.header('Content-Disposition', `attachment; filename=relatorio_projeto_${projectId}.pdf`);

      // Cria e envia o PDF
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      doc.pipe(reply.raw);

      doc.fontSize(16).text(`Relatório de Tarefas do Projeto ${projectId}`, { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).text('Nome da Tarefa | % Inicial | % Final | Valor (R$) | A Pagar (R$)', { underline: true });
      doc.moveDown(0.5);

      let total = 0;

      for (const task of tasks) {
        const deltaPercent = Math.max(task.final_percent - task.initial_percent, 0);
        const amountToPay = (deltaPercent / 100) * task.value;
        total += amountToPay;

        doc.text(
          `${task.name} | ${task.initial_percent}% | ${task.final_percent}% | R$ ${task.value.toFixed(
            2
          )} | R$ ${amountToPay.toFixed(2)}`
        );
      }

      doc.moveDown();
      doc.fontSize(14).text(`Total a pagar: R$ ${total.toFixed(2)}`);

      doc.end(); // Finaliza o stream do PDF

      // Não envie outra resposta, pois reply.raw já está sendo usado
    } catch (error: unknown) {
      console.error('Erro ao gerar relatório:', error);
      return reply.status(500).send({
        message: 'Erro ao gerar relatório',
        error: error instanceof Error ? error.message : error,
      });
    }
  });
};

export default reportRoute;
