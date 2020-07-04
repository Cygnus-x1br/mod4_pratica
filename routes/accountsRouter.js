import express from 'express';
import { accountsModel } from '../models/accounts.js';

const app = express();

app.get('/accounts', async (req, res) => {
  try {
    const accounts = await accountsModel.find({});
    res.send(accounts);
  } catch (error) {
    res.status(500).send(err);
  }
});

app.get('/accounts/maiorSaldo', async (req, res) => {
  try {
    const maiorSaldo = await accountsModel.aggregate([
      { $match: { $and: { agencia: 10 } } },
      { $group: { _id: null, total: { $max: '$balance' } } },
    ]);
    console.log(maiorSaldo);

    res.send(maiorSaldo);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/accounts/consultaConta/', async (req, res) => {
  //console.log('Consulta de Conta');
  try {
    const { agencia, conta } = req.body;
    console.log(agencia);
    console.log(conta);
    const consultaSaldo = await accountsModel.aggregate([
      { $match: { $and: [{ agencia: agencia }, { conta: conta }] } },
      { $group: { _id: null, total: { $sum: '$balance' } } },
    ]);

    if (consultaSaldo === []) {
      res.send('Conta inexistente');
    }
    res.send(consultaSaldo);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/accounts/saldoPorAgencia/', async (req, res) => {
  //console.log('Consulta de Conta');
  try {
    const { agencia } = req.body;
    console.log(agencia);
    const saldoPorAgencia = await accountsModel.aggregate([
      { $match: { agencia: agencia } },
      { $group: { _id: null, total: { $sum: '$balance' } } },
    ]);
    console.log(saldoPorAgencia);

    res.send(saldoPorAgencia);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/accounts/maiorSaldoPorAgencia/', async (req, res) => {
  //console.log('Consulta de Conta');
  try {
    const { agencia } = req.body;
    console.log(agencia);
    const accounts = await accountsModel.aggregate([
      { $match: { agencia: agencia } },
      { $sort: { balance: -1 } },
      { $limit: 1 },
    ]);
    console.log(accounts);

    res.send(accounts);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/accounts/mediaPorAgencia/', async (req, res) => {
  //console.log('Consulta de Conta');
  try {
    const { agencia } = req.body;
    console.log(agencia);
    const mediaPorAgencia = await accountsModel.aggregate([
      { $match: { agencia: agencia } },
      { $group: { _id: null, total: { $avg: '$balance' } } },
    ]);
    console.log(mediaPorAgencia);

    res.send(mediaPorAgencia);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/accounts/depositoConta/', async (req, res) => {
  //console.log('Consulta de Conta');
  try {
    const { agencia, conta, deposito } = req.body;
    console.log(agencia);
    console.log(conta);
    console.log(deposito);

    let accounts = await accountsModel.findOneAndUpdate(
      { $and: [{ agencia: agencia }, { conta: conta }] },
      { $inc: { balance: deposito } },
      { new: true }
    );

    console.log(accounts);
    res.send(accounts);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/accounts/saqueConta/', async (req, res) => {
  //console.log('Consulta de Conta');
  try {
    const { agencia, conta, saque } = req.body;
    console.log(agencia);
    console.log(conta);
    console.log(saque);

    let accounts = await accountsModel.findOneAndUpdate(
      { $and: [{ agencia: agencia }, { conta: conta }] },

      { $inc: { balance: -saque } },
      { new: true }
    );
    console.log(accounts);
    res.send(accounts);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete('/accounts/deleteConta/', async (req, res) => {
  //console.log('Consulta de Conta');
  try {
    const { agencia, conta } = req.body;
    console.log(agencia);
    console.log(conta);

    let accounts = await accountsModel.findOneAndDelete(
      { $and: [{ agencia: agencia }, { conta: conta }] }
      //{ $match: { agencia: agencia } },
      //{ $group: { _id: null, count: { $count: '$conta' } } }
      //{ $count: _id }
      //{ $inc: { balance: -saque } },
      //{ new: true }
    );
    //console.log(conta);
    console.log(accounts);
    res.send(accounts);
  } catch (error) {
    res.status(500).send(error);
  }
});

export { app as accountsRouter };
