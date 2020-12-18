// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

const user = {username: 'username', password: 'password'}

test('sanity', () => {
  expect(true).toBe(true)
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
    
  })
})