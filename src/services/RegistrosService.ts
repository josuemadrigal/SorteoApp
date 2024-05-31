import { http } from "../http-common";
import { AxiosResponse } from "axios";

interface Registro {
  nombre: string;
  boleta: string;
  cedula: string;
}

interface Ronda {
  id: number;
  municipio: string;
  premio: string;
  cantidad: string;
  ronda: string;
  status: string;
}

interface Cedula {
  cedula: string;
  nombre: string;
}

interface GetRegistrosResponse {
  registros: Registro[];
}

interface GetRondaResponse {
  ronda: Ronda[];
}

interface GetCedulaResponse {
  ok: boolean;
  registro: Cedula;
}

interface CheckParticipandoResponse {
  ok: boolean;
  participando: boolean;
}

// interface Premio {
//   cedula: string;
//   nombre: string;
// }

// interface GetPremioResponse {
//   ok: boolean;
//   premio: Premio;
// }

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

  public async getRegistrosGanadores(
    municipio: string,
    ronda: string,
    premio: string
  ): Promise<AxiosResponse<GetRegistrosResponse>> {
    const jsonPar: any = { municipio, ronda, premio };
    const params = new URLSearchParams(jsonPar);
    const response = await http.get<GetRegistrosResponse>(
      `/registros/getGanadores?${params}`
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

  public async checkParticipando(
    cedula: string
  ): Promise<AxiosResponse<CheckParticipandoResponse>> {
    const jsonPar: any = { cedula };
    const params = new URLSearchParams(jsonPar);
    const response = await http.get<CheckParticipandoResponse>(
      `/registros/getParticipando?${params}`
    );
    return response;
  }

  public async getResponsables(): Promise<AxiosResponse<any[]>> {
    const response = await http.get<any[]>("/registros/all");
    return response;
  }

  public async getPremios(): Promise<
    AxiosResponse<{ ok: boolean; premios: any[] }>
  > {
    const response = await http.get<{ ok: boolean; premios: any[] }>(
      "/registros/getPremios"
    );
    return response;
  }
  public async crearRegistros(param: any): Promise<AxiosResponse<any>> {
    const response = await http.post<any>("/registros", param);
    return response;
  }

  public async crearTemporal(param: any): Promise<AxiosResponse<any>> {
    const response = await http.post<any>("/registros/temporal", param);
    return response;
  }

  public async regPremio(param: any): Promise<AxiosResponse<any>> {
    const response = await http.post<any>("/registros/regPremio", param);

    return response;
  }

  public async regCedula(param: any): Promise<AxiosResponse<any>> {
    const response = await http.post<any>("/registros/regCedula", param);
    console.log("param: ", param);
    console.log(response);
    return response;
  }

  async startUpdate(
    cedula: any,
    status: number,
    premio: string,
    ronda: string
  ): Promise<AxiosResponse<any>> {
    return await http.put(`registros/` + cedula, { status, premio, ronda });
  }

  public async regRonda(param: any): Promise<AxiosResponse<any>> {
    const response = await http.post<any>("/registros/regRonda", param);

    return response;
  }

  public async getRonda(
    municipio: string,
    premio: string
  ): Promise<AxiosResponse<GetRondaResponse>> {
    const jsonPar: any = { municipio, premio };
    const params = new URLSearchParams(jsonPar);
    const response = await http.get<GetRondaResponse>(
      `/registros/getRonda?${params}`
    );
    return response;
  }

  public async getRondaNum(
    municipio: string,
    premio: string
  ): Promise<AxiosResponse<GetRondaResponse>> {
    const jsonPar: any = { municipio, premio };
    const params = new URLSearchParams(jsonPar);
    const response = await http.get<GetRondaResponse>(
      `/registros/getRondaNum?${params}`
    );
    return response;
  }

  async updateRonda(
    id: number,
    estado: string,
    municipio: string,
    ronda: string,
    premio: string
  ): Promise<AxiosResponse<any>> {
    return await http.put(`registros/updateRonda/` + id, {
      estado,
      municipio,
      ronda,
      premio,
    });
  }
}

export default new RegistrosService();
