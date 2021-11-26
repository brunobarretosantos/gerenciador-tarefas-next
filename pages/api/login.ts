import type { NextApiRequest, NextApiResponse } from "next";
import connectDb from "../../middlewares/connectDb";
import { DefaultResponseMsg } from "../../types/DefaultResponseMsg";
import { LoginRequest } from "../../types/LoginRequest";
import { UserModel } from "../../models/UserModel";
import md5 from "md5";
import jwt from "jsonwebtoken";
import { LoginResponse } from "../../types/LoginResponse";

const loginEndpoint = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMsg | LoginResponse>) => {    
        
    if (req.method === 'POST'){
        const body = req.body as LoginRequest;

        if (!body || !body.login || !body.password){
            return res.status(400).json({ error: 'Login and Password are required' })
        }

        const { MY_SECRET_KEY } = process.env;

        if (!MY_SECRET_KEY){
            return res.status(500).json({ error: 'Jwt Secret Key not found' })
        }

        const existUser = await UserModel.findOne( { email: body.login, password: md5(body.password) });

        if (existUser){
            const token = jwt.sign( {_id: existUser._id}, MY_SECRET_KEY );

            const result = {
                name : existUser.name,
                email : existUser.email,
                token
            }

            return res.status(200).json(result);
        }

        return res.status(400).json({ error: 'Invalid Login or Password' })
    }

    return res.status(405).json({ error: 'Invalid method' });
}

export default connectDb(loginEndpoint);