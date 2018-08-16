import _ from 'lodash';
import faker from 'faker';

class ResponseGenerator {
  constructor() {
    this.authorizedTypes = ['Array', 'Object'];
    this.defaultAmount = 1;
  }

  /**
   * @param {Object} responseConfig
   * @returns {Object|Array}
   */
  run(responseConfig) {
    if (!this.isRandom(responseConfig)) {
      return responseConfig.body;
    }

    return this.generateResponse(responseConfig.random);
  }

  /**
   * @param {Object} responseConfig
   * @returns {Boolean}
   */
  isRandom(responseConfig) {
    return _.isPlainObject(responseConfig.random)
      && this.authorizedTypes.indexOf(responseConfig.random.type) !== -1;
  }

  /**
   * @param {Object} randomConfig
   * @returns {Object|Array}
   */
  generateResponse(randomConfig) {
    if (randomConfig.type === this.authorizedTypes[0]) {
      const amount = randomConfig.amount ? parseInt(randomConfig.amount, 10) : this.defaultAmount;

      return _.times(amount, () => this.generateEntity(randomConfig.entity));
    }

    return this.generateEntity(randomConfig.entity);
  }

  /**
   * @param {Object} entityConfig
   * @returns {Object}
   */
  generateEntity(entityConfig) {
    const entity = {};
    let methodName;
    let methodParams;

    entityConfig.forEach((propConfig) => {
      methodName = _.get(faker, propConfig.method);
      methodParams = Array.isArray(propConfig.params) ? propConfig.params : [];

      if (_.isFunction(methodName)) {
        _.set(entity, propConfig.name, methodName(...methodParams));
      } else if (propConfig.value !== undefined) {
        entity[propConfig.name] = propConfig.value;
      }
    });

    return entity;
  }
}

export default ResponseGenerator;
