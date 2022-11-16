from config.db import BaseBd
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Editorial(BaseBd):
    __tablename__ = 'editorial'
    editorial_id = Column(Integer, primary_key=True)
    nombre = Column(String(255), nullable=False)
    direccion = Column(String(255))
    url = Column(String(255))
    relationship("Libro")#cascade('all,delete')
