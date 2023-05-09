import { http } from "../http-common"

class RegistrosService{

    public async getRegistros(){
        const response = await http.get<any[]>("/registros");
        return response;
    }

    public async crearRegistros(){
        const response = await http.post<any>("/registros");
        return response;
    }

}
export default new RegistrosService();