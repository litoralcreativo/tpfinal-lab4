from config.db import BaseBd
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Editorial(BaseBd):
    """Modelo de Editoriales para el ORM

    Nombre de la tabla = 'editorial'

    Columnas:
        editorial_id = Integer PK

        nombre = String NOT NULL

        direccion = String NOT NULL

        url = String 
        
        relationship("Libro") = Indica la Relacion 1 -> N con Libros
    """
    __tablename__ = 'editorial'
    editorial_id = Column(Integer, primary_key=True)
    nombre = Column(String(255), nullable=False)
    direccion = Column(String(255),nullable=False)
    url = Column(String(255))
    relationship("Libro")

    def __repr__(self) -> str:
        """
        toString() del modelo
        """
        return f'<Editorial> ID:{self.editorial_id}; Nombre: {self.nombre}; Direccion: {self.direccion}; URL: {self.url}'
