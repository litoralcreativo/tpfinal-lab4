from config.db import BaseBd
from sqlalchemy import Column,Integer,String,Date,func,ForeignKey,Table
from sqlalchemy.orm import relationship
from datetime import datetime

tema_libro = Table(
    "temas_libros",
    BaseBd.metadata,
    Column("tema_id", ForeignKey("tema.tema_id"), primary_key=True),
    Column("libro_isbn", ForeignKey("libro.isbn"), primary_key=True)
    )

class Libro(BaseBd):
    __tablename__ = "libro"
    isbn = Column(Integer,primary_key=True,autoincrement=False)
    titulo = Column(String(255),nullable=False)
    cant_hojas = Column(Integer,default=0)
    anio_edicion = Column(Date,default=datetime.now())
    editorial_id = Column(Integer,ForeignKey("editorial.editorial_id",onupdate="CASCADE"))
    formato_id = Column(Integer,ForeignKey("formato.formato_id",onupdate="CASCADE"))
    autor_dni = Column(Integer,ForeignKey("autor.dni",onupdate="CASCADE"))
    temas_id = Column(Integer,ForeignKey("tema.tema_id",onupdate="CASCADE"))
    temas = relationship("Tema",secondary=tema_libro)

