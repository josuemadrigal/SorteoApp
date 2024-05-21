import { http } from "../http-common";

class RegistrosService {
  public async getRegistros(
    status: number,
    municipio: string,
    cantidad: number
  ) {
    const jsonPar: any = { status: status, municipio: municipio, cantidad };
    const params = new URLSearchParams(jsonPar);
    const response = await http.get<any[]>(`/registros?${params}`);
    return response;
  }

  public async getResponsables() {
    const response = await http.get<any[]>("/registros/all");
    return response;
  }

  public async crearRegistros(param: any) {
    console.log("servicio: ", param);
    const response = await http.post<any>("/registros", param);
    console.log("servicio2");
    console.log(response);
    return response;
  }

  public async regPremio(param: any) {
    const response = await http.post<any>("/registros/regPremio", param);
    console.log("param: ", param);
    console.log(response);
    return response;
  }

  async startUpdate(boleta: any, status: number, premio: string) {
    return await http.put(`registros/` + boleta, { status, premio });
  }
}
export default new RegistrosService();
