
exports.up = function(knex, Promise) {
  return knex.schema.createTable('asistentes', (t)=> {
    t.increments('id').primary();
    t.string('nombre', 40);
    t.string('apellido');
    t.string('ocupacion');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('asistentes');
};
