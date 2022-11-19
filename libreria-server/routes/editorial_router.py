from fastapi import APIRouter, Depends, HTTPException
from config.db import get_db
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from repositories.editorial_repository import EditorialRepository
from schemas.editorial_schemas import EditorialDTO, EditorialNoId, EditorialForUpdate
from schemas.libro_schemas import LibroDTO
from starlette import status
from utils.creates import create_editorial,create_list_editorial,create_list_libro
from typing import List

editorial_router =  APIRouter(prefix='/editoriales',tags=['Editoriales'])
editorial_repository = EditorialRepository()

@editorial_router.get('', response_model=list[EditorialDTO])
def get_all(db:Session = Depends(get_db)):
    """
    Devuelve una lista completa de todas las editoriales con sus IDs
    """
    result = editorial_repository.get_all(db)
    return create_list_editorial(result)
    
@editorial_router.get('/{id}', response_model=EditorialDTO)
def get_by_id(id:int, db:Session = Depends(get_db)):
    result = editorial_repository.get_by_id(db,id)
    if result is None:
        raise HTTPException(status_code = 404, detail = 'No se encontró la editorial')
    else:
        return create_editorial(result)

@editorial_router.post('',response_model=EditorialDTO, status_code= status.HTTP_201_CREATED)
def new_editorial(datos:EditorialNoId, db:Session = Depends(get_db)):
    try:
        result = editorial_repository.new_editorial(db,datos)
        return create_editorial(result)
    except Exception as e:
        exception_msg = f'Type: {type(e)}. Args: {e.args}. {e}'
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail = f'No se pudo crear la editorial, revise los atributos. {exception_msg}')

    
@editorial_router.put('/{id}',response_model=EditorialDTO)
def update_editorial(datos:EditorialForUpdate,id:int,db:Session = Depends(get_db)):
    try:
        result = editorial_repository.update_editorial(db,datos,id)
        if result is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se encontró la editorial')

        return create_editorial(result)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se logró modificar la editorial, revise los atributos')

@editorial_router.delete('/{id}')
def delete_editorial(id:int,db:Session = Depends(get_db)):
    try:
        result = editorial_repository.delete_editorial(db,id)
        if result is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se encontró la editorial')
    except IntegrityError:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,detail= "No se puede eliminar la editorial ya que esta asociada a otra tabla")
    
    return create_editorial(result)

@editorial_router.get('/{id}/libros',response_model=List[LibroDTO])
def get_libros_by_id(id:int,db:Session = Depends(get_db)):
    result = editorial_repository.get_libros_by_id(db,id)
    if result is None:
        return HTTPException(status_code= status.HTTP_204_NO_CONTENT,detail= 'No hay libros asociados')
    return create_list_libro(result,db)