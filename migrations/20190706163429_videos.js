
exports.up = function(knex, Promise) {
  return knex.schema.createTable('videos', (t)=> {
    t.increments('id').primary();
    t.string('title');
    t.string('image');
    t.string('url');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('videos')
};
