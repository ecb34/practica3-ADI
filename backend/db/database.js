var faker = require('faker');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');

//Conexion a la BD
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'ua',
  host: 'localhost',
  database: 'adi_prueba',
  password: '1234',
  port: 5432,
});



/************* POBLAR BASE DE DATOS **********************/

if (process.env.POBLAR === 'true')
  poblarBaseDatos();

async function poblarBaseDatos() {
  await vaciarTablas();
  await poblarUsuario();
  await poblarPublicacion();
  await poblarGrupo();
  await poblarComentario();
  await poblarUsuariosEnGrupos();
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

async function vaciarTablas() {
  await pool.query('TRUNCATE usuario, usuario_grupo, publicacion, comentario, grupo RESTART IDENTITY'); //revisar si toca en cascade
}

async function poblarUsuariosEnGrupos() {
  const res = await pool.query('SELECT count(*) from usuario_grupo');
  const resUsuario = await pool.query('SELECT min(id), max(id) from usuario');
  const resGrupo = await pool.query('SELECT min(id), max(id) from grupo');
  //solo poblar si esta vacia, para no repetir datos
  if (res.rows[0].count == 0) {
    const texto = "INSERT INTO usuario_grupo(id_usuario, id_grupo) VALUES($1, $2)";
    for (var i = 1; i < 30; i++) {
      const id_usuario = getRandom(resUsuario.rows[0].min, resUsuario.rows[0].max + 1);
      const id_grupo = getRandom(resGrupo.rows[0].min, resGrupo.rows[0].max + 1);
      const valores = [id_usuario, id_grupo];
      try {
        await pool.query(texto, valores)
      } catch (err) {
        console.log(err.stack)
      }
    }
    console.log('Poblado usuario_grupo');
  }
}

async function poblarComentario() {
  const res = await pool.query('SELECT count(*) from comentario');
  //solo poblar si esta vacia, para no repetir datos
  if (res.rows[0].count == 0) {
    const texto = 'INSERT INTO comentario(contenido,usuario_id, publicacion_id) VALUES($1, $2, $3)';
    const resUsuario = await pool.query('SELECT min(id), max(id) from usuario');
    const resPublicacion = await pool.query('SELECT min(id), max(id) from publicacion');
    for (var i = 1; i < 30; i++) {
      const contenido = faker.lorem.text();
      const usuario_id = getRandom(resUsuario.rows[0].min, resUsuario.rows[0].max + 1);
      const publicacion_id = getRandom(resPublicacion.rows[0].min, resPublicacion.rows[0].max + 1);
      const valores = [contenido, usuario_id, publicacion_id];
      try {
        await pool.query(texto, valores)
      } catch (err) {
        console.log(err.stack)
      }
    }
    console.log('Poblado comentario');
  }
}

async function poblarPublicacion() {
  const res = await pool.query('SELECT count(*) from publicacion');
  //solo poblar si esta vacia, para no repetir datos
  if (res.rows[0].count == 0) {
    //para el test de borrar publicacion
    await pool.query('INSERT INTO publicacion(titulo,contenido, autor_id, imagen) VALUES($1,$2,$3, $4)', ['prueba', 'publicacion user', 1, "imagen"])
    const resUsuario = await pool.query('SELECT min(id), max(id) from usuario');
    for (let i = 1; i < 30; i++) {
      const titulo = faker.lorem.words();
      const contenido = faker.lorem.text();
      let imagen = undefined
      try {
        const respuesta = await fetch('https://dog.ceo/api/breeds/image/random')
        if (respuesta.ok) { //cambiar a status.ok?
          const json = await respuesta.json()
          imagen = json.message
        }
      } catch (err) {
        console.log(err.stack)
      }
      const autor_id = getRandom(resUsuario.rows[0].min, resUsuario.rows[0].max + 1);
      const texto = 'INSERT INTO publicacion(titulo,contenido,imagen, autor_id) VALUES($1, $2, $3, $4)';
      const valores = [titulo, contenido, imagen, autor_id];
      try {
        await pool.query(texto, valores)
      } catch (err) {
        console.log(err.stack)
      }
    }
    console.log('Poblado publicacion');
  }
}

async function poblarGrupo() {
  const res = await pool.query('SELECT count(*) from grupo');
  //solo poblar si esta vacia, para no repetir datos
  if (res.rows[0].count == 0) {
    const texto = 'INSERT INTO grupo(nombre) VALUES($1)';
    for (let i = 1; i < 30; i++) {
      const nombre = faker.lorem.word();
      const valores = [nombre];
      try {
        await pool.query(texto, valores)
      } catch (err) {
        console.log(err.stack)
      }
    }
    console.log('Poblado grupo');
  }
}

async function poblarUsuario() {
  const res = await pool.query('SELECT count(*) from usuario');
  //solo poblar si esta vacia, para no repetir datos
  if (res.rows[0].count == 0) {
    try { //usuario para pruebas de autenticacion
      bcrypt.hash('1234', Number(process.env.SALTROUNDS), function (err, hash) {
        if (err) err.stack;
        else {
          pool.query('INSERT INTO usuario(nombre, password, alias, popularidad, edad) VALUES($1,$2,$3, $4,$5)', ['user', hash, 'user', 60, 18], (err, res) => {
            if (err) err.stack;
          });
        }
      });
    } catch (err) {
      console.log(err.stack);
    }
    const texto = 'INSERT INTO usuario(nombre, password, alias, popularidad, edad) VALUES($1, $2, $3, $4, $5)';
    for (let i = 1; i < 30; i++) {
      const nombre = faker.name.firstName();
      const password = '1234'
      const alias = faker.internet.userName();
      const popularidad = getRandom(0, 101);
      let edad = undefined
      try {
        const respuesta = await fetch('https://api.agify.io?name=' + nombre) //poner try catch, cambiar a response.ok?

        if (respuesta.ok) { //solo coger la edad cuando la peticion haya sido completada satisfactoriamente
          const json = await respuesta.json()
          edad = json.age
        }
      } catch (err) {
        console.log(err.stack);
      }
      try {
        bcrypt.hash(password, Number(process.env.SALTROUNDS), function (err, hash) {
          if (err) err.stack;
          else {
            const valores = [nombre, hash, alias, popularidad, edad];
            pool.query(texto, valores, (err, res) => {
              if (err) err.stack;
            })
          }
        })
      } catch (err) {
        console.log(err.stack)
      }
    }
    console.log('Poblado usuario');
  }
}

/************* CONSULTAS A BASE DE DATOS**********************/
const authenticate = (req, res) => {
  const nombre = req.body.nombre;
  const password = req.body.password;
  pool.query('SELECT password,id FROM usuario where nombre = $1', [nombre], (error, results) => {
    if (error) {
      res.status(500).send({
        error: 'error interno'
      });
    } else {
      if (!results.rows[0]) {
        res.status(404).send({
          error: 'Usuario incorrecto'
        })
      } else {
        bcrypt.compare(password, results.rows[0].password).then(match => {
          if (match) {
            // Create a token
            const payload = {
              user: nombre,
              id: results.rows[0].id
            };
            const token = jwt.encode(payload, process.env.SECRET)
            res.status(200).send({
              token: token,
              id: results.rows[0].id
            });
          } else {
            res.status(404).send({
              error: 'Contraseña incorrecta'
            });
          }
        });
      }
    }
  })
}

function checkToken(req, res) {
  const token = req.headers['authorization']
  if (!token) {
    var error = new Error()
    error.message = 'Se necesita autenticarse para esta operación'
    error.status = 401
    throw error
  } else {
    try {
      const payload = jwt.decode(token, process.env.SECRET)
      return [payload.user, payload.id]
    } catch (err) {
      var error = new Error()
      error.message = 'token no válido'
      error.status = 401
      throw error
    }
  }
}

//comprueba si el usuario autorizado es el mismo que el autor de la publicacion
async function checkSameUserPublicacion(id_publicacion, nombreToken) {
  try {
    const results = await pool.query('SELECT nombre from usuario where id = (select autor_id from publicacion where id = $1)', [id_publicacion])
    if (results.rows[0].nombre === nombreToken) { // si son iguales, ok
      return 200
    } else { //si son diferentes, no tiene permisos
      return 403
    }
  } catch (err) { //si no ha encontrado, es que no existe publicación con ese id
    return 404
  }
}
/***************** GRUPOS ************************/
const getGroups = async (req, res) => {
  try {
    const result = await pool.query('SELECT * from grupo')
    res.status(200).json(result.rows)
  } catch (err) {
    res.status(500).send({
      error: 'Error interno'
    })
  }
}

const createGroup = (req, res) => {
  try {
    checkToken(req, res)
    const nombre = req.body.nombre
    if (!nombre) {
      res.status(400).send({
        error: 'Se necesita un nombre'
      })
    } else {
      pool.query('INSERT INTO grupo(nombre) values ($1) returning id', [nombre], (error, result) => {
        if (error) {
          res.status(500).send({
            error: 'error interno'
          })
        }
        res.status(201).header('Location', 'localhost:3000/api/grupos/' + result.rows[0].id).send({
          ok: 'ok'
        })
      })
    }
  } catch (err) {
    res.status(err.status).send({
      error: err.message
    })
    return
  }
}

/**************** USUARIOS ************************/
const getUsuarios = (req, res) => {
  pool.query('SELECT nombre,popularidad FROM usuario ORDER BY popularidad DESC', (error, results) => {
    if (error) {
      res.status(500).send({
        error: "error interno"
      });
    } else
      res.status(200).json(results.rows);
  })
}

const getUsuario = (req, res) => {
  const nombre = req.params.nombre
  pool.query('SELECT * from usuario where nombre = $1', [nombre], (error, results) => {
    if (error) {
      res.status(500).send({
        error: "error interno"
      })
    } else {
      res.status(200).json(results.rows[0]);
    }
  })
}

const updateUsuario = (req, res) => {
  try {
    const [nombreToken, _] = checkToken(req, res)
    const nombre = req.params.nombre
    if (nombreToken === nombre) {
      const alias = req.body.alias;
      let popularidad = req.body.popularidad
      let query
      let values
      if (popularidad > 100 || popularidad < 0) popularidad = undefined //si se da mal, no actualizar la popularidad
      if (alias && popularidad) {
        query = 'UPDATE usuario SET alias = $1, popularidad = $2 where nombre = $3'
        values = [alias, popularidad, nombre]
      } else if (alias) {
        query = 'UPDATE usuario SET alias = $1 where nombre = $2'
        values = [alias, nombre]
      } else if (popularidad) {
        query = 'UPDATE usuario SET popularidad = $1 where nombre = $2'
        values = [popularidad, nombre]
      } else {
        res.status(400).send({
          error: 'No has dado información que actualizar'
        })
        return
      }
      pool.query(query, values, (error) => {
        if (error) {
          res.status(500).send({
            error: 'error interno'
          })
        } else {
          res.status(204).send({
            ok: 'informacion actualizada',
            alias: alias,
            popularidad: popularidad
          })
        }
      })
    } else {
      res.status(403).send({
        error: 'Solo puedes actualizar la información de tu usuario o el usuario no existe'
      })
    }
  } catch (err) {
    res.status(err.status).send({
      error: err.message
    })
  }
}

const deleteUsuario = (req, res) => { //do to check if the user doesnt exist
  const nombre = req.params.nombre
  try {
    const [nombreToken, _] = checkToken(req, res)
    if (nombreToken === nombre) {
      res.status(403).send({
        error: 'No puedes borrar tu usuario'
      })
    } else {
      pool.query('DELETE from usuario where nombre = $1', [nombre], (error, results) => {
        if (error) res.status(500).send({
          error: 'Error interno'
        })
        else
          res.status(204).send({
            ok: 'Usuario borrado'
          })
      })
    }
  } catch (err) {
    res.status(err.status).send({
      error: err.mesage
    })
  }
}
/**************** COMENTARIOS  *********************/
const addComentarioPublicacion = (req, res) => {
  try {
    const [_, idUser] = checkToken(req, res)
    const id_publicacion = req.params.idPublicacion;
    pool.query('SELECT count(*) from publicacion where id = $1', [id_publicacion], (error, results) => {
      if (error) res.status(500).send({
        error: 'Error interno'
      })
      else if (results.rows[0].count == 1) { //si la publicacion existe
        const comentario = req.body.comentario
        if (comentario) {
          pool.query('INSERT INTO comentario(contenido,usuario_id,publicacion_id) values ($1,$2,$3) returning id', [comentario, idUser, id_publicacion], (errorComentario, resComentario) => {
            if (errorComentario) res.status(500).send({
              error: 'Error interno'
            })
            else res.status(201).header('Location', 'localhost:3000/api/publicaciones/' + id_publicacion + '/comentarios/' + resComentario.rows[0].id).send({
              ok: 'Comentario agregado'
            })
          })
        } else { //si no existe, bad request
          res.status(400).send({
            error: 'Comentario no puede ser vacío'
          })
        }
      } else {
        res.status(404).send({
          error: 'No existe publicación con id ' + id_publicacion
        })
      }
    })
  } catch (err) {
    res.status(err.status).send({
      error: err.mesage
    })
  }
}
const getComentariosPublicacion = (req, res) => {
  const id_publicacion = req.params.idPublicacion;
  pool.query('SELECT count(*) from publicacion where id = $1', [id_publicacion], (error, results) => {
    if (error) {
      res.status(500).send({
        error: 'Error interno'
      })
    } else {
      if (results.rows[0].count == 1) {
        pool.query("SELECT contenido, usuario_id from comentario where publicacion_id = $1", [id_publicacion], (error, results) => {
          if (error) {
            res.status(500).send({
              error: 'Error interno'
            });
          } else {
            res.status(200).json(results.rows);
          }
        })
      } else {
        res.status(404).send({
          error: 'No existe publicacion con id ' + id_publicacion
        })
      }
    }
  })

}

const deleteComentariosPublicacion = async (req, res) => { //comprobar que idPublicacion sea correcto
  try {
    const [nombreToken, _] = checkToken(req, res)
    const id_publicacion = req.params.idPublicacion
    const resCheckUser = await checkSameUserPublicacion(id_publicacion, nombreToken)
    switch (resCheckUser) {
      case 200:
        pool.query('DELETE from comentario where publicacion_id = $1', [id_publicacion], (error) => {
          if (error) {
            res.status(500).send({
              error: 'error interno'
            })
            console.log(error.stack)
          } else {
            res.status(204).send({
              ok: 'Comentarios borrados para publicacion ' + id_publicacion
            })
          }
        })
        break;
      case 403:
        res.status(resCheckUser).send({
          error: 'Solo el autor puede borrar todos los comentarios de su publicación'
        })
        break;
      case 404:
        res.status(resCheckUser).send({
          error: 'No existe publicación con id ' + id_publicacion
        })
    }
  } catch (err) {
    res.status(err.status).send({
      error: err.message
    })
  }
}

/************* PUBLICACION **************************/
const getPublicaciones = (req, res) => {
  pool.query('SELECT * from publicacion ORDER BY id DESC', (error, results) => {
    if (error) {
      res.status(500).send({
        error: 'error interno'
      })
    } else {
      res.status(200).json(results.rows)
    }
  })
}
const getPublicacion = (req, res) => {
  id_publicacion = req.params.id
  pool.query('SELECT * from publicacion where id = $1', [id_publicacion], (error, results) => {
    if (error) {
      res.status(500).send({
        error: 'error interno'
      })
    } else {
      if (results.rows.length > 0) {
        res.status(200).json(results.rows[0])
      } else {
        res.status(404).send({
          error: 'No existe publicación con id ' + id_publicacion
        })
      }
    }
  })
}

const deletePublicacion = async (req, res) => {
  try {
    const id_publicacion = req.params.id;
    const [nombreToken, _] = checkToken(req, res)
    const resCheckUser = await checkSameUserPublicacion(id_publicacion, nombreToken)
    switch (resCheckUser) {
      case 200:
        pool.query("DELETE from comentario where publicacion_id = $1", [id_publicacion], (error) => {
          if (error) {
            console.log(error.stack);
            res.status(404).send({
              error: 'error interno al borrar'
            });
          } else {
            pool.query("DELETE from publicacion where id = $1", [id_publicacion], (error) => { //borrar tambien referencias en comentario
              if (error) {
                console.log(error.stack);
                res.status(500).send({
                  error: 'error interno al borrar'
                });
              } else {
                res.status(204).send({
                  ok: 'Publicacion borrada'
                });
              }
            })
          }
        })
        break;
      case 403:
        res.status(resCheckUser).send({
          error: 'solo el autor puede borrar la publicación'
        })
        break;
      case 404:
        res.status(resCheckUser).send({
          error: 'No existe publicación con id ' + id_publicacion
        })
        break;
    }
  } catch (err) {
    res.status(err.status).send({
      error: err.message
    })
  }
}

const addPublicacion = (req, res) => {
  try {
    const [_, autorId] = checkToken(req, res) //hacer que token tenga payload de nombre e id
    const titulo = req.body.titulo;
    const contenido = req.body.contenido;
    if (titulo && contenido) {
      pool.query('INSERT INTO publicacion(titulo,contenido, autor_id) values ($1, $2, $3) returning id', [titulo, contenido, autorId], (error, result) => {
        if (error) {
          console.log(error.stack)
          res.status(500).send({
            error: 'error interno'
          })
        } else {
          const id = result.rows[0].id
          res.status(201).header('Location', 'localhost:3000/api/publicaciones/' + id).send({
            id: id,
            titulo: titulo,
            contenido: contenido
          })
        }
      })
    } else {
      res.status(400).send({
        error: 'se necesita titulo y contenido'
      })
    }

  } catch (err) {
    res.status(err.status).send({
      error: err.message
    })
  }
}

const updatePublicacion = (req, res) => {
  try {

    const id = req.params.id
    const titulo = req.body.titulo
    const contenido = req.body.contenido
    let query
    if (titulo && contenido) {
      query = 'UPDATE publicacion SET titulo = $1, contenido = $2 where id = $3 returning id'
      values = [titulo, contenido, id]
    } else if (titulo) {
      query = 'UPDATE publicacion SET titulo = $1 where id = $2 returning id'
      values = [titulo, id]
    } else if (contenido) {
      query = 'UPDATE publicacion SET contenido = $1 where id = $2 returning id'
      values = [contenido, id]
    } else {
      res.status(400).send({
        error: 'No has dado información que actualizar'
      })
      return
    }
    pool.query(query, values, (error, result) => {
      if (error) {
        res.status(500).send({
          error: 'error interno'
        })
      } else if (result.rows.length == 1) {
        res.status(204).send()
      } else {
        res.status(404).send({
          error: 'publicacion no encontrada'
        })
      }
    })
  } catch (err) {
    res.status(err.status).send({
      error: err.message
    })
  }
}

module.exports = {
  authenticate,
  getUsuarios,
  getUsuario,
  updateUsuario,
  deleteUsuario,
  addComentarioPublicacion,
  getComentariosPublicacion,
  deleteComentariosPublicacion,
  addPublicacion,
  deletePublicacion,
  getPublicacion,
  getPublicaciones,
  updatePublicacion,
  createGroup,
  getGroups
}