const mongoose = require('mongoose');
const Appointment = require('../../../models/appointmentModel'); // Adjust the path as necessary

beforeAll(async () => {
  // Connect to the real MongoDB instance
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  // Disconnect from the real MongoDB instance
  await mongoose.disconnect();
});

describe('Appointment Model', () => {
  // Test for creating an appointment
  it('should create an appointment successfully', async () => {
    const appointment = new Appointment({
      userId: new mongoose.Types.ObjectId(),
      doctorId: new mongoose.Types.ObjectId(),
      date: '2024-01-01',
      time: '10:00',
    });

    const savedAppointment = await appointment.save();
    expect(savedAppointment._id).toBeDefined();
    expect(savedAppointment.date).toBe('2024-01-01');
    expect(savedAppointment.time).toBe('10:00');
    expect(savedAppointment.status).toBe('Pending');
  });

  // Test validation errors
  it('should throw a validation error if required fields are missing', async () => {
    const appointment = new Appointment({
      userId: new mongoose.Types.ObjectId(),
      doctorId: new mongoose.Types.ObjectId(),
      // date and time are missing
    });

    let err;
    try {
      await appointment.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.date).toBeDefined();
    expect(err.errors.time).toBeDefined();
  });

  // Test the default status
  it('should default to "Pending" status', async () => {
    const appointment = new Appointment({
      userId: new mongoose.Types.ObjectId(),
      doctorId: new mongoose.Types.ObjectId(),
      date: '2024-01-01',
      time: '10:00',
    });

    const savedAppointment = await appointment.save();
    expect(savedAppointment.status).toBe('Pending');
  });

  // Test querying appointments
  it('should find an appointment by userId', async () => {
    const userId = new mongoose.Types.ObjectId();
    const doctorId = new mongoose.Types.ObjectId();
    const appointment = new Appointment({
      userId,
      doctorId,
      date: '2024-01-01',
      time: '10:00',
    });

    await appointment.save();

    const foundAppointment = await Appointment.findOne({ userId });
    expect(foundAppointment).toBeDefined();
    expect(foundAppointment.userId.toString()).toBe(userId.toString());
  });
});
