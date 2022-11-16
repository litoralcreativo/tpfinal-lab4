from fastapi import APIRouter, Depends, HTTPException
from config.db import get_db
from sqlalchemy.orm import Session
from starlette import status
from controllers.autor_controller import AutorController
from schemas.autor_schemas import AutorDTO,AutorNoId,AutorForUpdate

autor_router =  APIRouter(prefix='/autores',tags=['Autores'])
autor_controller = AutorController()


@autor_router.get('', response_model=list[AutorDTO])
def get_all(db:Session = Depends(get_db)):
    """
    Devuelve una lista completa de todos los autores con sus DNI
    """
    result = autor_controller.get_all(db)
    return result
    
@autor_router.get('/{id_autor}', response_model=AutorDTO)
def get_by_id(id_autor:int, db:Session = Depends(get_db)):
    result = autor_controller.get_by_id(db,id_autor)
    if result is None:
        raise HTTPException(status_code = 404, detail = 'No se encontró el autor')
    else:
        return result

@autor_router.post('',response_model=AutorDTO, status_code= status.HTTP_201_CREATED)
def new_autor(datos:AutorDTO, db:Session = Depends(get_db)):
    try:
        result: AutorDTO = autor_controller.new_autor(db,datos)
        return result
    except:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail = 'No se pudo crear el Autor, revise los atributos')

    
@autor_router.put('/{dni}',response_model=AutorDTO)
def update_autor(datos:AutorForUpdate,id_autor:int,db:Session = Depends(get_db)):
    try:
        result: AutorDTO = autor_controller.update_autor(db,datos,id_autor)
        if result is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se encontró el autor')

        return result
    except HTTPException as exc:
        raise exc
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se logró modificar el autor, revise los atributos')

@autor_router.delete('/{id_autor}')
def delete_autor(id_autor:int,db:Session = Depends(get_db)):
    result = autor_controller.delete_autor(db,id_autor)
    if result is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail= 'No se encontró el autor')
    return result