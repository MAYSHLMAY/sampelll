const request = require('supertest');
const express = require('express');
const app = express();
const { getallappointments, bookappointment, completed, countAllAppointments, countCompletedAppointments } = require('../../../controllers/appointmentController');
const Appointment = require('../../../models/appointmentModel');
const Notification = require('../../../models/notificationModel');
const User = require('../../../models/userModel');

// Mock the models
jest.mock('../../../models/appointmentModel');
jest.mock('../../../models/notificationModel');
jest.mock('../../../models/userModel');

// Middleware for parsing JSON
app.use(express.json());

// Define routes
app.get('/appointment/getallappointments', getallappointments);
app.post('/appointment/book', bookappointment);
app.post('/appointment/completed', completed);
app.get('/appointment/countAllAppointments', countAllAppointments);
app.get('/appointment/countCompletedAppointments', countCompletedAppointments);

// Tests
describe('Appointment Controller', () => {

  describe('GET /appointment/getallappointments', () => {
    it('should return all appointments in the expected format', async () => {
      // Mock Appointment.find()
      Appointment.find.mockResolvedValue([{ _id: '1', date: '2024-01-01', time: '10:00' }]);

      const response = await request(app).get('/appointment/getallappointments');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ _id: '1', date: '2024-01-01', time: '10:00' }]);
    });

    it('should handle errors', async () => {
      Appointment.find.mockRejectedValue(new Error('Test Error'));

      const response = await request(app).get('/appointment/getallappointments');
      expect(response.status).toBe(500);
      expect(response.text).toBe('Unable to get appointments');
    });
  });

  describe('POST /appointment/book', () => {
    it('should book a new appointment and send notifications', async () => {
      // Mock dependencies
      const mockUser = { firstname: 'John', lastname: 'Doe' };
      Appointment.prototype.save.mockResolvedValue({ _id: '1' });
      User.findById.mockResolvedValue(mockUser);
      Notification.prototype.save.mockResolvedValue();

      const response = await request(app)
        .post('/appointment/book')
        .send({
          date: '2024-01-01',
          time: '10:00',
          doctorId: 'doctorId',
          doctorname: 'Dr. Smith',
        })
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmRkZDVlOWZkYmM2N2FlZGNiNjNlMzMiLCJyb2xlIjoiUGF0aWVudCIsImlhdCI6MTcyNTgxNDMwNiwiZXhwIjoxNzI1OTg3MTA2fQ.1-EqN8eua3Hx-R3xyIrSjinbkuD-1jWW3eiCX2O9gHY');
        
      expect(response.status).toBe(201);
      expect(response.body._id).toBe('1');
    });

    it('should handle errors', async () => {
      Appointment.prototype.save.mockRejectedValue(new Error('Test Error'));

      const response = await request(app)
        .post('/appointment/book')
        .send({ date: '2024-01-01', time: '10:00', doctorId: 'doctorId', doctorname: 'Dr. Smith' });
        
      expect(response.status).toBe(500);
      expect(response.text).toBe('Unable to book appointment');
    });
  });

  describe('POST /appointment/completed', () => {
    it('should mark appointment as completed and send notifications', async () => {
      Appointment.findByIdAndUpdate.mockResolvedValue();
      User.findById.mockResolvedValue({ firstname: 'John', lastname: 'Doe' });
      Notification.prototype.save.mockResolvedValue();

      const response = await request(app)
        .post('/appointment/completed')
        .send({
          appointid: '1',
          doctorname: 'Dr. Smith',
          doctorId: 'doctorId',
        })
        .set('Authorization', 'Bearer token');
        
      expect(response.status).toBe(201);
      expect(response.text).toBe('Appointment completed');
    });

    it('should handle errors', async () => {
      Appointment.findByIdAndUpdate.mockRejectedValue(new Error('Test Error'));

      const response = await request(app)
        .post('/appointment/completed')
        .send({ appointid: '1', doctorname: 'Dr. Smith', doctorId: 'doctorId' });
        
      expect(response.status).toBe(500);
      expect(response.text).toBe('Unable to complete appointment');
    });
  });

  describe('GET /appointment/countAllAppointments', () => {
    it('should return the total count of appointments', async () => {
      Appointment.countDocuments.mockResolvedValue(10);

      const response = await request(app).get('/appointment/countAllAppointments');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ totalAppointments: 10 });
    });

    it('should handle errors', async () => {
      Appointment.countDocuments.mockRejectedValue(new Error('Test Error'));

      const response = await request(app).get('/appointment/countAllAppointments');
      expect(response.status).toBe(500);
      expect(response.text).toBe('Unable to count appointments');
    });
  });

  describe('GET /appointment/countCompletedAppointments', () => {
    it('should return the count of completed appointments', async () => {
      Appointment.countDocuments.mockResolvedValue(5);

      const response = await request(app).get('/appointment/countCompletedAppointments');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ completedAppointments: 5 });
    });

    it('should handle errors', async () => {
      Appointment.countDocuments.mockRejectedValue(new Error('Test Error'));

      const response = await request(app).get('/appointment/countCompletedAppointments');
      expect(response.status).toBe(500);
      expect(response.text).toBe('Unable to count completed appointments');
    });
  });

});
