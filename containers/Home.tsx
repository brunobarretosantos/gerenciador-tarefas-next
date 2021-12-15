import { NextPage } from "next"
import { Filter } from "../components/Filter"
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { useEffect, useState } from "react";
import { List } from "../components/List";
import { executeRequest } from "../services/api";
import { Task } from "../types/Task";
import {CrudModal} from '../components/Modal';

type HomeProps = {
    setToken(s: string) : void
}

export const Home : NextPage<HomeProps> = ({setToken}) => {

    //state filter
    const [previsionDateStart, setPrevisionDateStart] = useState('');
    const [previsionDateEnd, setPrevisionDateEnd] = useState('');
    const [status, setStatus] = useState('0');
    const [tasks, setTasks] = useState([]);

    //state modal
    const[showModal, setShowModal] = useState(true);
    const[errorMsg, setErrorMsg] = useState('');
    const[name, setName] = useState('');
    const [previsionDate, setPrevisionDate] = useState('');
    

    const closeModal = () => {
        setShowModal(false);
        setName('');
        setPrevisionDate('');
        setErrorMsg('');
    }

    const doSave = async () => {
        try {
            if (!name || !previsionDate){
                setErrorMsg("Informe o nome e a previsão de conclusão");
                return;
            }

            const body = {
                name,
                previsionDate
            };

            await executeRequest('tasks', 'POST', body);
            await getFilteredList();
            closeModal();
        } catch (error) {
            console.log(error);
            setErrorMsg('Ocorreu erro ao cadastrar tarefa, tente novamente');
        }
    }

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

    return (
        <>
            <Header sair={sair} showModal={() => setShowModal(true)}/>
            <Filter 
                previsionDateStart={previsionDateStart}
                previsionDateEnd={previsionDateEnd}
                status={status}
                setPrevisionDateStart={setPrevisionDateStart}
                setPrevisionDateEnd={setPrevisionDateEnd}
                setStatus={setStatus}
            />
            <List tasks={tasks} getFilteredList={getFilteredList}/>
            <Footer showModal={() => setShowModal(true)}/>
            <CrudModal 
                showModal={showModal}
                errorMsg={errorMsg}
                name={name}
                setName={setName}
                previsionDate={previsionDate}
                setPrevisionDate={setPrevisionDate}
                closeModal={closeModal}
                doSave={doSave}
            />
        </>
    );
}