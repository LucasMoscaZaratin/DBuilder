import fastify from 'fastify';
import cors from '@fastify/cors';

import loginRoute from './routes/login-route';
import profileRoute from './routes/profile-route';
import financeRoute from './routes/finance-route';
import projectSupplierRoute from './routes/projectSupplier-route';
import projectRoute from './routes/project-route';
import supplierRoute from './routes/supplier-route';
import teamRoute from './routes/team-route';
import taskRoute from './routes/task-route';
import dotenv from 'dotenv';
import reportRoute from './routes/report-route';
dotenv.config();

const app = fastify();

app.register(loginRoute);
app.register(profileRoute);
app.register(financeRoute);
app.register(projectSupplierRoute);
app.register(supplierRoute);
app.register(projectRoute);
app.register(teamRoute);
app.register(taskRoute);
app.register(reportRoute);

app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

app.listen({ port: 3000 }).then(() => {
  console.log('HTTP server runnign on port: 3000');
});
