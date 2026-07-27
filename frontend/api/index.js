import jsonServer from 'json-server';
import path from 'path';

const server = jsonServer.create();
const dbPath = path.join(process.cwd(), 'db.json');
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults({ bodyParser: true });

server.use(middlewares);
server.use(router);

export default (req, res) => {
  // Strip /api prefix if present
  if (req.url.startsWith('/api')) {
    req.url = req.url.replace('/api', '') || '/';
  }
  return server(req, res);
};
