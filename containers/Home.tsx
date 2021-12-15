import { NextPage } from "next"
import { Filter } from "../components/Filter"
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { useEffect, useState } from "react";
import { List } from "../components/List";
import { executeRequest } from "../services/api";

type HomeProps = {
    setToken(s: string) : void
}

export const Home : NextPage<HomeProps> = ({setToken}) => {

    const [previsionDateStart, setPrevisionDateStart] = useState('');
    const [previsionDateEnd, setPrevisionDateEnd] = useState('');
    const [status, setStatus] = useState('0');
    const [tasks, setTasks] = useState([]);

    const sair = () => {
        localStorage.clear();
        setToken('');
    }

    const getFilteredList = async () => {
        try {
            let filter = '?status=' + status;
            
            if (previsionDateStart){
                filter += "&previsionDateStart=" + previsionDateStart;
            }

            if (previsionDateEnd){
                filter += "&previsionDateEnd=" + previsionDateEnd;
            }

            const result = await executeRequest('tasks' + filter, 'GET');

            if (result?.data){
                setTasks(result.data);
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getFilteredList();
    }, [status, previsionDateStart, previsionDateEnd]);

    return(
        <>
            <Header sair={sair}/>
            <Filter 
                previsionDateStart = {previsionDateStart}
                previsionDateEnd = {previsionDateEnd}
                status = {status}
                setPrevisionDateStart = {setPrevisionDateStart}
                setPrevisionDateEnd = {setPrevisionDateEnd}
                setStatus = {setStatus}                       
            />
            <List tasks={tasks} />
            <Footer />
        </>
    )
}