import type { NextApiRequest, NextApiResponse } from "next";
import connectDb from "../../middlewares/connectDb";
import jwtValidator from "../../middlewares/jwtValidator"
import { DefaultResponseMsg } from "../../types/DefaultResponseMsg";
import { TaskRequest } from "../../types/TaskRequest";
import moment from 'moment';
import { TaskModel } from "../../models/TaskModel"

const taskEndpoint = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMsg>) => {    
        
    if (req.method === 'POST'){
        const {userId} = req.body || req.query;
        const body = req.body as TaskRequest

        if(!userId){
            return res.status(400).json({ error : 'User not found'});
        }

        if (!body.name){
            return res.status(400).json({ error: 'Name is required' });    
        }
        
        if (!body.previsionDate){
            return res.status(400).json({ error: 'Prevision date is required' });
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

    return res.status(405).json({ error: 'Invalid method' });
}

export default connectDb(jwtValidator(taskEndpoint));