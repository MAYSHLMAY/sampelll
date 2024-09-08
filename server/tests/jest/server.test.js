const request = require('supertest');
const app = require('../../../server'); // Your Express app

describe('Server', () => {
  test('should respond with 404 for undefined routes', async () => {
    const response = await request(app).get('/undefinedroute');
    expect(response.status).toBe(404);
  });
});
