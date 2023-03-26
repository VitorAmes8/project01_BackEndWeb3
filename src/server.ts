import express, { response } from 'express';
import { Database } from './database';
import { randomUUID } from 'node:crypto';
import { router } from './router/index';

const app = express();
const port = 3000;

//interceptador de dados
app.use(express.json());

app.use(router)

// precisa de uma porta e função de Call Back.
app.listen(port, () => {
  console.log(`Servidor está ON '-'!!! Link de acesso: http://localhost:${port}`);
});

