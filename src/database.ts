import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)


export class Database {
  #database: any = [];

  constructor(){
    fs.readFile(databasePath, 'utf8')
    .then(data => {
      this.#database = JSON.parse(data)
    }).catch(() => {
      fs.writeFile(databasePath, JSON.stringify({}, null, 2))
    })
  }

  //parse = converte para objeto
  //catch = se der errado ele trata com outro callback
  //Stringing = converte um objeto JavaScript em uma string JSON

  #persist(){
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2))
  }

  select(table: any, id?: string): object {
    let data = this.#database[table] ?? []
    // ?? = verifica se existe ou se é nulo, se for NULL ele cria um vazio
    if(id){ data = data.find((row:any) => {
      return row.id === id;
    })};
    return data
  }

  insert(table: any, data:object): object {//espera uma objeto

    if(Array.isArray(this.#database[table])) {
      // adiciona o dado
      this.#database[table].push(data);
      this.#persist();
    } else {
      // altera um dado
      this.#database[table] = [data]
    }
    return data //retorna um objeto
  }

  delete(table: any, id: string): void{
    const rowIndex = this.#database[table].findIndex(
      (row: any) => row.id === id
    );
    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }

  update(table:any, id:string, data:object): void{
    const rowIndex = this.#database[table].findIndex((row:any)=> row.id === id);
    if(rowIndex > -1) {
      this.#database[table][rowIndex] = data
      // ... = utilizado para desconstruir um objeto
      this.#persist()
    }
  }
}
