import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { DefaultResponseMsg } from '../types/DefaultResponseMsg';

const connectDb = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMsg>) => {

        console.log('MongoDb readystate', mongoose.connections[0].readyState);

        if (mongoose.connections[0].readyState){
            return handler(req, res)
        }

        const { DB_CONNECTION_STRING } = process.env;

        if (!DB_CONNECTION_STRING){
            return res.status(500).json( { error: 'Connection string not found' } );
        }

        await mongoose.connect(DB_CONNECTION_STRING);

        mongoose.connection.on('connected', () => console.log('Connected to Database'));
        mongoose.connection.on('error', error => console.log("Error occurred on database connection: " + error));

        return handler(req, res);
    }

export default connectDb;