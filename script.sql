INSERT INTO public.editorial(nombre, direccion, url) VALUES
('Planeta', 'Av. Independencia 1668, CABA', 'https://www.planetadelibros.com/'),
('Andavira', 'Vía Edison, 33 - Santiago de Compostela (A Coruña)', 'https://www.andavira.com/');

INSERT INTO public.formato(nombre) VALUES
('Tapa blanda'),
('Tapa dura'),
('Folleto'),
('Ebook');

INSERT INTO public.tema(nombre) VALUES
('Poesía'),
('Autoayuda'),
('Novela'),
('Thriller');

INSERT INTO public.autor(dni, nombre, apellido) VALUES
(10456789, 'Edith', 'Eger'), 
(11342876, 'Álex', 'Rovira'), 
(24654100, 'Vincas', 'Richardson'), 
(21123456, 'Fernando', 'Trías de Bes'), 
(14702583, 'Paula', 'Hawkins');

INSERT INTO public.libro(isbn, titulo, cant_hojas, anio_edicion, editorial_id, formato_id) VALUES 
(9788408231622, 'Las siete llaves', 304, 2020, 1, 2),
(9788408263722, 'La bailarina de Auschwitz', 416, 2022, 1, 1),
(9788445012376, 'Wody', 416, 2022, 1, 1),
(9788408263715, 'La chica del tren', 496, 2022, 1, 2);