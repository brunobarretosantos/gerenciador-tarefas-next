import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { DefaultResponseMsg } from '../types/DefaultResponseMsg';
import jwt, { JwtPayload }  from 'jsonwebtoken';

const jwtValidator = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMsg>) => {

        const { MY_SECRET_KEY } = process.env;

        if (!MY_SECRET_KEY){
            return res.status(500).json({ error: 'Jwt Secret Key not found' })
        }

        if (!req || !req.headers){
            return res.status(400).json({ error: 'Token is required' })
        }

        if (req.method !== 'OPTIONS'){
            try {
                const authorization = req.headers['authorization'];

                console.log("authorization");
                console.log(authorization);

                if (!authorization){
                    return res.status(400).json({ error: 'Token is required' })
                }

                const token = authorization.substring(7); //remove "Bearer " notation

                if (!token){
                    return res.status(400).json({ error: 'Token is required' })
                }

                console.log("MY_SECRET_KEY");
                console.log(MY_SECRET_KEY);

                const decode = await jwt.verify(token, MY_SECRET_KEY) as JwtPayload;

                console.log("decode");
                console.log(decode);

                if (!decode){
                    return res.status(400).json({ error: 'Invalid Token' })
                }

                if (req.body){
                    console.log("body");
                    req.body.userId = decode._id;
                }else{
                    console.log("query");
                    req.query.userId = decode._id;
                }
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Token validation failed' })
            }
        }        

        return handler(req, res);
    }

export default jwtValidator;