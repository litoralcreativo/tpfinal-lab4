from typing import List
from fastapi import APIRouter, Depends, HTTPException,Path
from config.db import get_db
from sqlalchemy.orm import Session
from starlette import status
from repositories.libro_repository import LibroRepository
from schemas.libro_schemas import LibroDTO,LibroBase,LibroForUpdate
from typing import List
from utils.creates import create_libro,create_list_libro

libro_router =  APIRouter(prefix='/libros',tags=['Libros'])
libro_repository = LibroRepository()

@libro_router.get('',response_model=list[LibroDTO])
def get_all(db:Session = Depends(get_db)) -> List[LibroDTO]:
    try:
        result = libro_repository.get_all(db)
        return create_list_libro(result,db)
    except Exception as e:
        print(e)
        return HTTPException(status_code= status.HTTP_412_PRECONDITION_FAILED, detail="Sin existencias")

@libro_router.post('',response_model=LibroDTO)
def new_libro(datos:LibroBase,db:Session = Depends(get_db)) -> LibroDTO:
    try:
        result = libro_repository.new_libro(db,datos)
        return create_libro(result,db)
    except Exception as e:
        exception_msg = f'Type: {type(e)}. Args: {e.args}. {e}'
        print(exception_msg)
        raise HTTPException(status_code= status.HTTP_400_BAD_REQUEST, detail= f'Error al crear el libro, revise los datos. {exception_msg}')

@libro_router.get('/{isbn}',response_model=LibroDTO)
def get_by_isbn(isbn:str = Path(min_length=11,max_length=13),db:Session = Depends(get_db)) -> LibroDTO:
        result = libro_repository.get_by_isbn(db,isbn)
        if result is None:
            raise HTTPException(status_code= status.HTTP_404_NOT_FOUND, detail='No se pudo encontrar el Libro')
        else:
            return create_libro(result,db)

@libro_router.put('/{isbn}',response_model=LibroDTO)
def update_libro( datos:LibroForUpdate, isbn:str = Path(min_length=11,max_length=13),db:Session = Depends(get_db)):
    try:
        result = libro_repository.update_libro(db,datos,isbn)
        if result is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='No se encontró el libro')
        else:
            return create_libro(result,db)
    except HTTPException as exc:
        raise exc
    except Exception as e:
        exception_msg = f'Type: {type(e)}. Args: {e.args}. {e}'
        print(exception_msg)
        raise HTTPException(status_code=status.HTTP_304_NOT_MODIFIED, detail= f'Hubo un error al intentar modificar el libro. {exception_msg}')

@libro_router.delete('/{isbn}',response_model=LibroDTO)
def delete_libro(isbn:str = Path(min_length=11,max_length=13),db:Session = Depends(get_db)) -> LibroDTO:
    try:
        libro_borrado = libro_repository.delete_libro(isbn,db)
        if libro_borrado is None:
            raise HTTPException(status_code= status.HTTP_404_NOT_FOUND, detail= 'No se encontró el libro buscado') 
        else:
            return create_libro(libro_borrado,db)
    except HTTPException as exc:
        raise exc
    except Exception as ex:
        exception_msg = f'Type: {type(ex)}. Args: {ex.args}. {ex}'
        raise HTTPException(status_code= status.HTTP_304_NOT_MODIFIED, detail= f'Hubo un error al intentar borrar el libro {exception_msg}')

@libro_router.get('/query/',response_model=list[LibroDTO])
def get_by_query(editorial_id:str = None, titulo:str = None, tema_id:str = None, db:Session = Depends(get_db)) -> List[LibroDTO]:
    try:
        result = libro_repository.get_by_query(db,titulo,editorial_id,tema_id)
        return create_list_libro(result,db)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'Se dio el siguiente error: {exc}')