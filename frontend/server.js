import jsonServer from 'json-server';
import express from 'express';
import cors from 'cors';

const server = jsonServer.create();
const router = jsonServer.router('db.json');

const middlewares = jsonServer.defaults({ bodyParser: false });

server.use(cors({ origin: '*' }));
server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ limit: '50mb', extended: true }));

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT} with 50MB limit`);
});
