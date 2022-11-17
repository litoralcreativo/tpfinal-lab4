from fastapi import APIRouter, Depends, HTTPException
from config.db import get_db
from sqlalchemy.orm import Session
from starlette import status
from repositories.autor_repository import AutorRepository
from schemas.autor_schemas import AutorDTO,AutorNoId,AutorForUpdate
from utils.creates import create_autor,create_list_autor
from typing import List

autor_router =  APIRouter(prefix='/autores',tags=['Autores'])
autor_repository = AutorRepository()


@autor_router.get('', response_model=list[AutorDTO])
def get_all(db:Session = Depends(get_db)):
    """
    Devuelve una lista completa de todos los autores con sus DNI
    """
    result = autor_repository.get_all(db)
    return create_list_autor(result)
    
@autor_router.get('/{id_autor}', response_model=AutorDTO)
def get_by_id(id_autor:int, db:Session = Depends(get_db)):
    result = autor_repository.get_by_id(db,id_autor)
    if result is None:
        raise HTTPException(status_code = 404, detail = 'No se encontró el autor')
    else:
        return create_autor(result)

@autor_router.post('',response_model=AutorDTO, status_code= status.HTTP_201_CREATED)
def new_autor(datos:AutorNoId, db:Session = Depends(get_db)):
    try:
        result = autor_repository.new_autor(db,datos)
        return create_autor(result)
    except:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail = 'No se pudo crear el Autor, revise los atributos')

    
@autor_router.put('/{id_autor}',response_model=AutorDTO)
def update_autor(datos:AutorForUpdate,id_autor:int,db:Session = Depends(get_db)):
    try:
        result: AutorDTO = autor_repository.update_autor(db,datos,id_autor)
        if result is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se encontró el autor')

        return create_autor(result)
    except HTTPException as exc:
        raise exc
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se logró modificar el autor, revise los atributos')

@autor_router.delete('/{id_autor}')
def delete_autor(id_autor:int,db:Session = Depends(get_db)):
    result = autor_repository.delete_autor(db,id_autor)
    if result is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se encontró el autor')
    return create_autor(result)