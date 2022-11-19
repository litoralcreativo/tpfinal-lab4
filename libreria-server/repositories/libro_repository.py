from sqlalchemy.orm import Session
from sqlalchemy import select
from models.libro_model import Libro
from models.tema_model import Tema
from schemas.libro_schemas import LibroBase,LibroForUpdate,LibroDTO
from repositories.autor_repository import AutorRepository
from repositories.tema_repository import TemaRepository
from repositories.editorial_repository import EditorialRepository
from repositories.formato_repository import FormatoRepository
from typing import List
from utils.list import create_int_list
from utils.creates import create_autor,create_formato

autor_respository = AutorRepository()
temas_repository = TemaRepository()
editorial_repository = EditorialRepository()
formato_repository = FormatoRepository()
class LibroRepository:

    def get_all(self,db:Session) -> List[Libro]:
        result = db.execute(select(Libro).order_by(Libro.isbn)).scalars().all()
        return result

    def new_libro(self,db:Session,datos:LibroBase) -> Libro:
        nuevo_libro: Libro = Libro(
            titulo=datos.titulo,
            cant_hojas=datos.cant_hojas,
            anio_edicion=datos.anio_edicion,
            editorial_id=datos.editorial_id,
            formato_id=datos.formato_id,
            isbn=datos.isbn
        )
        for autores_id in datos.autor_id:
            autor = autor_respository.get_by_id(db,autores_id)
            nuevo_libro.autores.append(autor)

        for temas_id in datos.temas_id:
            tema = temas_repository.get_by_id(db,temas_id)
            nuevo_libro.temas.append(tema)

        db.add(nuevo_libro)
        db.commit()
        result = self.get_by_isbn(db,nuevo_libro.isbn)
        return result

    def get_by_isbn(self,db:Session,isbn:str) -> Libro:    
        if isbn.isnumeric() == False:
            return ValueError('El ISBN debe ser un número entre 11 y 13 digitos')
        result = db.execute(select(Libro).where(Libro.isbn == isbn)).scalar()
        return result

    def update_libro(self,db:Session,datos:LibroForUpdate,isbn:str) -> Libro:
        if isbn.isnumeric() == False:
            return ValueError('El ISBN debe ser un número entre 11 y 13 digitos')
        libro_buscado = db.execute(select(Libro).where(Libro.isbn == isbn)).scalar()
        print(f'Libro buscado en Controller = {libro_buscado}')
        if libro_buscado is None:
            return None
        else:
            libro_buscado.titulo = datos.titulo if datos.titulo is not None else libro_buscado.titulo
            libro_buscado.cant_hojas = datos.cant_hojas if datos.cant_hojas is not None else libro_buscado.cant_hojas
            libro_buscado.anio_edicion = datos.anio_edicion if datos.anio_edicion is not None else libro_buscado.anio_edicion 
            libro_buscado.editorial_id = datos.editorial_id if datos.editorial_id is not None else libro_buscado.editorial_id
            libro_buscado.formato_id = datos.formato_id if datos.formato_id is not None else libro_buscado.formato.id

        libro_buscado.autores.clear()
        for autores_id in datos.autor_id:
            autor = autor_respository.get_by_id(db,autores_id)
            libro_buscado.autores.append(autor)

        libro_buscado.temas.clear()
        for temas_id in datos.temas_id:
            tema = temas_repository.get_by_id(db,temas_id)
            libro_buscado.temas.append(tema)

        db.commit()
        return self.get_by_isbn(db,isbn)

    def delete_libro(self,isbn:str,db:Session) -> Libro:
        if isbn.isnumeric() == False:
            return ValueError('El ISBN debe ser un número entre 11 y 13 digitos')
        libro_buscado = self.get_by_isbn(db,isbn)
        if libro_buscado is None:
            return None
        else:
            db.delete(libro_buscado)
            db.commit()
            return libro_buscado

    def get_by_query(self,db:Session,titulo:str, editorial_id:str, tema_id:str) -> List[Libro]:

        # este objeto permite hacer consultas y va devolviendo objetos del mismo tipo para hacer otras
        result = db.query(Libro)

        if titulo is not None:
            # le agrego comodines para busqueda en el like
            titulo_format = f'%{titulo}%'
            result = result.filter(Libro.titulo.ilike(titulo_format))
        if editorial_id is not None:
            result = result.filter(Libro.editorial_id.in_(create_int_list(editorial_id)))
        if tema_id is not None:
            result = result.join(Libro.temas).filter(Libro.temas.any(Tema.tema_id.in_(create_int_list(tema_id))))

        # guardo los datos de las consultas
        query_result = result.all()

        list_for_ret = []
        # por cada row que me trajo el query armo los DTOS utilizando los ISBN que me trajo el QUERY
        for resultados in query_result:
            res = self.get_by_isbn(db,resultados.isbn)
            if res is not None:
                list_for_ret.append(res)
        return list_for_ret