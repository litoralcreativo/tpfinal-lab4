from sqlalchemy.orm import Session
from sqlalchemy import select,desc
from models.editorial_model import Editorial
from schemas.editorial_schemas import EditorialNoId, EditorialForUpdate,EditorialDTO
from typing import List

class EditorialRepository:
    
    def get_all(self,db:Session) -> List[Editorial]:
        result = db.execute(select(Editorial).order_by(Editorial.editorial_id)).scalars().all()
        return result

    def get_by_id(self,db:Session, id:int) -> Editorial:
        result = db.execute(select(Editorial).where(Editorial.editorial_id == id)).scalar()
        return result

    def new_editorial(self, db:Session, datos:EditorialNoId) -> Editorial:
        nueva_editorial: Editorial = Editorial(**datos.dict())
        db.add(nueva_editorial)
        db.commit()
        result =  db.execute(select(Editorial).order_by(desc(Editorial.editorial_id))).scalars().first()
        return result

    def update_editorial(self,db:Session,datos:EditorialForUpdate,id:int) -> Editorial:
        editorial = self.get_by_id(db,id)
        if editorial is None:
            return None
        else:
            editorial.direccion = datos.direccion if datos.direccion is not None else editorial.direccion
            editorial.nombre = datos.nombre if datos.nombre is not None else editorial.nombre
            editorial.url = datos.url if datos.url is not None else editorial.url
            db.commit()
        return editorial

    def delete_editorial(self,db:Session,id:int) -> Editorial:
        editorial = self.get_by_id(db,id)
        if editorial is None:
            return None
        db.delete(editorial)
        db.commit()
        return editorial
        