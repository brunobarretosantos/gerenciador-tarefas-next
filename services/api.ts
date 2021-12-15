import axios, {Method} from "axios";

export const executeRequest = async (endpoint: string, method: Method, body? : any) => {
    const headers = { 'Content-type' : 'application/json' } as any;

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken){
        headers['authorization'] = 'Bearer ' + accessToken;
    }

    console.log(accessToken);

    const URL = 'http://localhost:3000/api/' + endpoint;

    console.log(`executantdo: ${URL}, metodo: ${method}, body: ${body}, header: ${headers}`);

    return axios.request({
        url: URL,
        method,
        data: body? body : '',
        headers,
        timeout: 30000
    })
}