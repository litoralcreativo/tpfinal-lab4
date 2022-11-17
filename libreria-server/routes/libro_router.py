from fastapi import APIRouter, Depends, HTTPException,Response
from config.db import get_db
from sqlalchemy.orm import Session
from starlette import status
from controllers.libro_controller import LibroController
from schemas.libro_schemas import LibroDTO,LibroBase,LibroForUpdate

libro_router =  APIRouter(prefix='/libros',tags=['Libros'])
libro_controller = LibroController()

@libro_router.get('',response_model=list[LibroDTO])
def get_all(db:Session = Depends(get_db)):
    try:
        result = libro_controller.get_all(db)
        libros_list = []
        for libro in result:
            libroDTO: LibroDTO = LibroDTO(
                isbn = libro.isbn,
                anio_edicion = libro.anio_edicion,
                titulo = libro.titulo,
                cant_hojas = libro.cant_hojas,
                editorial_id = libro.editorial_id,
                formato_id = libro.formato_id,
                temas = libro.temas,
                autores = libro.autores
            )

            libros_list.append(libroDTO)

        return libros_list
    except Exception as e:
        print(e)
        return HTTPException(status_code= status.HTTP_412_PRECONDITION_FAILED, detail="Sin existencias")

@libro_router.post('',response_model=LibroDTO)
def new_libro(datos:LibroBase,db:Session = Depends(get_db)):
    try:
        result = libro_controller.new_libro(db,datos)
        print(result)
        return result
    except Exception as e:
        exception_msg = f'Type: {type(e)}. Args: {e.args}. {e}'
        print(exception_msg)
        raise HTTPException(status_code= status.HTTP_400_BAD_REQUEST, detail= f'Error al crear el libro, revise los datos. {exception_msg}')

@libro_router.get('/{isbn}',response_model=LibroDTO)
def get_by_isbn(isbn:int,db:Session = Depends(get_db)):
        result = libro_controller.get_by_isbn(db,isbn)
        if result is None:
            raise HTTPException(status_code= status.HTTP_404_NOT_FOUND, detail='No se pudo encontrar el Libro')
        else:
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

@libro_router.put('/{isbn}',response_model=LibroDTO)
def update_libro(isbn:int,datos:LibroForUpdate,db:Session = Depends(get_db)):
    try:
        result = libro_controller.update_libro(db,datos,isbn)
        if result is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='No se encontró el libro')
        else:
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
    except HTTPException as exc:
        raise exc
    except Exception as e:
        exception_msg = f'Type: {type(e)}. Args: {e.args}. {e}'
        raise HTTPException(status_code=status.HTTP_304_NOT_MODIFIED,detail=f'Hubo un error al intentar modificar el libro. {exception_msg}')

@libro_router.delete('/{isbn}',response_model=LibroDTO)
def delete_libro(isbn:int,db:Session = Depends(get_db)):
    try:
        libro_borrado = libro_controller.delete_libro(isbn,db)
        if libro_borrado is None:
            raise HTTPException(status_code= status.HTTP_404_NOT_FOUND, detail= 'No se encontró el libro buscado') 
        else:
            return Response(content= f'El libro con isbn = {isbn} fue borrado satisfactoriamente',status_code=status.HTTP_204_NO_CONTENT)
    except HTTPException as exc:
        raise exc
    except Exception as ex:
        exception_msg = f'Type: {type(ex)}. Args: {ex.args}. {ex}'
        raise HTTPException(status_code= status.HTTP_304_NOT_MODIFIED, detail= f'Hubo un error al intentar borrar el libro {exception_msg}')

@libro_router.get('/query/',response_model=list[LibroDTO])
def get_by_query(editorial_id:int = None, titulo:str = None, tema_id:int = None, db:Session = Depends(get_db)):
    print(f'Titulo = {titulo}; Editorial = {editorial_id}; Tema = {tema_id}')
    result = libro_controller.get_by_query(db,titulo,editorial_id,tema_id)
    return result