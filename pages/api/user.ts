import type { NextApiRequest, NextApiResponse } from "next";
import connectDb from "../../middlewares/connectDb";
import { DefaultResponseMsg } from "../../types/DefaultResponseMsg";
import { UserRequest } from "../../types/UserRequest";
import md5 from "md5";
import { UserModel } from "../../models/UserModel";

const userEndpoint = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMsg>) => {    
        
    if (req.method === 'POST'){
        const body = req.body as UserRequest

        if (!body.name){
            return res.status(400).json({ error: 'Name is required' });    
        }

        if (!body.email){
            return res.status(400).json({ error: 'Login is required' });    
        }

        if (!body.password){
            return res.status(400).json({ error: 'Password is required' });
        }

        const existUserWithEmail = await UserModel.findOne( { email: body.email });

        if (existUserWithEmail){
            return res.status(400).json({ error: 'Email already exist' });
        }

        const user = {
            name: body.name,
            email: body.email,
            password: md5(body.password)
        }

        await UserModel.create(user);

        return res.status(200).json({ message: 'User created' });
        
    }

    return res.status(405).json({ error: 'Invalid method' });
}

export default connectDb(userEndpoint);

