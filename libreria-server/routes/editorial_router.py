from fastapi import APIRouter, Depends, HTTPException
from config.db import get_db
from sqlalchemy.orm import Session
from controllers.editorial_controller import EditorialController
from schemas.editorial_schemas import EditorialDTO, EditorialNoId
from starlette import status

editorial_router =  APIRouter(prefix='/editoriales',tags=['Editoriales'])
editorial_controller = EditorialController()

@editorial_router.get('', response_model=list[EditorialDTO])
def get_all(db:Session = Depends(get_db)):
    """
    Devuelve una lista completa de todas las editoriales con sus IDs
    """
    result = editorial_controller.get_all(db)
    return result
    
@editorial_router.get('/{id}', response_model=EditorialDTO)
def get_by_id(id:int, db:Session = Depends(get_db)):
    result = editorial_controller.get_by_id(db,id)
    if result is None:
        raise HTTPException(status_code = 404, detail = 'No se encontró la editorial')
    else:
        return result

@editorial_router.post('',response_model=EditorialDTO, status_code= status.HTTP_201_CREATED)
def new_editorial(datos:EditorialNoId, db:Session = Depends(get_db)):
    try:
        result: EditorialDTO = editorial_controller.new_editorial(db,datos)
        return result
    except:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail = 'No se pudo crear la editorial, revise los atributos')

    
@editorial_router.put('/{id}',response_model=EditorialDTO)
def update_editorial(datos:EditorialNoId,id:int,db:Session = Depends(get_db)):
    try:
        result: EditorialDTO = editorial_controller.update_editorial(db,datos,id)
        if result is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se encontró la editorial')

        return result
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se logró modificar la editorial, revise los atributos')

@editorial_router.delete('/{id}')
def delete_editorial(id:int,db:Session = Depends(get_db)):
    result = editorial_controller.delete_editorial(db,id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se encontró la editorial')
    
    return result