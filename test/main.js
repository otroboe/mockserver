import supertest from 'supertest';

import app from '../src/main';

describe('Server started', () => {
  let request;

  before(() => {
    request = supertest(app);
  });

  it('404 on GET /', (done) => {
    request
      .get('/')
      .expect(404, done);
  });
});
