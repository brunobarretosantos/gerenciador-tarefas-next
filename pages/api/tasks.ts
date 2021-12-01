import type { NextApiRequest, NextApiResponse } from "next";
import connectDb from "../../middlewares/connectDb";
import jwtValidator from "../../middlewares/jwtValidator"
import { DefaultResponseMsg } from "../../types/DefaultResponseMsg";
import { TaskRequest } from "../../types/TaskRequest";
import moment from 'moment';
import { TaskModel } from "../../models/TaskModel"
import { GetTasksParams } from "../../types/GetTasksParams";

const taskEndpoint = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMsg>) => {    
    const {userId} = req?.body || req?.query;
        
    switch (req.method) {
        case 'POST':            
            await saveTask(req, res, userId);
        case 'PUT':
            await updateTask(req, res, userId);
        case 'DELETE':
            await deleteTask(req, res, userId);
        case 'GET':
            await getTask(req, res, userId);
        default:
            return res.status(405).json({ error: 'Invalid method' });
    }
}

const validateBody = (body : TaskRequest, userId: string) => {
    if(!userId){
        return 'User not found';
    }

    if (!body.name){
        return 'Name is required';
    }
    
    if (!body.previsionDate){
        return 'Prevision date is required';
    }    
}

const getTask = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMsg | any>, userId: string) => {
    const params = req.query as GetTasksParams;

    const query = {
        userId
    } as any;

    if (params?.previsionDateStart){
        const startDate= moment(params?.previsionDateStart).toDate();
        query.previsionDate = {$gte: startDate};
    }    

    if (params?.previsionDateEnd){
        const endDate= moment(params?.previsionDateEnd).toDate();

        if (!query.previsionDate){
            query.previsionDate = {}
        }

        query.previsionDate.$lte = endDate;
    }

    if (params?.status){
        const status = parseInt(params?.status);

        switch(status){
            case 1: query.finishDate = null;
                break;
            case 2: query.finishDate = { $ne : null };            
        }
    }

    const result = await TaskModel.find(query);

    return res.status(200).json(result);
}

const saveTask = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMsg>, userId: string) => {
    const body = req.body as TaskRequest;    

    const errorMessage =  validateBody(body, userId);
    if (errorMessage){
        return res.status(400).json({ error: errorMessage });
    }

    const previsionDate = moment(body.previsionDate);        
    const now = moment().set({hour:0,minute:0,second:0,millisecond:0});

    if(previsionDate.isBefore(now) ){
        return res.status(400).json({ error: 'Invalid Prevision Date' });
    }

    const task  = {
        name: body.name,
        previsionDate: previsionDate.toDate(),
        userId: userId
    }

    await TaskModel.create(task);

    return res.status(200).json({ message: 'Task created' });        
}

const updateTask = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMsg>, userId: string) => {        
    const body = req.body as TaskRequest;

    const errorMessage =  validateBody(body, userId);
    if (errorMessage){
        return res.status(400).json({ error: errorMessage });
    }
    
    const taskId = req?.query?.taskId

    if(!taskId){
        return res.status(400).json({ error: 'Task Id is required' });
    }

    const task = await TaskModel.findById(taskId);

    if (!task || task.userId !== userId){
        return res.status(400).json({ error: 'Task not found' });
    }

    const previsionDate = moment(body.previsionDate);
    const now = moment().set({hour:0,minute:0,second:0,millisecond:0});

    if(previsionDate.isBefore(now) ){
        return res.status(400).json({ error: 'Invalid Prevision Date' });
    }

    task.name = body.name;
    task.previsionDate = previsionDate;
    task.finishDate = body.finishDate ? moment(body.finishDate) : null;

    await TaskModel.findByIdAndUpdate({ _id: task._id}, task);
    return res.status(200).json({ message: 'Task updated' });    
}

const deleteTask = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMsg>, userId: string) => {        
    const body = req.body as TaskRequest;
    const taskId = req?.query?.taskId

    if(!taskId){
        return res.status(400).json({ error: 'Task Id is required' });
    }

    const task = await TaskModel.findById(taskId);

    if (!task || task.userId !== userId){
        return res.status(400).json({ error: 'Task not found' });
    }

    await TaskModel.findByIdAndDelete({ _id: task._id}, task);
    return res.status(200).json({ message: 'Task deleted' });    
}

export default connectDb(jwtValidator(taskEndpoint));