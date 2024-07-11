// TIERCE MODULES
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// EXTERNAL MODULES
import router from './routers/index.router.js';

const app = express();

app.use(cookieParser(process.env.COOKIE));

// ? Comment rendre les fichiers static du front qui ont leur propre repo ?
// app.use(express.static(path.join(import.meta.dirname, '/')))

// CORS authorization
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');

//   res.header(
//     'Access-Control-Allow-Headers',
//     'Content-Type, Accept, Authorization'
//   );
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

//   // response to preflight request
//   if (req.method === 'OPTIONS') {
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// });

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_PASSWORD,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      sameSite: 'lax',
    },
  })
);

// Parser
// app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Router: router variable not exist now. Is only for information. To do
app.use(router);

export default app;
