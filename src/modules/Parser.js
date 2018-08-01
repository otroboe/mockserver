import _ from 'lodash';
import glob from 'glob';
import jsonfile from 'jsonfile';

class Parser {
  /**
   * @param {String} configDirectory
   */
  constructor(configDirectory) {
    this.configDirectory = configDirectory;
  }

  /**
   * @returns {Promise}
   */
  run() {
    return this.extractFileList()
      .then(files => this.parseFileList(files))
      .then(configList => Promise.resolve(configList.filter(config => this.isValidConfig(config))));
  }

  /**
   * @param {Object} config
   * @returns {Boolean}
   */
  isValidConfig(config) {
    return !_.isEmpty(config) && _.has(config, 'prefix') && _.has(config, 'urls') && Array.isArray(config.urls);
  }

  /**
   * @returns {Promise}
   */
  extractFileList() {
    return new Promise((resolve, reject) => {
      glob(`${this.configDirectory}/*.json`, (err, files) => {
        if (err) {
          reject(err);
        }

        resolve(files);
      });
    });
  }

  /**
   * @param {Array} fileList
   * @returns {Promise}
   */
  parseFileList(fileList) {
    return Promise.all(fileList.map(filePath => this.parseFile(filePath)));
  }

  /**
   * @param {String} filePath
   * @returns {Promise}
   */
  parseFile(filePath) {
    return new Promise((resolve, reject) => {
      jsonfile.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    });
  }
}

export default Parser;
