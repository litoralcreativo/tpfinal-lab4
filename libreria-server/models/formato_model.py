from config.db import BaseBd
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Formato(BaseBd):
    __tablename__ = 'formato'
    formato_id = Column(Integer, primary_key=True)
    nombre = Column(String(255), nullable=False)
    relationship('Libro')#cascade('all,delete')

    def __repr__(self) -> str:
        return f'<Formato> ID: {self.formato_id}; Nombre: {self.nombre}'