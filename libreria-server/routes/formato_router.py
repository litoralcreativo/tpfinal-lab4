from fastapi import APIRouter, Depends, HTTPException
from config.db import get_db
from sqlalchemy.orm import Session
from starlette import status
from controllers.formato_controller import FormatoController
from schemas.formato_schemas import FormatoDTO,FormatoNoId,FormatoForUpdate

formato_router =  APIRouter(prefix='/formatos',tags=['Formatos'])
formato_controller = FormatoController()


@formato_router.get('', response_model=list[FormatoDTO])
def get_all(db:Session = Depends(get_db)):
    """
    Devuelve una lista completa de todos los formatos con sus ids
    """
    result = formato_controller.get_all(db)
    return result
    
@formato_router.get('/{id}', response_model=FormatoDTO)
def get_by_id(id:int, db:Session = Depends(get_db)):
    result = formato_controller.get_by_id(db,id)
    if result is None:
        raise HTTPException(status_code = 404, detail = 'No se encontróel formato')
    else:
        return result

@formato_router.post('',response_model=FormatoDTO, status_code= status.HTTP_201_CREATED)
def new_formato(datos:FormatoNoId, db:Session = Depends(get_db)):
    try:
        result: FormatoDTO = formato_controller.new_formato(db,datos)
        return result
    except:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail = 'No se pudo crear el formato, revise los atributos')

    
@formato_router.put('/{id}',response_model=FormatoDTO)
def update_formato(datos:FormatoForUpdate,id:int,db:Session = Depends(get_db)):
    try:
        result: FormatoDTO = formato_controller.update_formato(db,datos,id)
        if result is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se encontró el formato')

        return result
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se logró modificar el formato, revise los atributos')

@formato_router.delete('/{id}')
def delete_formato(id:int,db:Session = Depends(get_db)):
    result = formato_controller.delete_formato(db,id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se encontró el formato')
    
    return result