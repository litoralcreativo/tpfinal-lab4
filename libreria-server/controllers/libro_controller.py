from sqlalchemy.orm import Session
from sqlalchemy import select,desc,join
from models.libro_model import Libro
from schemas.libro_schemas import LibroBase,LibroDTO

class LibroController:

    def get_all(self,db:Session):
        result = db.execute(select(Libro).order_by(Libro.isbn)).scalars().all()
        print(result[0].isbn)
        return result

    def new_libro(self,db:Session,datos:LibroBase):
        nuevo_libro: Libro = Libro(
            titulo=datos.titulo,
            cant_hojas=datos.cant_hojas,
            anio_edicion=None,
            editorial_id=datos.editorial_id,
            formato_id=datos.formato_id,
            isbn=datos.isbn,
            autor_dni=datos.autor_dni,
            temas_id=datos.temas_id
        )
        db.add(nuevo_libro)
        db.commit()
        result = db.execute(select(Libro).order_by(desc(Libro.isbn))).scalars().first()
        return result





