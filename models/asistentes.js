let bookshelf = require('../bookshelf');
var Habilidades = require('./habilidades');

module.exports = bookshelf.Model.extend({
  tableName: 'asistentes',
  habilidades: function() {
    return this.hasMany(Habilidades);
  }
});