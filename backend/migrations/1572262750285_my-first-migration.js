/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('usuario', {
        id: 'id',
        nombre: {type: 'varchar(100)', notNull: true},
        password: {type: 'varchar(200)', notNull: true},
        alias: {type: 'varchar(100)'},
        popularidad : {type: 'integer'},
        edad: {type: 'integer'}
    }),
    pgm.createTable('grupo', {
        id: 'id',
        nombre: {type: 'varchar(100)', notNull: true}
    })
    pgm.createTable('usuario_grupo', {
        id: 'id',
        id_usuario: {
            type: 'integer',
            notNull: true,
            references: '"usuario"',
            onDelete: 'cascade'
        },
        id_grupo: {
            type: 'integer',
            notNull: true,
            references: '"grupo"',
            onDelete: 'cascade'
        }
    }),
    pgm.createTable('publicacion', {
        id: 'id',
        titulo: {type: 'varchar(100)'},
        contenido: {type: 'varchar(1000)'},
        imagen: {type: 'varchar(200)'},
        autor_id: {
            type: 'integer',
            notNull: true,
            references: '"usuario"',
            onDelete: 'cascade'
        }
    }),
    pgm.createTable('comentario', {
        id: 'id',
        contenido: {type: 'varchar(1000)'},
        usuario_id : {
            type: 'integer',
            notNull: true,
            references: '"usuario"',
            onDelete: 'cascade'
        },
        publicacion_id : {
            type: 'integer',
            notNull: true,
            references: '"publicacion"',
            onDelete: 'cascade'
        }
    })
};

exports.down = (pgm) => {
    pgm.dropTable('comentario'),
    pgm.dropTable('usuario_grupo'),
    pgm.dropTable('publicacion'),
    pgm.dropTable('grupo')
    pgm.dropTable('usuario')
};
