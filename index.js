import express from 'express';
import knex from "knex";
import cors from "cors";
import imageRead from './routes/imageRead.js'

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_NAME
    }
});

const corsOptions ={
    origin: 'http://localhost:3000',
    credentials: false,
    allowCredentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}

const app = express();

app.use(express.json());
app.use(cors(corsOptions))
app.use("/imageRead", imageRead)


const port = process.env.PORT || 3001;
app.listen(port,  () => {
    console.log("Connected! " + port);
});