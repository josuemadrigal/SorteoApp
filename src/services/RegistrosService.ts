import { http } from "../http-common";
import { AxiosResponse } from "axios";

interface Registro {
  nombre: string;
  boleta: string;
}

interface Cedula {
  cedula: string;
  nombre: string;
}

interface GetRegistrosResponse {
  registros: Registro[];
}

interface GetCedulaResponse {
  ok: boolean;
  registro: Cedula;
}

class RegistrosService {
  public async getRegistros(
    status: number,
    municipio: string,
    cantidad: number
  ): Promise<AxiosResponse<GetRegistrosResponse>> {
    const jsonPar: any = { status, municipio, cantidad };
    const params = new URLSearchParams(jsonPar);
    const response = await http.get<GetRegistrosResponse>(
      `/registros?${params}`
    );
    return response;
  }

  public async getCedula(
    cedula: string
  ): Promise<AxiosResponse<GetCedulaResponse>> {
    const jsonPar: any = { cedula };
    const params = new URLSearchParams(jsonPar);
    const response = await http.get<GetCedulaResponse>(
      `/registros/cedula?${params}`
    );
    return response;
  }

  public async getResponsables(): Promise<AxiosResponse<any[]>> {
    const response = await http.get<any[]>("/registros/all");
    return response;
  }

  public async crearRegistros(param: any): Promise<AxiosResponse<any>> {
    console.log("servicio: ", param);
    const response = await http.post<any>("/registros", param);
    console.log("servicio2");
    console.log(response);
    return response;
  }

  public async regPremio(param: any): Promise<AxiosResponse<any>> {
    const response = await http.post<any>("/registros/regPremio", param);
    console.log("param: ", param);
    console.log(response);
    return response;
  }

  public async regCedula(param: any): Promise<AxiosResponse<any>> {
    const response = await http.post<any>("/registros/regCedula", param);
    console.log("param: ", param);
    console.log(response);
    return response;
  }

  async startUpdate(
    boleta: any,
    status: number,
    premio: string
  ): Promise<AxiosResponse<any>> {
    return await http.put(`registros/` + boleta, { status, premio });
  }
}

export default new RegistrosService();
