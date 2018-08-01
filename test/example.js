import supertest from 'supertest';
import { expect } from 'chai';

import app from '../src/main';

describe('Requests on /example prefix', () => {
  let prefix;
  let request;

  before(() => {
    prefix = '/example';
    request = supertest(app);
  });

  it('404 on GET /example', (done) => {
    request
      .get(prefix)
      .expect(404, done);
  });

  it('200 on GET /example?offset=0&limit=10', (done) => {
    request
      .get(`${prefix}?offset=0&limit=10`)
      .expect(200, [{
        id: 1,
        title: 'Example 1',
      }, {
        id: 2,
        title: 'Example 2',
      }], done);
  });

  it('403 on GET /example/forbidden', (done) => {
    request
      .get(`${prefix}/forbidden`)
      .expect(403, done);
  });

  it('201 on POST /example', (done) => {
    request
      .post(prefix)
      .set('Accept', 'application/json')
      .send({
        title: 'Create example',
      })
      .expect(201, {
        id: 3,
        title: 'Create example',
      }, done);
  });

  it('400 on POST /example', (done) => {
    request
      .post(prefix)
      .set('Accept', 'application/json')
      .expect(400, done);
  });

  it('200 on PUT /example/3', (done) => {
    request
      .put(`${prefix}/3`)
      .set('Accept', 'application/json')
      .send({
        title: 'Updated example',
      })
      .expect(200, {
        id: 3,
        title: 'Updated example',
      }, done);
  });

  it('404 on PUT /example/42', (done) => {
    request
      .put(`${prefix}/3`)
      .set('Accept', 'application/json')
      .send({
        title: 'Unknown example',
      })
      .expect(404, done);
  });

  it('204 on DELETE /example/3', (done) => {
    request
      .delete(`${prefix}/3`)
      .expect(204, done);
  });

  it('403 on DELETE /example/1', (done) => {
    request
      .delete(`${prefix}/1`)
      .expect(403, done);
  });

  it('200 on GET /example/text', (done) => {
    request
      .get(`${prefix}/text`)
      .expect(200)
      .then((response) => {
        expect(Object.keys(response.body).length).to.equal(0);
        expect(response.text).to.equal('My full response in Text');

        console.log(response.text);

        done();
      });
  });
});
