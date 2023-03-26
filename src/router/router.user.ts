import { Router } from "express";
import { Database } from '../database';
import { randomUUID } from 'node:crypto';

const userRoute = Router();
const database = new Database();
const table = "user";

  // request = parametro enviado do CLIENTE ao servidor
  // response = resposta do SERVIDOR

  // procurar todos
userRoute.get('/', (request, response ) => {
  const user = database.select(table);
  response.json(user)
});

  //procurar pelo id
userRoute.get('/:id', (request, response) => {
  const {id} = request.params
 const result = database.select(table, id);
 if(result === undefined) response.status(400).json({msg:'Este usuário não foi encontrado'})
  response.json()
})

  // adicionar usuário
userRoute.post('/', (request, response ) => {
const {name, endereco, saldo , extrato} = request.body;
const user = {
  id: randomUUID(),
  name,
  endereco,
  saldo,
  extrato
  // antigamente name:name, saldo:saldo etc.
  };
  database.insert(table, user);
response.status(201).send({msg:`Usuário ${user.name} adicionado com sucesso. ID: ${user.id}`});
});

  // deletar pelo ID
userRoute.delete('/:id', (request, response) => {
  const {id} = request.params
  const userExist:any = database.select(table, id);
  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Este usuário não foi encontrado'});

    database.delete(table, id)
    response.status(202).json(
      {msg: `Usuário ${userExist.name} deletado com sucesso` });
});

  // alterar o usuário
userRoute.put('/:id', (request,response)=>{
  const {id} = request.params
  const {name, endereco, saldo, extrato} = request.body
  const userExist:any = database.select(table, id);
  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Este usuário não foi encontrado'});

    database.update(table, id, {id, name, endereco, saldo, extrato})
    response.status(201).json(
      {msg: `Usuário ${userExist.name}, com saldo de R$${userExist.saldo} foi atualizado com sucesso. Nome atual: ${name}. Saldo atual R$${saldo}` });
})

  // retirar pelo ID
userRoute.put('/retirada/:id', (request,response)=>{
  const {id} = request.params
  const {extrato: [{ tipo, valor}]} = request.body
  const userExist:any = database.select(table, id);
  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Este usuário não foi encontrado'});

    let extrato = userExist.extrato
    extrato.push({tipo, valor})
    console.log(extrato)
    let saldo = userExist.saldo
    let name = userExist.name
    let endereco = userExist.endereco
    // let name e endereco criado para depositar sem precisar escrever o nome e endereço
    let novoSaldo = saldo - valor


    database.update(table, id, {id, name, endereco, saldo: saldo - valor, extrato})
    response.status(201).json(
      {msg: `Foi retirado com sucesso o valor de R$${valor} do usuário ${userExist.name}. Saldo anterior: R$${saldo}. Saldo atual R$${novoSaldo}` });
})

  // depositar pelo ID
userRoute.put('/deposito/:id', (request,response)=>{
  const {id} = request.params
  const {extrato: [{ tipo, valor}]} = request.body
  const userExist:any = database.select(table, id);
  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Este usuário não foi encontrado'});

    let extrato = userExist.extrato
    extrato.push({tipo, valor})
    console.log(extrato)
    let saldo = userExist.saldo
    let name = userExist.name
    let endereco = userExist.endereco
    // let name e endereco criado para depositar sem precisar escrever o nome e endereço
    let novoSaldo = saldo + valor

    database.update(table, id, {id, name, endereco, saldo: saldo + valor, extrato})
    response.status(201).json(
      {msg: `Foi depositado com sucesso o valor de  R$${valor} à conta do usuário ${userExist.name}. Saldo anterior: R$${saldo}. Saldo atual R$${novoSaldo}` });
})

userRoute.get('/', (request, response)=>{
  response.send(`Rota userRote ON.`)
})

export {userRoute}
