import 'dotenv/config';
import path from 'path';

import Parser from './modules/Parser';
import RouterBuilder from './modules/RouterBuilder';
import Server from './modules/Server';

const { HOST, PORT } = process.env;
const configDirectory = path.resolve(__dirname, '../config');

const parser = new Parser(configDirectory);
const routerBuilder = new RouterBuilder();
const server = new Server(HOST, PORT);

parser.run()
  .then(configList => routerBuilder.run(configList))
  .then(routerList => server.start(routerList));

// Log error from babel
process.on('unhandledRejection', (err) => {
  console.log(err.stack);
  process.exit(1);
});

// Export to easily test the server
export default server.app;
