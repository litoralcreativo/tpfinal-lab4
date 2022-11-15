import axios from "axios";
import { from, Observable, of } from "rxjs";
import { Editorial, EditorialDTO } from "../Models/Editorial.model";

const editoriales: Editorial[] = [
  {
    id: 1,
    nombre: "Atlantida",
    url: "https://atlantida.com.ar/",
    direccion: "Elcano 3847, CABA",
  },
  {
    id: 2,
    nombre: "AZ",
    url: "http://az.com.ar/",
    direccion: "Montenegro 1335, CABA",
  },
];

class EditorialService {
  constructor() {}

  static getEditoriales = (): Observable<Editorial[]> => {
    return of(editoriales);
    // return axios.get("http://localhost:8080/api/autos");
  };
  static getEditorialIndividual = (
    id: number
  ): Observable<Editorial | undefined> => {
    return of(editoriales.find((x) => x.id == id));
    // return axios.get(`http://localhost:8080/api/autos/${id}`);
  };
  static updateEditorialIndividual = (
    id: number,
    newValue: Editorial
  ): Observable<Editorial | undefined> => {
    let toEdit = editoriales.find((x) => x.id == id);
    if (toEdit) {
      toEdit.nombre = newValue.nombre;
      toEdit.url = newValue.url;
      toEdit.direccion = newValue.direccion;
    }
    return of(toEdit);
    // return axios.put(`http://localhost:8080/api/autos/${id}`, newValue);
  };
  static altaEditorialIndividual = (
    newValue: Editorial
  ): Observable<Editorial> => {
    let newPushed = editoriales.push({
      ...newValue,
      id: Math.max(...editoriales.map((x) => x.id)) + 1,
    });
    return of(editoriales[newPushed]);
    // return axios.put(`http://localhost:8080/api/autos/${id}`, newValue);
  };
  static bajaEditorialIndividual = (id: number): Observable<Editorial[]> => {
    editoriales.splice(
      editoriales.findIndex((x) => x.id == id),
      1
    );
    return of(editoriales);
    // return axios.delete(`http://localhost:8080/api/autos/${id}`);
  };
}

export default EditorialService;
