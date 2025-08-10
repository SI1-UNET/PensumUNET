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
(10,'Departamento de Ingeniería Civil'),
(11,'Departamento de Ingeniería en Producción Animal'),
(12,'Departamento de Psicología'),
(13,'Departamento de Arquitectura');

INSERT INTO public.carreras (id, nombre, uc_total) VALUES
(1, 'Ingeniería En Informática',156),
(2, 'Ingeniería Mecánica', 168 ),
(3, 'Ingeniería Civil', 156),
(4, 'Ingeniería Industrial', 169),
(5, 'Ingeniería Electronica',164),
(6, 'Ingeniería Ambiental', 154),
(7, 'Ingeniería en Producción Animal', 167),
(10, 'Licenciatura en Psicología', 139),
(11, 'Arquitectura', 167);

INSERT INTO public.nucleo (id, nombre, id_departamento) VALUES
(1, 'Nucleo', 1),
-- Ingeniería En Informática
(2, 'Tecnología básicas', 2),
(3, 'Telemática', 2),
(4, 'Ingeniería de la información', 2),
-- Ingeniería Mecánica
(5,'Termofluidos', 8),
(6,'Diseño Mecánico', 8),
(7,'Mecánica del Solido', 8),
(8,'Materiales y Procesos', 8),
--Departamento de Matematica y Física
(9,'Matematica',3),
(10,'Matematica Aplicada',3),
(11,'Física',3),
--Departamento de Química
(12,'Química Básica',5),
(13,'Química Avanzada',5),
--Departamento de Ingeniería Industrial
(14,'Producción',7), --amarillo
(15,'Técnicas Cuantitativas',7), --rojo
(16,'Gerencia',7), -- Azul
--Deparamento de Ingeniería Electrónica
(17,'Electricidad',6),
(18,'Electrónica Y Sistemas Digitales',6),
(19,'Instrumentación Y Control',6),
(20,'Telecomunicaciones',6),
--Departamento de Arquitectura
(21,'Historia',11),
(22,'Ciencias Básicas',11),
(23,'Producción Y Tecnología ',11),
(24,'Proyectos',11),
(25,'Sistemas De Representación Y Simulación',11),
(26,'Contexto Ambiental',11),
(27,'Formación Integral',11);



