from config.db import BaseBd
from sqlalchemy import Column, Integer, String

class Tema(BaseBd):
    __tablename__ = 'tema'
    tema_id = Column(Integer, primary_key=True)
    nombre = Column(String(255), nullable=False)