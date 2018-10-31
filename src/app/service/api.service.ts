import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  currentProfessor: any;
  constructor(private http: HttpClient) { }

  getProfessores(page: number) {
    return this.http.get(`${API_URL}/professores/prof_paginado/${page}`);
  }

  getAllProfessores() {
    return this.http.get(`${API_URL}/professores`);
  }

  alteraProfessor(id: number, nome: string, curriculo: string, status: number, nascto: string, foto: string){
    let param = {'id': id, 'nome': nome, 'curriculo': curriculo, 'status' : status, 'nascimento': nascto, 'foto': foto};
    let header = {headers: {'Content-Type': 'application/json'}};
    return this.http.put(`${API_URL}/professores/${id}`, param, header);
  }

  insereProfessor(nome: string, curriculo: string, status: number, nascto: string, foto: string){
    let param = {'nome': nome, 'curriculo': curriculo, 'status' : status, 'nascimento': nascto, 'foto': foto};
    let header = {headers: {'Content-Type': 'application/json'}};
    return this.http.post(`${API_URL}/professores`, param, header);
  }

  excluiProfessor(id: number){
    return this.http.delete(`${API_URL}/professores/${id}`);
  }
}
