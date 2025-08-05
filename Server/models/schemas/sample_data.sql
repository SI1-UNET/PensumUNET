INSERT INTO public.departamento (id, nombre) VALUES
(1, 'Departamento'),
(2, 'Departamento de Ingeniería Informática'),
(3, 'Departamento de Matemática y Física'),
(4, 'Departamento de Ciencia Sociales'),
(5, 'Departamento de Química'),
(6, 'Departamento de Ingeniería Electrónica'),
(7, 'Departamento de Ingeniería Industrial'),
(8, 'Departamento de Ingeniería Mecánica'),
(9, 'Departamento de Ingeniería Ambiental'),
(10,'Departamento de Ingeniería Civil');



INSERT INTO public.carreras (id, nombre, uc_total) VALUES
(1, 'Ingeniería en Informática',156),
(2, 'Ingeniería Mecánica', 168 ),
(3, 'Ingeniería Civil', 156);


INSERT INTO public.nucleo (id, nombre, id_departamento) VALUES
(1, 'Nucleo', 1),
-- Ingeniería Informática
(2, 'Tecnología básicas', 2),
(3, 'Telemática', 2),
(4, 'Ingeniería de la información', 2),
-- Ingeniería Mecánica
(5,'Termofluidos', 8),
(6,'Diseño Mecánico', 8),
(7,'Mecánica del Solido', 8),
(8, 'Materiales y Procesos', 8),
--Departamento de Matematica y Física
(9,'Matematica',3),
(10,'Matematica Aplicada',3),
(11,'Física',3),
--Departamento de Química
(12,'Química Básica',5),
(13,'Química Avanzada',5);
