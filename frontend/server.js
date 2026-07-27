import jsonServer from 'json-server';
import express from 'express';

const server = jsonServer.create();
const router = jsonServer.router('db.json');

// json-server o'zining standart body-parser'ini o'chiramiz
const middlewares = jsonServer.defaults({ bodyParser: false });

// O'rniga o'zimizning 50MB limitli parser'imizni qo'yamiz
server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ limit: '50mb', extended: true }));

server.use(middlewares);
server.use(router);

server.listen(3001, () => {
  console.log('JSON Server is running on port 3001 with 50MB limit');
});
