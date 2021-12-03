import { NextPage } from "next";
import { useEffect, useState } from "react";

type HeaderProps = {
    sair() : void
}

export const Header : NextPage<HeaderProps> = ({ sair}) => {

    const [name, setName] = useState('');

    useEffect(() => {
        if(typeof window !== 'undefined'){
            const userName = localStorage.getItem('userName');
            if(userName){
              const fullName = userName.split(' ');
              if(fullName && fullName.length > 0){
                setName(fullName[0]);
              }
            }
        }
      }, [])

    return (
        <div className="container-header">
            <img src="/logo.svg" alt="Logo Fiap" className="logo" />
            
            <div className="mobile">
                <span>Olá, {name}</span>
                <img  src="mobile/exit.svg" alt="Sair" onClick={sair}/>
            </div>
            <div className="desktop">                
                <span>Olá, {name}</span>                
                <img src="desktop/exit.svg" alt="Sair" onClick={sair}/>
            </div>
        </div>
    );
}