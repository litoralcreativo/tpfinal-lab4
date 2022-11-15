from config.db import BaseBd
from sqlalchemy import Column, Integer, String

class Formato(BaseBd):
    __tablename__ = 'formato'
    formato_id = Column(Integer, primary_key=True)
    nombre = Column(String(255), nullable=False)