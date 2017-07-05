var knexFile = require('./knexfile.js');
var knex = require('knex')(knexFile.development);

var bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
