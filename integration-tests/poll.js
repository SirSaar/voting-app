var request = require('supertest');
const app = require('../app');
var server = require('../app')
const expect = require('chai').expect;
const Poll = require('../models/Poll')

var agent = request.agent(server)
const mockUser = { email: 'mock@mock.com', password: '123456' }
describe('Polls', function () {

    beforeEach('Delete all polls', async function () {
        await Poll.deleteMany({}).exec()
    })
    before('Sign in the user', function (done) {
        agent.post('/api/user/signup')
            .send(mockUser)
            .end(function (err, res) {
                agent.post('/api/user/login')
                    .send(mockUser)
                    .end(function (err, res) {
                        done();
                    })
            })
    });

    it('Should create new poll', function (done) {
        agent.post('/api/poll/')
            .send({ name: 'poll1' })
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                expect(err).to.not.exist;
                expect(res).to.exist
                expect(res).to.have.property('body')
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('name', 'poll1')
                done()
            })
    })

})