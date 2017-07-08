var assert = require('assert');
var should = require('should');
var request = require('supertest');
var app = require('../app.js');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

describe('CRUD', () => {
  /* describe('Insersion', () => {
    it('Debe insertar un asistente', () => {
      var err = undefined;
      should.not.exist(err);
    })
  }) */

  describe('Asistentes', () => {
    it('Agrega un asistente', (done) => {
      request(app)
        .post('/crud/guardar')
        .send({
          nombre: 'Noel Escobedo',
          apellido: 'Apellido',
          ocupacion: 'Desarrollador'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    })
  })
})