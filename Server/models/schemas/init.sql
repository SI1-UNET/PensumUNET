BEGIN;

ALTER TABLE IF EXISTS public.materia DROP CONSTRAINT IF EXISTS None;

ALTER TABLE IF EXISTS public.departamento DROP CONSTRAINT IF EXISTS None;

ALTER TABLE IF EXISTS public.departamento DROP CONSTRAINT IF EXISTS None;

ALTER TABLE IF EXISTS public.nucleo DROP CONSTRAINT IF EXISTS None;

ALTER TABLE IF EXISTS public.prelacion_mat DROP CONSTRAINT IF EXISTS None;

ALTER TABLE IF EXISTS public.prelacion_mat DROP CONSTRAINT IF EXISTS None;

ALTER TABLE IF EXISTS public.prelacion_mat DROP CONSTRAINT IF EXISTS None;

ALTER TABLE IF EXISTS public.semestre_mat_carrera DROP CONSTRAINT IF EXISTS None;

ALTER TABLE IF EXISTS public.semestre_mat_carrera DROP CONSTRAINT IF EXISTS None;



DROP TABLE IF EXISTS public.materia;

CREATE TABLE IF NOT EXISTS public.materia
(
    codigo character varying(8) NOT NULL,
    nombre character varying(90) NOT NULL,
    info character varying(256) NOT NULL,
    uc integer NOT NULL,
    horas_estudio integer NOT NULL,
    electiva boolean NOT NULL,
    id_departamento integer NOT NULL,
    id_nucleo integer NOT NULL,
    correquisito boolean NOT NULL,
    PRIMARY KEY (codigo)
);

DROP TABLE IF EXISTS public.departamento;

CREATE TABLE IF NOT EXISTS public.departamento
(
    id serial NOT NULL,
    nombre character varying(120) NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS public.carreras;

CREATE TABLE IF NOT EXISTS public.carreras
(
    id smallserial NOT NULL,
    nombre character varying(90) NOT NULL,
    uc_total integer NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS public.nucleo;

CREATE TABLE IF NOT EXISTS public.nucleo
(
    id serial NOT NULL,
    nombre character varying(120) NOT NULL,
    id_departamento integer NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS public.prelacion_mat;

CREATE TABLE IF NOT EXISTS public.prelacion_mat
(
    id serial NOT NULL,
    codigo_prel character varying(8) NOT NULL,
    codigo_mat character varying(8) NOT NULL,
    id_carrera integer NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS public.prelacion_uc;

CREATE TABLE IF NOT EXISTS public.prelacion_uc
(
    id serial NOT NULL,
    min_uc integer NOT NULL,
    codigo_mat character varying(8) NOT NULL,
    id_carrera integer NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS public.semestre_mat_carrera;

CREATE TABLE IF NOT EXISTS public.semestre_mat_carrera
(
    codigo_materia character varying(8) NOT NULL,
    id_carrera integer NOT NULL,
    semestre integer NOT NULL
);

ALTER TABLE IF EXISTS public.materia
    ADD FOREIGN KEY (id_departamento)
    REFERENCES public.departamento (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

ALTER TABLE IF EXISTS public.materia
    ADD FOREIGN KEY (id_nucleo)
    REFERENCES public.nucleo (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

ALTER TABLE IF EXISTS public.nucleo
    ADD FOREIGN KEY (id_departamento)
    REFERENCES public.departamento (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.prelacion_mat
    ADD FOREIGN KEY (codigo_prel)
    REFERENCES public.materia (codigo) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.prelacion_mat
    ADD FOREIGN KEY (codigo_mat)
    REFERENCES public.materia (codigo) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.prelacion_mat
    ADD FOREIGN KEY (id_carrera)
    REFERENCES public.carreras (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

ALTER TABLE IF EXISTS public.prelacion_uc
    ADD FOREIGN KEY (codigo_mat)
    REFERENCES public.materia (codigo) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

ALTER TABLE IF EXISTS public.prelacion_uca
    ADD FOREIGN KEY (id_carrera)
    REFERENCES public.carreras (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

ALTER TABLE IF EXISTS public.semestre_mat_carrera
    ADD FOREIGN KEY (codigo_materia)
    REFERENCES public.materia (codigo) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.semestre_mat_carrera
    ADD FOREIGN KEY (id_carrera)
    REFERENCES public.carreras (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

END;