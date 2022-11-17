from sqlalchemy.orm import Session
from sqlalchemy import select,desc
from models.libro_model import Libro
from models.tema_model import Tema
from schemas.libro_schemas import LibroBase,LibroForUpdate,LibroDTO
from controllers.autor_controller import AutorController
from controllers.tema_controller import TemaController

autor_controller = AutorController()
tema_controller = TemaController()
class LibroController:

    def get_all(self,db:Session):
        result = db.execute(select(Libro).order_by(Libro.isbn)).scalars().all()
        return result

    def new_libro(self,db:Session,datos:LibroBase):
        nuevo_libro: Libro = Libro(
            titulo=datos.titulo,
            cant_hojas=datos.cant_hojas,
            anio_edicion=datos.anio_edicion,
            editorial_id=datos.editorial_id,
            formato_id=datos.formato_id,
            isbn=datos.isbn
        )
        for autores_id in datos.autor_id:
            autor = autor_controller.get_by_id(db,autores_id)
            nuevo_libro.autores.append(autor)

        for temas_id in datos.temas_id:
            tema = tema_controller.get_by_id(db,temas_id)
            nuevo_libro.temas.append(tema)

        db.add(nuevo_libro)
        db.commit()
        result = self.get_by_isbn(db,nuevo_libro.isbn)
        libro = LibroDTO(
                    isbn = result.isbn,
                    anio_edicion = result.anio_edicion,
                    titulo = result.titulo,
                    cant_hojas = result.cant_hojas,
                    editorial_id = result.editorial_id,
                    formato_id = result.formato_id,
                    temas = result.temas,
                    autores = result.autores
                )
        return libro

    def get_by_isbn(self,db:Session,isbn:int):
            result = db.execute(select(Libro).where(Libro.isbn == isbn)).scalar()
            return result

    def update_libro(self,db:Session,datos:LibroForUpdate,isbn:int):
        libro_buscado = self.get_by_isbn(db,isbn)
        print(f'Libro buscado en Controller = {libro_buscado}')
        if libro_buscado is None:
            return None
        else:
            libro_buscado.titulo = datos.titulo if datos.titulo is not None else libro_buscado.titulo
            libro_buscado.cant_hojas = datos.cant_hojas if datos.cant_hojas is not None else libro_buscado.cant_hojas
            libro_buscado.anio_edicion = datos.anio_edicion if datos.anio_edicion is not None else libro_buscado.anio_edicion 
            libro_buscado.editorial_id = datos.editorial_id if datos.editorial_id is not None else libro_buscado.editorial_id
            libro_buscado.formato_id = datos.formato_id if datos.formato_id is not None else libro_buscado.formato.id

        for autores_id in datos.autor_id:
            autor = autor_controller.get_by_id(db,autores_id)
            libro_buscado.autores.append(autor)

        for temas_id in datos.temas_id:
            tema = tema_controller.get_by_id(db,temas_id)
            libro_buscado.temas.append(tema)

        db.commit()
        return self.get_by_isbn(db,isbn)

    def delete_libro(self,isbn:int,db:Session):
        libro_buscado = self.get_by_isbn(db,isbn)
        if libro_buscado is None:
            return None
        else:
            db.delete(libro_buscado)
            db.commit()
            return libro_buscado

    def get_by_query(self,db:Session,titulo:str, editorial_id:int, tema_id:int):

        # este objeto permite hacer consultas y va devolviendo objetos del mismo tipo para hacer otras
        result = db.query(Libro)

        if titulo is not None:
            print('Entra a titulo')
            result = result.filter(Libro.titulo.ilike(titulo))
        if editorial_id is not None:
            print('Entra a editorial')
            result = result.filter(Libro.editorial_id == editorial_id)
        if tema_id is not None:
            print('Entra a tema')
            result = result.join(Libro.temas).filter(Libro.temas.any(Tema.tema_id == tema_id))

        # guardo los datos de las consultas
        query_result = result.all()

        list_for_ret = []
        # por cada row que me trajo el query armo los DTOS utilizando los ISBN que me trajo el QUERY
        for resultados in query_result:
            res = self.get_by_isbn(db,resultados.isbn)
            if res is not None:
                libro = LibroDTO(
                    isbn = res.isbn,
                    anio_edicion = res.anio_edicion,
                    titulo = res.titulo,
                    cant_hojas = res.cant_hojas,
                    editorial_id = res.editorial_id,
                    formato_id = res.formato_id,
                    temas = res.temas,
                    autores = res.autores
                )
                list_for_ret.append(libro)
        
        return list_for_ret