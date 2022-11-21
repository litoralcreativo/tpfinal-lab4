from fastapi import APIRouter, Depends, HTTPException
from config.db import get_db
from sqlalchemy.orm import Session
from starlette import status

from repositories.autor_repository import AutorRepository
from repositories.tema_repository import TemaRepository
from repositories.formato_repository import FormatoRepository
from repositories.editorial_repository import EditorialRepository
from repositories.libro_repository import LibroRepository

from schemas.monitor_schemas import Monitor
from utils.creates import create_autor,create_list_autor
from typing import List

monitor_router =  APIRouter(prefix='/monitor',tags=['Monitor'])

autor_repository = AutorRepository()
tema_repository = TemaRepository()
formato_repository = FormatoRepository()
editorial_repository = EditorialRepository()
libro_repository = LibroRepository()

@monitor_router.get('/count', response_model=Monitor)
def get_count(db:Session = Depends(get_db)):
    """
    Devuelve la cantidad de autores del sistema
    """
    result = Monitor(
      autores=autor_repository.get_count(db), 
      temas=tema_repository.get_count(db), 
      formatos=formato_repository.get_count(db), 
      editoriales=editorial_repository.get_count(db),
      libros=libro_repository.get_count(db)
    )
    return result