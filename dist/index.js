"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Import packages
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_production_1 = __importDefault(require("./enviroments/env.production"));
const token_middleware_1 = __importDefault(require("./middlewares/token.middleware"));
//Constants declarations
const app = express_1.default();
const authToken = token_middleware_1.default();
//Middlewares
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(cors_1.default({ origin: true, credentials: true }));
app.get('/api/auth/test', (req, res) => {
    res.status(200).json({ ok: true, msg: "Metodo de prueba funcionando correctamente." });
});
app.post('/api/auth/login', (req, res) => {
    const { userName, password } = req.body;
    const mockUser = {
        id: 1,
        userName: 'alan9805@gmail.com',
        password: '123',
        roles: ['admin', 'supervisor']
    };
    if (userName === 'alan9805@gmail.com' && password === '123') {
        jsonwebtoken_1.default.sign(mockUser, 'secretkeyword', { expiresIn: '120s' }, (err, token) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Ocurrió un error no contemplado',
                    err
                });
            }
            res.status(200).json({
                ok: true,
                msg: "El usuario se autenticó correctamente.",
                payload: {
                    userName: mockUser.userName,
                    roles: mockUser.roles
                },
                token
            });
        });
    }
    else {
        res.status(403).json({ ok: false, msg: "El usuario o contraseña no son válidos." });
    }
});
app.get('/api/auth/getCustomers', authToken.verify, (req, res) => {
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
    ];
    res.status(200).json({
        ok: true,
        msg: 'Permiso de acceso concedido.',
        data: mockCustomer,
        user: authUser
    });
});
app.listen(env_production_1.default.API.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${env_production_1.default.API.PORT}`);
});
