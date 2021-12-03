import { NextPage } from "next";
import { useState } from "react";
import { executeRequest } from "../services/api";
import { LoginRequest } from "../types/LoginRequest";
import { LoginResponse } from "../types/LoginResponse";

type LoginProps = {
    setToken(s: string) : void
}

export const Login : NextPage<LoginProps> = ({setToken}) => {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const doLogin = async () => {
        try {
            if (!login || !password){
                setErrorMsg('Email and password are required');
                return;
            }

            setErrorMsg('');

            const body = {
                login,
                password
            } as LoginRequest;

            const result = await executeRequest('login', 'POST', body);

            if(result && result.data){
                const loginResponse = result.data as LoginResponse;
                localStorage.setItem('accessToken', loginResponse.token);
                localStorage.setItem('userName', loginResponse.name);
                localStorage.setItem('userEmail', loginResponse.email);
                setToken(loginResponse.token);
            }
        } catch (e : any) {
            if(e?.response?.data?.error){
                console.log(e?.response);
                setErrorMsg(e?.response?.data?.error);
                return;
            }
            console.log(e);
            setErrorMsg('Internal Server Error');
        }
    }

    return(
        <div className="container-login">
            <img src="logo.svg" alt="Logo Fiap" className="logo" />            
            <div className="form">
                {errorMsg && <p>{errorMsg}</p>}
                <div className="input">
                    <img src="mail.svg"/>
                    <input type="text" placeholder="Informe seu email" 
                        value={login} onChange={evento => setLogin(evento.target.value)} />
                </div>
                <div className="input">
                    <img src="lock.svg"/>
                    <input type="password" placeholder="Informe sua senha" 
                        value={password} onChange={evento => setPassword(evento.target.value)} />
                </div>
                <button onClick={doLogin}>Login</button>
            </div>
        </div>
    )
}