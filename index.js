import express from 'express';
import cors from "cors";
import api from './routes/api.js'
import work from './routes/work.js';
import auth from './routes/auth.js';



const corsOptions ={
    origin: 'http://localhost:3000',
    credentials: false,
    allowCredentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}

const app = express();


app.use(express.json());
app.use(cors(corsOptions))
app.use("/api", api)
app.use("/work", work)
app.use("/auth", auth)


const port = process.env.PORT || 3001;
app.listen(port,  () => {
    console.log("Connected! " + port);
});