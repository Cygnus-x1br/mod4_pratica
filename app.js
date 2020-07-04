/**
 *    App da Prática do módulo 4
 */

import express from 'express';
import mongoose from 'mongoose';
import { accountsRouter } from './routes/accountsRouter.js';

/**Rotina para conectar à base de dados no atlas.
 * !No mongoDB atlas podemos criar usuários específicos para a base de dados.
 * !Podemos por exemplo criar um usuário com poderes apenas para ler a base e
 * !configurar na conexão da base esse usuário.
 */
(async () => {
  try {
    await mongoose.connect(
      //'mongodb+srv://Jean_Marcel:aczf0704@cygnus-lskuq.gcp.mongodb.net/accounts?retryWrites=true&w=majority',
      'mongodb+srv://Jean_Marcel:aczf0704@cygnus-lskuq.gcp.mongodb.net/bank?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    //.then(console.log('Conectado ao MongoDB Atlas'));
  } catch (err) {
    console.log('Erro ao conectar ao MongoDB Atlas' + err);
  }
})();

const app = express();

app.use(express.json());
app.use(accountsRouter);

app.listen(3000, () => console.log('API iniciada'));
