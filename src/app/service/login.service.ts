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
}
