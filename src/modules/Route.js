import _ from 'lodash';

import ResponseGenerator from './ResponseGenerator';

class Route {
  /**
   * @param {Object} router Express router
   * @param {String} pattern
   * @param {String} method
   * @param {Array} endPointList
   */
  constructor(router, pattern, method, endPointList) {
    this.router = router;
    this.pattern = pattern;
    this.method = method.toLowerCase();
    this.endPointList = endPointList;

    this.responseGenerator = new ResponseGenerator();
  }

  init() {
    this.router[this.method](this.pattern, async (req, res) => {
      const endPoint = this.findEndPoint(req);

      if (endPoint) {
        await this.fakeAsync(endPoint.async);

        if (_.isPlainObject(endPoint.response.headers)) {
          res.set(endPoint.response.headers);
        }

        res.status(endPoint.response.status);
        res.send(this.responseGenerator.run(endPoint.response));
      } else {
        res.status(404);
      }

      res.end();
    });
  }

  /**
   * @param {Object} request express Request
   * @returns {Object|undefined}
   */
  findEndPoint(request) {
    const requestQueryParams = request.query;
    const requestBodyParams = request.body;
    const requestHasQueryParams = _.isObject(requestQueryParams) && !_.isEmpty(requestQueryParams);
    const requestHasBodyParams = _.isObject(requestBodyParams) && !_.isEmpty(requestBodyParams);

    let endPointQueryParams;
    let endPointBodyParams;
    let endPointHasQueryParams;
    let endPointHasBodyParams;
    let isEqualQueryParams;
    let isEqualBodyParams;

    return _.find(this.endPointList, (endPoint) => {
      endPointQueryParams = endPoint.request.queryParams;
      endPointBodyParams = endPoint.request.bodyParams;
      endPointHasQueryParams = _.isObject(endPointQueryParams) && !_.isEmpty(endPointQueryParams);
      endPointHasBodyParams = _.isObject(endPointBodyParams) && !_.isEmpty(endPointBodyParams);

      isEqualQueryParams = requestHasQueryParams === endPointHasQueryParams;
      isEqualBodyParams = requestHasBodyParams === endPointHasBodyParams;

      if (isEqualQueryParams && requestHasQueryParams) {
        isEqualQueryParams = _.isEqual(requestQueryParams, endPointQueryParams);
      }

      if (isEqualBodyParams && requestHasBodyParams) {
        isEqualBodyParams = _.isEqual(requestBodyParams, endPointBodyParams);
      }

      return isEqualQueryParams && isEqualBodyParams;
    });
  }

  /**
   * @param {String|Number|undefined} timeout
   */
  fakeAsync(timeout) {
    return new Promise(resolve => setTimeout(resolve, parseInt(timeout, 10)));
  }
}

export default Route;
