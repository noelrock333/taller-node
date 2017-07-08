var express = require('express');
var router = express.Router();
var bookshelf = require('../bookshelf');
var knex = bookshelf.knex;
var multer = require('multer');
var subidas = multer({ dest: 'subidas/' });
var fs = require('fs');
var path = require('path');
var papaparse = require('papaparse');
var async = require('async');
const Asistente = require('../models/asistentes');

/* GET home page. */
router.get('/nuevo', function(req, res, next) {
  res.render('CRUD_views/nuevo', {
    titulo: 'Taller de node.js',
    saludo: 'Hola desde node yey!'
  });
});

router.post('/guardar', function(req, res, next) {
  // Creamos una instancia del modelo Asistente, guardamos y obtenemos el registro insertado
  new Asistente().save(req.body).then(model => {
    res.json(model.toJSON());
  });
});

router.get('/lista', function(req, res, next) {
  // Creamos una instancia del modelo Asistente y obtenemos todos los registros
  new Asistente().fetchAll({ withRelated: ['habilidades']} ).then(model => {
    console.log(model.toJSON()[200]);
    res.render('CRUD_views/lista', {
      asistentes: model.toJSON(),
      titulo: 'Listado de Asistentes'
    });
  });
});

router.delete('/eliminar/:id', function(req, res, next) {
  // Buscamos el registro con id igual al parametro recivido y lo eliminamos
  new Asistente({ id: req.params.id }).destroy().then(model => { // para probar el catch podemos buscar undefined
    let id = model.get('id'); // De esta manera obtenemos un valor de la respuesta sin tener que convertir todo el objeto en JSON
    res.json({ deleted: true });
  }).catch(() => {
    res.json({ deleted: false });
  });
});

router.get('/editar/:id', function(req, res, next) {
  // Obtenemos un asistente por medio del id y lo enviamos a la vista
  new Asistente({ id: req.params.id }).fetch().then(model => {
    res.render('CRUD_views/editar', {
      titulo: 'Editar',
      asistente: model.toJSON()
    });
  });
});

router.post('/editar', function(req, res, next) {
  // Automaticamente busca por el id que trae req.body y hace la actualizacion de los demás campos dependiendo del contenido del objeto
  new Asistente(req.body).save().then(model => {
    if (req.xhr) { // si la llamada es realizada usando ajax
      res.json(model.toJSON());
    } else {
      res.redirect('/crud/lista');
    }
  });
});


router.get('/cargar', function(req, res, next) {
  res.render('CRUD_views/cargar');
});

router.post('/cargar', subidas.single('archivo'), function(req, res, next) {
  if(req.file) {
    console.log(req.file);
    var fileObj = req.file;
    var source = fs.createReadStream(`./${fileObj.destination}${fileObj.filename}`);
    var dest = fs.createWriteStream(`./archivos_publicos/${fileObj.originalname}`);

    source.pipe(dest);
    source.on('end', () => {
      // Archivo copiado
      if (path.extname(fileObj.originalname).toLowerCase() == '.csv') { // Verificamos que la extension sea CSV
        fs.readFile(`./archivos_publicos/${fileObj.originalname}`, 'utf8', (err, data) => {
          if (!err) {
            papaparse.parse(data, {
              header: true,
              comments: true,
              complete: function(results) {
                async.eachSeries(results.data, function iteratee(item, callback) {
                  knex('asistentes').insert({ nombre: item['Nombre'], ocupacion: item['Grado'] }).then(() => {
                    callback(null);
                  });
                }, function done() {
                    console.log('Ha finalizado la insersión');
                });
              }
            });
          }
        });
      }
      res.render('CRUD_views/cargar', { cargado: true });
    });
    source.on('error', (err) => {
      // Error al copiar
      console.log(err);
      res.send('Ha ocurrido un error');
    });
    source.on('close', () => {
      // Se ejecuta al finalizar el stream haya ocurrido o no un error
      fs.unlink(`./${fileObj.destination}${fileObj.filename}`, () => {
        // Elimina el archivo original
        console.log("File deleted");
      });
    });
  }
  else {
    return res.send('Ha ocurrido un error');
  }
});

module.exports = router;
