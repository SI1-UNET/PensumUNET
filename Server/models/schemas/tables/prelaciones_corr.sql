INSERT INTO public.prelacion_corr (codigo_corr, codigo_mat, id_carrera) VALUES
-- Ingeniería en Informatica
('0846203T','0842204L',1),
('0846302T','0842303L',1),
-- Ingeniería Mecánica
('0846203T','0842204L',2),
('0846302T','0842303L',2),
('0914201T','0912202L',2),
('0924301T','0922302L',2),
('0615507T','0612508L',2),
('0624505T','0622506L',2),
('0634503T','0633504L',2),
('0624604T','0622502L',2),
('0634602T','0633603L',2),
('0214707T','0213708L',2),
('0625702T','0622703L',2),
('0634704T','0633705L',2),
('0624803T','0622804L',2),
('0624807T','0622808L',2),
('0624803T','0624807T',2),
('0213505T','0213608L',2),
('0234904T','0233905L',2),
-- Ingeniería Civil
('0846203T','0842204L',3),
('0846302T','0842303L',3),
('0914201T','0912202L',3),
-- Ingeniería Industrial - Semester II
('0846203T', '0842204L', 4), -- Fisica I -> Laboratorio Fisica I  
('0914201T', '0912202L', 4), -- Química General I -> Laboratorio Quimica General I
-- Ingeniería Industrial - Semester III
('0846203T', '0842303L', 4), -- Laboratorio Fisica II -> Fisica I
('0846302T', '0842303L', 4), -- Fisica II -> Laboratorio Fisica II
-- Ingeniería Industrial - Semester V
('0214507T', '0213508L', 4), -- Ingeniería Eléctrica -> Laboratorio Ingeniería Eléctrica 
('0624604T', '0622502L', 4), -- Mecánica Fluidos -> Laboratorio Mecánica Fluidos 
('0634509T', '0633512L', 4), -- Procesos Metalmecánicos -> Laboratorio Procesos Metalmecánicos
-- Ingeniería Industrial - Semester VI
('0113602T', '0112603L', 4), -- Ingenieria Métodos I -> Laboratorio Ingenieria Metodos I
('0124601T', '0113602T', 4), -- Ingenieria Métodos I -> Organización
('0124601T', '0124613T', 4), -- Sistemas Y Procedimientos -> Organización
-- Ingeniería Industrial - Semester VII
('0113705T', '0112706L', 4), -- Ingenieria Metodos II -> Laboratorio Ingenieria Metodos II
-- Ingeniería Electrónica - Semestre II
('0914201T', '0912202L', 5), -- QUIMICA GENERAL I -> LAB. DE QUIMICA GENERAL I
-- Ingeniería Electrónica - Semestre IV
('0213401T', '0212403L', 5), -- MEDICIONES -> LAB. DE MEDICIONES
-- Ingeniería Electrónica - Semestre V
('0225502T', '0225503T', 5), -- ELECTRONICA I -> SISTEMAS DIGITALES I
-- Ingeniería Ambiental - Semestre II
('0846203T', '0842204L', 6), -- Fisica I -> Laboratorio Fisica I  
('0914201T', '0912202L', 6), -- Química General I -> Laboratorio Quimica General I
('0924301T', '0922302L', 6), -- Laboratorio Quimica General II -> Química General II,
('0846302T', '0842303L', 6), -- Fisica II -> Laboratorio Fisica II
('0624604T', '0622502L', 6), -- Mecánica Fluidos -> Laboratorio Mecánica Fluidos
('0826401T', '0624604T', 6),
('0626401T', '0624604T', 6),
('1113610T', '1114611T', 6),
('1125804T', '1124801T', 6),

 -- Ingenieria Produccion Animal - Semestre I
  ( '0342105T', '0343106L', 7), -- Biologia(Ipa)Teoria -> Biologia - Laboratorio
-- Ingenieria Produccion Animal - Semestre II
  ( '0914201T', '0912202L', 7), -- Quimica General I-Teoria -> Quimica Gnerali-Laboratorio
  ( '0343205T', '0343206L', 7), -- Zoologia Agricola Teoria -> Zoologia Agricola Laboratorio
