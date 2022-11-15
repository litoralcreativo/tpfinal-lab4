from fastapi import APIRouter, Depends, HTTPException
from config.db import get_db
from sqlalchemy.orm import Session
from starlette import status
from controllers.tema_controller import TemaController
from schemas.tema_schemas import TemaDTO,TemaNoId

tema_router =  APIRouter(prefix='/temas',tags=['Temas'])
tema_controller = TemaController()

@tema_router.get('', response_model=list[TemaDTO])
def get_all(db:Session = Depends(get_db)):
    """
    Devuelve una lista completa de todos los temas con sus Ids
    """
    result = tema_controller.get_all(db)
    return result
    
@tema_router.get('/{id}', response_model=TemaDTO)
def get_by_id(id:int, db:Session = Depends(get_db)):
    result = tema_controller.get_by_id(db,id)
    if result is None:
        raise HTTPException(status_code = 404, detail = 'No se encontróel tema')
    else:
        return result

@tema_router.post('',response_model=TemaDTO, status_code= status.HTTP_201_CREATED)
def new_tema(datos:TemaNoId, db:Session = Depends(get_db)):
    try:
        result: TemaDTO = tema_controller.new_tema(db,datos)
        return result
    except:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail = 'No se pudo crear el tema nuevo, revise los atributos')

    
@tema_router.put('/{id}',response_model=TemaDTO)
def update_tema(datos:TemaNoId,id:int,db:Session = Depends(get_db)):
    try:
        result: TemaDTO = tema_controller.update_tema(db,datos,id)
        if result is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se encontró el tema')

        return result
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se logró modificar el tema, revise los atributos')

@tema_router.delete('/{id}')
def delete_tema(id:int,db:Session = Depends(get_db)):
    result = tema_controller.delete_tema(db,id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se encontró el tema')
    
    return result