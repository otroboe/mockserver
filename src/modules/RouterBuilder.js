import _ from 'lodash';

import Router from './Router';

class RouterBuilder {
  constructor() {
    this.authorizedMethods = ['get', 'post', 'put', 'delete'];
  }

  /**
   * @param {Array} configList
   * @returns {Promise}
   */
  run(configList) {
    return Promise.resolve(configList.map(config => this.build(config)));
  }

  /**
   * @param {Object} config
   * @returns {Object}
   */
  build(config) {
    const { prefix, urls } = config;
    const groupedUrlList = this.cleanConfig(urls);
    const router = new Router(groupedUrlList);

    router.build();

    return {
      prefix,
      router: router.expressRouter,
    };
  }

  /**
   * @param {Array} urlList
   * @returns {Object}
   */
  cleanConfig(urlList) {
    const filtered = urlList.filter(url => url.request && url.request.method
      && this.authorizedMethods.indexOf(url.request.method.toLowerCase()) !== -1);

    return _.groupBy(filtered, item => `${item.request.method} ${item.request.pattern}`);
  }
}

export default RouterBuilder;
