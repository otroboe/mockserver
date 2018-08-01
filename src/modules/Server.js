import express from 'express';
import bodyParser from 'body-parser';

class Server {
  /**
   * @param {String} host
   * @param {Number} port
   */
  constructor(host, port) {
    this.host = host;
    this.port = port;

    this.app = express();

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  /**
   * @param {Array} routerList
   */
  start(routerList) {
    routerList.forEach((config) => {
      this.app.use(config.prefix, config.router);
    });

    this.app.listen(this.port, this.host, () => this.onStartSuccess());
  }

  onStartSuccess() {
    console.log(`App listening on http://${this.host}:${this.port}!`);
  }
}

export default Server;
