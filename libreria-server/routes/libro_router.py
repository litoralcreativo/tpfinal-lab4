from fastapi import APIRouter, Depends, HTTPException
from config.db import get_db
from sqlalchemy.orm import Session
from starlette import status
from controllers.libro_controller import LibroController
from schemas.libro_schemas import LibroDTO,LibroBase

libro_router =  APIRouter(prefix='/libros',tags=['Libros'])
libro_controller = LibroController()

@libro_router.get('',response_model=LibroBase)
def get_all(db:Session = Depends(get_db)):
    try:
        result = libro_controller.get_all(db)
        return result
    except:
        return HTTPException(status_code= status.HTTP_412_PRECONDITION_FAILED, detail="Sin existencias")

@libro_router.post('',response_model=LibroBase)
def new_libro(datos:LibroBase,db:Session = Depends(get_db)):
    try:
        result = libro_controller.new_libro(db,datos)
        return result
    except:
        raise HTTPException(status_code= status.HTTP_400_BAD_REQUEST, detail= 'Error al crear el libro, revise los datos')