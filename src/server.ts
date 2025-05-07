import fastify from 'fastify';
import cors from '@fastify/cors';

import loginRoute from './routes/login-route';
import profileRoute from './routes/profile-route';
import financeRoute from './routes/finance-route';
import projectSupplierRoute from './routes/projectSupplier-route';
import projectRoute from './routes/project-route';

const app = fastify();

app.register(loginRoute);
app.register(profileRoute);
app.register(financeRoute);
app.register(projectSupplierRoute);
app.register(projectRoute);

app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server runnign on port: 3333');
});
