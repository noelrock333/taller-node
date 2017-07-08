process.env.NODE_ENV = 'test'
var assert = require('assert');
var should = require('should');
var request = require('supertest');
var async = require('async');
var knex = require('../bookshelf').knex;
var app = require('../app.js');

describe('Array', function() {
  // Código sincrono (no espera callback)
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

  beforeEach((done) => {
    // Elimina todo el conenido de la tabla de asistentes antes de ejecutar cada funcion
    knex('asistentes').truncate().then(() => {
      done();
    });
  });

  after((done) => {
    // Elimina todo el conenido de la tabla de asistentes despues de que todos los tests hayan sido ejecutados
    knex('asistentes').truncate().then(() => {
      done();
    });
  })

  describe('Insersion', () => {
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
          knex('asistentes').where('id', res.body.id).del().then(() => {
            done()
          });
        });
    });

    it('No permitir asistente sin datos');
  });

  describe('Edicion', () => {
    it('Editar usuario', (done) => {
      
      async.waterfall([
        function(callback) {
          knex('asistentes').insert({
            nombre: 'Noel',
            apellido: 'Solorzano',
            ocupacion: 'Desarrollador'
          }).then(data => {
            callback(null, { id: data.pop() });
          });
        },
        function(arg1, callback) {
          // arg1 ahora es igual a "data"
          request(app)
            .post('/crud/editar')
            .set('X-Requested-With', 'XMLHttpRequest') // Simulamos una llamada Ajax
            .send({
              id: arg1.id,
              apellido: 'Escobedo'
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(callback);
        },
      ], function (err, res) {
        // result now equals 'done'
        if (err) return done(err);
        (res.body.apellido).should.be.equal('Escobedo');
        done();
      });

    });
  });
})