var express = require('express');
var router = express.Router();
var bookshelf = require('../bookshelf');
var knex = bookshelf.knex;
var multer = require('multer');
var subidas = multer({ dest: 'subidas/' });
var fs = require('fs');
var path = require('path');
var papaparse = require('papaparse');

/* GET home page. */
router.get('/nuevo', function(req, res, next) {
  res.render('CRUD_views/nuevo', {
    titulo: 'Taller de node.js',
    saludo: 'Hola desde node yey!'
  });
});

router.post('/guardar', function(req, res, next) {
  knex('asistentes').insert(req.body).then((data) => {
    knex('asistentes').where('id', data.pop()).then(reg => {
      res.json(reg[0]);
    });
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
                console.log(results.data);
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
