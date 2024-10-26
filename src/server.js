import 'express-async-errors';
import AppError from './utils/AppError.js';
import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: ['https://athena-front.vercel.app', "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));

app.use(express.json());
app.use(routes);

app.use((error, request, response, next) => {
    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message 
        })
    }

    console.error(error);

    return response.status(500).json({
        status: "error",
        message: "Internal server error"
    });
})

app.get("/", (req, res) => res.send("<h2>Servidor - ATHENA</h2>"))

const PORT = 3333;

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));