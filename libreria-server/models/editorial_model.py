from config.db import BaseBd
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Editorial(BaseBd):
    __tablename__ = 'editorial'
    editorial_id = Column(Integer, primary_key=True)
    nombre = Column(String(255), nullable=False)
    direccion = Column(String(255),nullable=False)
    url = Column(String(255))
    relationship("Libro")

    def __repr__(self) -> str:
        return f'<Editorial> ID:{self.editorial_id}; Nombre: {self.nombre}; Direccion: {self.direccion}; URL: {self.url}'
