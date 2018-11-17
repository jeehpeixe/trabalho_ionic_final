import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  id: any;
  element: any;

  constructor(private http: HttpClient) { }

  getUsuario(usuario) {
    return this.http.get(`${API_URL}/usuarios/${usuario}`);
  }

  getUsuarioFromEmail(email: string){
    return this.http.post(`${API_URL}/usuarios`,{email: email});
  }

  setUsuario(user: string, nome: string, idioma: string){
    return this.http.put(`${API_URL}/usuarios/${user}`, {nome: nome, idioma : idioma});
  }
}
