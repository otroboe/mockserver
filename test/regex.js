import supertest from 'supertest';
import { expect } from 'chai';

import app from '../src/main';

describe('Requests on /regex prefix', () => {
  const expectUrl1Response = (response) => {
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.all.keys('id', 'name');
    expect(response.body.id).to.be.a('string');
    expect(response.body.name).to.be.a('string');
  };
  const expectUrl2Response = (response) => {
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.all.keys('id', 'description');
    expect(response.body.id).to.be.a('number');
    expect(response.body.description).to.be.a('string');
  };

  let prefix;
  let request;

  before(() => {
    prefix = '/regex';
    request = supertest(app);
  });

  it('404 on GET /regex', (done) => {
    request
      .get(prefix)
      .expect(404, done);
  });

  it('200 on GET /regex/42', (done) => {
    request
      .get(`${prefix}/42`)
      .expect(200)
      .then((response) => {
        expectUrl1Response(response);
        done();
      });
  });

  it('200 on GET /regex/89784312', (done) => {
    request
      .get(`${prefix}/89784312`)
      .expect(200)
      .then((response) => {
        expectUrl1Response(response);
        done();
      });
  });

  it('404 on GET /regex/test', (done) => {
    request
      .get(`${prefix}/test`)
      .expect(404, done);
  });

  it('200 on GET /regex/article', (done) => {
    request
      .get(`${prefix}/article`)
      .expect(200)
      .then((response) => {
        expectUrl2Response(response);
        done();
      });
  });

  it('200 on GET /regex/article-by-him', (done) => {
    request
      .get(`${prefix}/article-by-him`)
      .expect(200)
      .then((response) => {
        expectUrl2Response(response);
        done();
      });
  });

  it('200 on GET /regex/articles/42', (done) => {
    request
      .get(`${prefix}/articles/42`)
      .expect(200)
      .then((response) => {
        expectUrl2Response(response);
        done();
      });
  });

  it('200 on GET /regex/article/comment-89', (done) => {
    request
      .get(`${prefix}/article/comment-89`)
      .expect(200)
      .then((response) => {
        expectUrl2Response(response);
        done();
      });
  });
});
