from sqlalchemy.orm import Session
from sqlalchemy import select,desc,func,Integer
from models.tema_model import Tema
from schemas.tema_schemas import TemaNoId,TemaForUpdate,TemaDTO
from typing import List

# TODO Metodo para hacer TEMASDTO
class TemaRepository:
    def get_all(self,db:Session) -> List[Tema]:
        return db.execute(select(Tema).order_by(Tema.tema_id)).scalars().all()

    def get_by_id(self,db:Session, id:int) -> Tema:
        result = db.execute(select(Tema).where(Tema.tema_id == id)).scalar()
        return result

    def get_count(self,db:Session) -> Integer:
        result = db.query(func.count(Tema.tema_id)).scalar()
        return result

    def new_tema(self, db:Session, datos:TemaNoId) -> Tema:
        nuevo_tema: Tema = Tema(**datos.dict())
        db.add(nuevo_tema)
        db.commit()
        return db.execute(select(Tema).order_by(desc(Tema.tema_id))).scalars().first()

    def update_tema(self,db:Session,datos:TemaForUpdate,id:int) -> Tema:
        tema = self.get_by_id(db,id)
        if tema is None:
            return None
        else:
            tema.nombre = datos.nombre if datos.nombre is not None else tema.nombre
            db.commit()
        return tema

    def delete_tema(self,db:Session,id:int) -> Tema:
        tema = self.get_by_id(db,id)
        if tema is None:
            return None
        db.delete(tema)
        db.commit()
        return tema