
exports.up = function(knex, Promise) {
  return knex.schema.createTable('cursos', (t)=> {
    t.increments('id').primary();
    t.string('nombre');
    t.string('descripcion');
    //t.integer('numero_de_asistentes', 10);
    //t.integer('horas', 2);
  }).createTable('cursos_asistentes', (t) => {
    t.increments('id').primary();
    t.integer('cursos_id').references('cursos.id');
    t.integer('asistentes_id').references('asistentes.id');
  });
};

exports.down = function(knex, Promise) {
  // Se tienen que eliminar en orden, primero la que tiene las relaciones y luego la relacionada
  return knex.schema
    .dropTableIfExists('cursos_asistentes')
    .dropTableIfExists('cursos');
};
