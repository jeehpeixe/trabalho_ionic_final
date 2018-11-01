import { Injectable } from '@angular/core';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

    private database: SQLiteObject;
    private open: boolean;

    constructor(private sqlite: SQLite, private platform: Platform) {

        if (!this.open) {
         this.platform.ready().then((ok) => {    
             this.sqlite.create({name: 'ionicFinal.db', location: 'default'}).then((db: SQLiteObject) => {
                this.database = db;

                let create = `
                    CREATE TABLE IF NOT EXISTS professores (
                        __id integer PRIMARY KEY AUTOINCREMENT, nome text, nascto text, imagem text, curriculo text, status integer
                    );`;

                this.database.executeSql(create, []).catch(e => console.log(e));
              }).catch((error: Error) => {console.log('Erro ao criar/abrir o banco', error);});
            });
        }
    }

    insert(id, nome, nascto, curriculo, status, imagem) {
        return this.database.executeSql('select * from professores where __id ='+id, []).then((data) => {
            if (data.rows.length == 0) {
                let insert = 'INSERT INTO professores(__id, nome, nascto, curriculo, status, imagem) VALUES (?,?,?,?,?,?);'
                return this.database.executeSql(
                    insert, [id, nome, nascto, curriculo, status, imagem]
                ).then(ok => console.log('inc '+id)).catch(e => console.log(e));
            }
        }, 
        err => {
            console.log('Error: ', err);
        });
    }

    getProfessoresFromPagina(pagina: number) {
        return this.database.executeSql('select __id, nome from professores limit 10 offset '+pagina * 10, []).then((data) => {
            const dados = [];
            if (data.rows.length > 0) {
                for (let i = 0; i < data.rows.length; i++) {
                    const info = data.rows.item(i);
                    dados.push({ id: info.__id, nome: info.nome});
                }
            }
            return dados;
        }, 
        err => {
            console.log('Error: ', err);
            return [];
        });
    }

    getProfessorFromId(id: number): Promise<{}>{
        return this.database.executeSql('select * from professores where __id = '+id, []).then((data) => {
            if (data.rows.length > 0) {
                const info = data.rows.item(0);
                return { 
                    id: info.__id, nome: info.nome, nascto: info.nascto, curriculo: info.curriculo, status: info.status, imagem: info.imagem
                };
            }
        });
    }

    excluiProfessor(id: number): Promise<{}>{
        return this.database.executeSql('delete from professores where __id = ?', [id]);
    }

    alteraProfessor(id: number, nome: string, curriculo: string, status: number, nascto: string, imagem: string): Promise<{}>{
        return this.database.executeSql(
            'update professores set nome = ?, curriculo = ?, status = ?, nascto = ?, imagem = ? where __id = ?',
            [nome, curriculo, status, nascto, imagem, id]
        ).catch((e) => {console.log(e)});
    }
}