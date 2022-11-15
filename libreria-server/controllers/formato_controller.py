from sqlalchemy.orm import Session
from sqlalchemy import select,desc
from models.formato_model import Formato
from schemas.formato_schemas import FormatoNoId

class FormatoController:
    def get_all(self,db:Session):
        return db.execute(select(Formato).order_by(Formato.formato_id)).scalars().all()

    def get_by_id(self,db:Session, id:int):
        result = db.execute(select(Formato).where(Formato.formato_id == id)).scalar()
        return result

    def new_formato(self, db:Session, datos:FormatoNoId):
        nuevo_formato: Formato = Formato(**datos.dict())
        db.add(nuevo_formato)
        db.commit()
        return db.execute(select(Formato).order_by(desc(Formato.formato_id))).scalars().first()

    def update_formato(self,db:Session,datos:FormatoNoId,id:int):
        formato = self.get_by_id(db,id)
        if formato is None:
            return None
        else:
            formato.nombre = datos.nombre if datos.nombre is not None else formato.nombre
            db.commit()
        return formato

    def delete_formato(self,db:Session,id:int):
        formato = self.get_by_id(db,id)
        if formato is None:
            return None
        db.delete(formato)
        db.commit()
        return formato