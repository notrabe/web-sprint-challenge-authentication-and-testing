// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

const user = {username: 'username', password: 'password'}

test('sanity', () => {
  expect(true).toBe(false)
})

describe('server.js', () => {
  describe('get jokes', () => {
    it('should be unauthorized, return 401', async () => {
      const res = await request(server).get('/api/jokes')
      expect(res.status).toBe(401)
    })
  })
  describe('register', () => {
    it('status code 201', async () => {
      await db('users').truncate()
      const res = await request(server)
        .post('api/auth/register')
        .send(user)
      expect(res.status).toBe(201)
    })
    it('returns 500 when information is invalid', async () => {
      const res = await request(server)
        .post('api/auth/register')
        .send({user: 'user', pass: 'pass'})
      expect(res.status).toBe(500)
    })
  })
  describe('login', () => {
    it('works with valid user', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send(user)
      expect(res.status).toBe(201)
    })
    it('returns 500 with invalid user', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({username: 'not-a-username', password: 'not-a-password'})
      expect(res.status).toBe(500)
    })
  })
})