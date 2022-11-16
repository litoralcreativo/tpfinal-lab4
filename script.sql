INSERT INTO public.editorial(nombre, direccion, url) VALUES
('Planeta', 'Av. Independencia 1668, CABA', 'https://www.planetadelibros.com/'),
('Atlántida', 'Elcano 3847, CABA', 'https://atlantida.com.ar/'),
('Kapelusz', 'Av. Leandro N. Alem 720 - Piso 6, CABA', 'https://www.editorialkapelusz.com/'),
('Perfil', 'California 2715, CABA', 'https://www.perfil.com/');

INSERT INTO public.formato(nombre) VALUES
('Tapa blanda'),
('Tapa dura'),
('folleto'),
('Ebook');

INSERT INTO public.tema(nombre) VALUES
('Poesía'),
('Terror'),
('Novela'),
('Thriller');

INSERT INTO public.autor(dni, nombre, apellido) VALUES
(34650674, 'Gaston', 'Chatelet'),
(34299864, 'Eloisa', 'Garcia Anino');

