import axios from "axios";
import { from, map, Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { CRUD } from "../Models/Crud.model";
import { MonitorData } from "../Models/MonitorData.model";
import { Tema } from "../Models/Tema.model";

export default class MonitorService {
  CONTROLLER: string = "monitor";

  getCounts = (): Observable<MonitorData> => {
    return ajax
      .get<MonitorData>(`http://localhost:8000/${this.CONTROLLER}/count`)
      .pipe(map((x) => x.response));
  };
}
