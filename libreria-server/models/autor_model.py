from config.db import BaseBd
from sqlalchemy import Column, Integer, String

class Autor(BaseBd):
    __tablename__ = 'autor'
    dni = Column(Integer, primary_key=True, autoincrement=False)
    nombre = Column(String(255), nullable=False)
    apellido = Column(String(255))