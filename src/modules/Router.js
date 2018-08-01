import express from 'express';

import Route from './Route';

class Router {
  /**
   * @param {Object} groupedUrlList
   */
  constructor(groupedUrlList) {
    this.expressRouter = express.Router();
    this.groupedUrlList = groupedUrlList;
  }

  build() {
    Object.values(this.groupedUrlList).forEach(urlConfig => this.createRoute(urlConfig));
  }

  /**
   * @param {Array} urlConfig
   */
  createRoute(urlConfig) {
    const { pattern, method } = urlConfig[0].request;
    const route = new Route(this.expressRouter, pattern, method, urlConfig);

    route.init();
  }
}

export default Router;

