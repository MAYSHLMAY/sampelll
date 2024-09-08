const auth = require('../../../middleware/auth');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  test('should return 401 if no token is provided', () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
  });

  test('should return 403 if token is invalid', () => {
    const req = { headers: { authorization: 'Bearer invalidtoken' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    jwt.verify = jest.fn().mockImplementation((token, secret, callback) => callback(new Error('Invalid token')));

    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
  });

  test('should call next if token is valid', () => {
    const req = { headers: { authorization: 'Bearer validtoken' } };
    const res = {};
    const next = jest.fn();
    
    jwt.verify = jest.fn().mockImplementation((token, secret, callback) => callback(null, { userId: 'user1' }));

    auth(req, res, next);
    expect(req.user).toEqual({ userId: 'user1' });
    expect(next).toHaveBeenCalled();
  });
});
