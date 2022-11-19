INSERT INTO public.editorial(nombre, direccion, url) VALUES
('Planeta', 'Av. Independencia 1668, CABA', 'https://www.planetadelibros.com/'),
('Atlántida', 'Elcano 3847, CABA', 'https://atlantida.com.ar/'),
('Kapelusz', 'Av. Leandro N. Alem 720 - Piso 6, CABA', 'https://www.editorialkapelusz.com/'),
('Perfil', 'California 2715, CABA', 'https://www.perfil.com/');

INSERT INTO public.formato(nombre) VALUES
('Tapa blanda'),
('Tapa dura'),
('Folleto'),
('Ebook');

INSERT INTO public.tema(nombre) VALUES
('Poesía'),
('Terror'),
('Novela'),
('Thriller');

INSERT INTO public.autor(dni, nombre, apellido) VALUES
(34650674, 'Gaston', 'Chatelet'),
(34299864, 'Eloisa', 'Garcia Anino');

INSERT INTO public.libro(isbn, titulo, cant_hojas, anio_edicion, editorial_id, formato_id) VALUES 
(1234567890123, 'Opera Prima', 123, 1998, 1, 1),
(1234567890124, 'Segundo libro', 456, 2008, 2, 4),
(1234567890125, 'El tercero viene con mas contenido', 789, 2000, 2, 3),
(1234567890126, 'El cuarto es un robo', 321, 1977, 3, 3);