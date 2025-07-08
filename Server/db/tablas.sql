DROP TABLE IF EXISTS departamento CASCADE;
CREATE TABLE departamento(
    id int,
    nombre varchar(128) NOT NULL,

    PRIMARY KEY(id)
);

DROP TABLE IF EXISTS nucleo CASCADE;
CREATE TABLE nucleo(
    id int,
    nombre varchar(128) NOT NULL,
    id_departamento int NOT NULL,

    PRIMARY KEY(id),
    FOREIGN KEY (id_departamento) REFERENCES departamento(id)
);

DROP TABLE IF EXISTS carrera CASCADE;
CREATE TABLE carrera (
    id int,
    nombre varchar(128) NOT NULL,
    uc_totales int NOT NULL,

    CHECK (uc_totales >= 0),
    PRIMARY KEY(id)
);

DROP TABLE IF EXISTS semestre CASCADE;
CREATE TABLE semestre(
    id int,
    semestre char(3) NOT NULL,
    num_semestre int NOT NULL,

    PRIMARY KEY(id)
);

DROP TABLE IF EXISTS info_materia CASCADE;
CREATE TABLE info_materia(
    codigo char(8),
    nombre varchar(128) NOT NULL,
    info varchar(256),
    uc int NOT NULL,
    horas_estudio int NOT NULl,
    id_departamento int NOT NULL,

    PRIMARY KEY(codigo),
    FOREIGN KEY(id_departamento) REFERENCES departamento(id),
    CHECK (uc >= 0 AND horas_estudio >= 0)
);

DROP TABLE IF EXISTS materia CASCADE;
CREATE TABLE materia (
    codigo char(8),
    id_carrera int,
    id_semestre int NOT NULl,
    electiva boolean NOT NULL,
    id_nucleo int NOT NULL,

    PRIMARY KEY(codigo,id_carrera),
    FOREIGN KEY(id_carrera) REFERENCES carrera(id),
    FOREIGN KEY(id_nucleo) REFERENCES departamento(id),
    FOREIGN KEY(id_semestre) REFERENCES semestre(id)
);

DROP TABLE IF EXISTS prelacion_materias CASCADE;
CREATE TABLE prelacion_materias (
    codigo_mat char(8),
    codigo_mat_prela char(8),
    id_carrera int NOT NULL,

    PRIMARY KEY(codigo_mat, codigo_mat_prela),
    FOREIGN KEY(id_carrera) REFERENCES carrera(id),
    FOREIGN KEY(codigo_mat, id_carrera) REFERENCES materia(codigo, id_carrera),
    FOREIGN KEY(codigo_mat_prela, id_carrera) REFERENCES materia(codigo, id_carrera)
);

DROP TABLE IF EXISTS prelacion_uc CASCADE;
CREATE TABLE prelacion_uc (
    codigo_mat char(8),
    id_carrera int,
    uc int NOT NULL,

    PRIMARY KEY(codigo_mat, id_carrera),
    FOREIGN KEY(codigo_mat, id_carrera) REFERENCES materia(codigo, id_carrera),
    CHECK (uc >= 0)
);