-- Ingenieria Produccion Animal - Semestre III
  ( '0924301T', '0922302L', 7), -- Quimica General Ii Teoria -> Quimica General Ii Laboratorio
  ( '0846203T', '0842204L', 7), -- Fisica I Teoria -> Fisica I Laboratorio
  ( '0846203T', '0524304T', 7), -- Fisica I Teoria -> Topografia
-- Ingenieria Produccion Animal - Semestre IV
  ( '0923401T', '0923402L', 7), -- Quimica Organica Teoria -> Quimica Organica Laboratorio
  ( '0846302T', '0842303L', 7), -- Fisica Ii Teoria -> Fisica Ii Laboratorio
-- Ingenieria Produccion Animal - Semestre V
  ( '0924501T', '0923502L', 7), -- Bioquimica Teoria -> Bioquimica Laboratorio
  ( '0314502T', '0313503L', 7), -- Αnatomia Αnimal Teoria -> Αnatomia Animal Laboratorio
-- Ingenieria Produccion Animal - Semestre VI
  ( '0313504T', '0312508L', 7), -- Genetica Teoria -> Genetica Laboratorio
  ( '0313601T', '0313602L', 7), -- Fisiologia Genral Teoria -> Fisiologia General Laboratorio
  ( '0313601T', '0343604T', 7), -- Fisiologia Genral Teoria -> Nutricion Animal I Teoria
  ( '0343604T', '0343605L', 7), -- Nutricion Animal I Teoria -> Nutricion Animal I Laboratorio
  ( '0333607T', '0333608L', 7), -- Microbiologia General Teoria -> Microbiologia General - Laboratorio
-- Ingenieria Produccion Animal - Semestre VII
  ( '0313701T', '0313702L', 7), -- Fisiologia De La Reproduccion Teoria -> Fisiologia De La Reproduccion Laboratorio
  ( '0333703T', '0333704L', 7), -- Microbiologia Aplicada Teoria -> Microbiologia Aplicada Laboratorio
  ( '0333707T', '0333708L', 7), -- Parasitologia Teoria -> Parasitologia Laboratorio
-- Ingenieria Produccion Animal - Semestre VIII
  ( '0533807T', '0532809L', 7), -- Forrajicultura -> Forrajicultura Laboratorio
  ( '0335803T', '0325805T', 7), -- Sanidad Animal -> Avicultura Teoria
  ( '0335803T', '0325809T', 7), -- Sanidad Animal -> Porcinotecnia Teoria
  ( '0533807T', '0345810T', 7), -- Forrajicultura -> Planificacion Y Administracion De Fincas
-- Ingenieria Produccion Animal - Semestre IX
  ( '0323903T', '0323904L', 7), -- Bovinos De Carne Teoria -> Bovinos De Carne Laboratorio
  ( '0323905T', '0323906L', 7), -- Bovinos De Leche Teoria -> Bovinos De Leche Laboratorio
  ( '0323903T', '0335901T', 7), -- Bovinos De Carne Teoria -> Industrias De La Carne
  ( '0323905T', '0335902T', 7), -- Bovinos De Leche Teoria -> Industria De La Leche

-- Psicología - Semestre IV
  ('2014401T', '2033402T', 10), -- Psicología Evolutiva I -> Psicología Educativa
-- Psicología - Semestre V
  ('1000001T', '1000002T', 10), -- Seminario De Servicio Comunitario -> Proyecto De Servicio Comunitario
  ('2026503T', '2023505T', 10), -- Instrumentos De La Exploración Psicológica I -> Entrevista Psicológica
  ('2012502T', '2026503T', 10), -- Teoría De La Personalidad -> Instrumentos De La Exploración Psicológica
-- Psicología - Semestre VI
  ('2026604T', '2033605T', 10), -- Instrumentos De La Exploración Psicológica II -> Psicología De Las Organizaciones
-- Psicología - Semestre VIII
  ('2035802T', '2036801T', 10), -- Psicología Clínica II -> Prácticas Profesionales I
-- Psicología - Semestre IX 
  ('2035902T', '2034901T', 10),
  ('2035902T', '2036903T', 10),

--Architectura - Semestre I
('0713101T', '0719102T', 11), 
('0756104T', '0719102T', 11), 
--Architectura - Semestre II
('0756206T', '0719201T', 11), 
--Architectura - Semestre III
('0753302T', '0719301T', 11),
--Architectura - Semestre IV
('0754403T', '0719401T', 11), 
--Architectura - Semestre V
('0724517T', '0719501T',11);

