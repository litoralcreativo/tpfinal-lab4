from fastapi import APIRouter, Depends, HTTPException
from config.db import get_db
from sqlalchemy.orm import Session
from starlette import status
from repositories.tema_repository import TemaRepository
from schemas.tema_schemas import TemaDTO,TemaNoId,TemaForUpdate
from utils.creates import create_tema,create_list_tema

tema_router =  APIRouter(prefix='/temas',tags=['Temas'])
tema_repository = TemaRepository()

@tema_router.get('', response_model=list[TemaDTO])
def get_all(db:Session = Depends(get_db)):
    """
    Devuelve una lista completa de todos los temas con sus Ids
    """
    result = tema_repository.get_all(db)
    return create_list_tema(result)
    
@tema_router.get('/{id}', response_model=TemaDTO)
def get_by_id(id:int, db:Session = Depends(get_db)):
    result = tema_repository.get_by_id(db,id)
    if result is None:
        raise HTTPException(status_code = 404, detail = 'No se encontróel tema')
    else:
        return create_tema(result)

@tema_router.post('',response_model=TemaDTO, status_code= status.HTTP_201_CREATED)
def new_tema(datos:TemaNoId, db:Session = Depends(get_db)):
    try:
        result = tema_repository.new_tema(db,datos)
        return create_tema(result)
    except:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail = 'No se pudo crear el tema nuevo, revise los atributos')

    
@tema_router.put('/{id}',response_model=TemaDTO)
def update_tema(datos:TemaForUpdate,id:int,db:Session = Depends(get_db)):
    try:
        result = tema_repository.update_tema(db,datos,id)
        if result is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se encontró el tema')

        return create_tema(result)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se logró modificar el tema, revise los atributos')

@tema_router.delete('/{id}')
def delete_tema(id:int,db:Session = Depends(get_db)):
    result = tema_repository.delete_tema(db,id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se encontró el tema')
    
    return create_tema(result)