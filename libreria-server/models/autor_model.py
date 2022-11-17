from config.db import BaseBd
from sqlalchemy import Column, Integer, String

class Autor(BaseBd):
    """Modelo de Autores para ORM

    Nombre de la tabla = 'autor'

    Columnas:
        id_autor = Serial PK

        dni = Integer NOT NULL UNIQUE

        nombre = String NOT NULL
        
        apellido = String NOT NULL
    """
    __tablename__ = 'autor'
    id_autor = Column(Integer,primary_key=True)
    dni = Column(Integer, autoincrement=False,nullable=False)
    nombre = Column(String(255), nullable=False)
    apellido = Column(String(255), nullable=False)

    def __repr__(self) -> str:
        """
        toString() del modelo
        """
        return f'<Autor> Nombre: {self.nombre}; Apellido: {self.apellido}; DNI: {self.dni}; ID: {self.id_autor}'