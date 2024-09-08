const request = require('supertest');
const express = require('express');
const http = require('http');
const appointmentRouter = require('../../../routes/appointRoutes');
const auth = require('../../../middleware/auth');

const app = express();
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmRkZDVlOWZkYmM2N2FlZGNiNjNlMzMiLCJyb2xlIjoiUGF0aWVudCIsImlhdCI6MTcyNTgxNDMwNiwiZXhwIjoxNzI1OTg3MTA2fQ.1-EqN8eua3Hx-R3xyIrSjinbkuD-1jWW3eiCX2O9gHY';

// Set up middleware and routes
app.use(express.json());
app.use('/appointment', auth, appointmentRouter);

// Create the server
const server = http.createServer(app);

beforeAll((done) => {
  server.listen(0, done); // Start server on a random port
});

afterAll((done) => {
  server.close(done); // Close server after tests
});

describe('GET /appointment/getallappointments', () => {
  test('should return all appointments in the expected format', async () => {
    const response = await request(server)
      .get('/appointment/getallappointments')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);

    // Define expected structure for validation
    const expectedStructure = [
      {
        _id: expect.any(String),
        userId: {
          _id: expect.any(String),
          firstname: expect.any(String),
          lastname: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
          role: expect.any(String),
          age: expect.anything(), // Can be null or any value
          gender: expect.any(String),
          mobile: expect.any(String),
          address: expect.any(String),
          status: expect.any(String),
          pic: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: expect.any(Number)
        },
        doctorId: {
          _id: expect.any(String),
          firstname: expect.any(String),
          lastname: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
          role: expect.any(String),
          age: expect.anything(), // Can be null or any value
          gender: expect.any(String),
          mobile: expect.any(String),
          address: expect.any(String),
          status: expect.any(String),
          pic: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: expect.any(Number)
        },
        date: expect.any(String),
        time: expect.any(String),
        status: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: expect.any(Number)
      }
    ];

    // Validate response body structure
    expect(response.body).toEqual(expect.arrayContaining(expectedStructure));
  }, 5000); // Increase timeout if needed
});
