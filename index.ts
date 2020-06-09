//Import packages
import express, {Request, Response, json} from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken'

import ENV from './enviroments/env.production';
import AuthToken from './middlewares/token.middleware'

//Constants declarations
const app = express();
const authToken = AuthToken();

//Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({origin: true, credentials: true}));

app.get('/api/auth/test', (req: Request, res: Response) => {
    res.status(200).json({ ok: true, msg: "Metodo de prueba funcionando correctamente." })
});

app.post('/api/auth/login', (req: Request, res: Response) => {
    const { userName, password } = req.body;
    const mockUser = {
        id: 1,
        userName: 'alan9805@gmail.com',
        password: '123',
        roles: ['admin', 'supervisor']
    }
    if(userName === 'alan9805@gmail.com' && password === '123'){

        jwt.sign(mockUser, 'secretkeyword', { expiresIn: '120s' }, (err: any , token) => {

            if(err){
                return res.status(500).json({
                    ok: false,
                    msg: 'Ocurrió un error no contemplado',
                    err
                })
            }

            res.status(200).json({ 
                ok: true, 
                msg: "El usuario se autenticó correctamente.", 
                payload: {
                    userName: mockUser.userName,
                    roles: mockUser.roles
                },
                token
            })

        })

    }else{
        res.status(403).json({ ok: false, msg: "El usuario o contraseña no son válidos." })
    }
});

app.get('/api/auth/getCustomers', authToken.verify, (req: Request, res: Response) => {

    const { authUser } = req.body;
    const mockCustomer = [
        {
            clave: 'ALFKI',
            nombre: 'American Axel'
        },
        {
            clave: 'GKN',
            nombre: 'Pirelli'
        },
        {
            clave: 'GM',
            nombre: 'General Motors'
        }
    ]

    res.status(200).json({
        ok: true,
        msg: 'Permiso de acceso concedido.',
        data: mockCustomer,
        user: authUser
    });

});

app.listen(ENV.API.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${ENV.API.PORT}`);
});