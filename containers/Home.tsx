import { NextPage } from "next"
import { Filter } from "../components/Filter"
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { useEffect, useState } from "react";
import { List } from "../components/List";
import { executeRequest } from "../services/api";
import { Modal } from "react-bootstrap";

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

    return(
        <>
            <Header sair={sair} showModal={() => setShowModal(true)}/>
            <Filter 
                previsionDateStart = {previsionDateStart}
                previsionDateEnd = {previsionDateEnd}
                status = {status}
                setPrevisionDateStart = {setPrevisionDateStart}
                setPrevisionDateEnd = {setPrevisionDateEnd}
                setStatus = {setStatus}                       
            />
            <List tasks={tasks} />
            <Footer showModal={() => setShowModal(true)}/>
            <Modal
                show={showModal}
                onHide={() => closeModal()}
                className="container-modal" >

                <Modal.Body>
                    <p>Adicionar Tarefa</p>
                    {errorMsg && <p className="error">{errorMsg}</p>}
                    <input  type="text" 
                            placeholder="Nome da tarefa"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            />
                    <input  type="text"
                            placeholder="Informe a previsão de conclusão"
                            value={previsionDate}
                            onChange={e => setPrevisionDate(e.target.value)}
                            onFocus={e => e.target.type = "date"}
                            onBlur={e => previsionDate ? e.target.type = "date" : e.target.type = "text"}
                            />
                </Modal.Body>
                <Modal.Footer>
                    <div className="button col-12">
                        <button onClick={doSave} >Salvar</button>
                        <span onClick={closeModal}>Cancelar</span>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}