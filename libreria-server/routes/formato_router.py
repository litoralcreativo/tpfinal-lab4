from fastapi import APIRouter, Depends, HTTPException
from config.db import get_db
from sqlalchemy.orm import Session
from starlette import status
from repositories.formato_repository import FormatoRepository
from schemas.formato_schemas import FormatoDTO,FormatoNoId,FormatoForUpdate
from schemas.libro_schemas import LibroDTO
from typing import List
from utils.creates import create_formato,create_list_formato,create_list_libro

formato_router =  APIRouter(prefix='/formatos',tags=['Formatos'])
formato_repository = FormatoRepository()


@formato_router.get('', response_model=list[FormatoDTO])
def get_all(db:Session = Depends(get_db)):
    """
    Devuelve una lista completa de todos los formatos con sus ids
    """
    result = formato_repository.get_all(db)
    return create_list_formato(result)
    
@formato_router.get('/{id}', response_model=FormatoDTO)
def get_by_id(id:int, db:Session = Depends(get_db)):
    result = formato_repository.get_by_id(db,id)
    if result is None:
        raise HTTPException(status_code = 404, detail = 'No se encontróel formato')
    else:
        return create_formato(result)

@formato_router.post('',response_model=FormatoDTO, status_code= status.HTTP_201_CREATED)
def new_formato(datos:FormatoNoId, db:Session = Depends(get_db)):
    try:
        result = formato_repository.new_formato(db,datos)
        return create_formato(result)
    except:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail = 'No se pudo crear el formato, revise los atributos')

    
@formato_router.put('/{id}',response_model=FormatoDTO)
def update_formato(datos:FormatoForUpdate,id:int,db:Session = Depends(get_db)):
    try:
        result = formato_repository.update_formato(db,datos,id)
        if result is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se encontró el formato')

        return create_formato(result)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se logró modificar el formato, revise los atributos')

@formato_router.delete('/{id}')
def delete_formato(id:int,db:Session = Depends(get_db)):
    result = formato_repository.delete_formato(db,id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se encontró el formato')
    
    return create_formato(result)

@formato_router.get('/{id}/libros',response_model=List[LibroDTO])
def get_libros_by_id(id:int,db:Session = Depends(get_db)):
    result = formato_repository.get_libros_by_id(db,id)
    if result is None:
        return HTTPException(status_code= status.HTTP_204_NO_CONTENT,detail= 'No hay libros asociados')
    return create_list_libro(result,db)