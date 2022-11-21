from sqlalchemy.orm import Session
from sqlalchemy import select,desc,func,Integer
from models.formato_model import Formato
from schemas.formato_schemas import FormatoNoId,FormatoForUpdate
from typing import List
from models.libro_model import Libro

class FormatoRepository:

    def get_all(self,db:Session) -> List[Formato]:
        return db.execute(select(Formato).order_by(Formato.formato_id)).scalars().all()

    def get_by_id(self,db:Session, id:int) -> Formato:
        result = db.execute(select(Formato).where(Formato.formato_id == id)).scalar()
        return result

    def get_count(self,db:Session) -> Integer:
        result = db.query(func.count(Formato.formato_id)).scalar()
        return result

    def new_formato(self, db:Session, datos:FormatoNoId) -> Formato:
        nuevo_formato: Formato = Formato(**datos.dict())
        db.add(nuevo_formato)
        db.commit()
        return db.execute(select(Formato).order_by(desc(Formato.formato_id))).scalars().first()

    def update_formato(self,db:Session,datos:FormatoForUpdate,id:int) -> Formato:
        formato = self.get_by_id(db,id)
        if formato is None:
            return None
        else:
            formato.nombre = datos.nombre if datos.nombre is not None else formato.nombre
            db.commit()
        return formato

    def delete_formato(self,db:Session,id:int) -> Formato:
        formato = self.get_by_id(db,id)
        if formato is None:
            return None
        db.delete(formato)
        db.commit()
        return formato

    def get_libros_by_id(self,db:Session,id:int) -> List[Libro]:
        result = db.execute(select(Libro).where(Libro.formato_id == id)).scalars().all()
        return result