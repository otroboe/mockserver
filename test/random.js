import supertest from 'supertest';
import { expect } from 'chai';

import app from '../src/main';

describe('Requests on /random prefix', () => {
  let prefix;
  let request;

  before(() => {
    prefix = '/random';
    request = supertest(app);
  });

  it('404 on GET /random/test', (done) => {
    request
      .get(`${prefix}/test`)
      .expect(404, done);
  });

  it('200 on GET /random', (done) => {
    request
      .get(prefix)
      .expect(200)
      .then((response) => {
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.equal(10);

        response.body.forEach((item) => {
          expect(item).to.have.all.keys('id', 'name', 'phone', 'test');
          expect(item.id).to.be.a('string');
          expect(item.name).to.be.a('string');
          expect(item.phone).to.be.a('string');
          expect(item.test).to.equal(true);
        });

        done();
      });
  });

  it('201 on POST /random', (done) => {
    request
      .post(prefix)
      .set('Accept', 'application/json')
      .send({
        name: 'John Smith',
      })
      .expect(201)
      .then((response) => {
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.all.keys('id', 'name');
        expect(response.body.id).to.be.a('string');
        expect(response.body.name).to.equal('John Smith');

        done();
      });
  });
});
