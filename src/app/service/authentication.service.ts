import { Observable, Subject } from 'rxjs';
import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private loginService: LoginService) { }

  efetuarLogin(usuario, senha) {
    return this.loginService.getUsuario(usuario).toPromise().then(data => {
      if (data["senha"] == senha) {
        localStorage.setItem('usuario', JSON.stringify(data));
        localStorage.setItem('expiry', moment().add(1, 'h').format());
        return true;
      }
      else {
        this.removeSessaoLocalStorage();
        return false;
      }
    }).catch((err) => {
      this.removeSessaoLocalStorage();
      return false;
    });
  }

  sair(){
    this.removeSessaoLocalStorage();
  }

  isSessaoValida():any{
    const expiry = localStorage.getItem('expiry') ? moment(localStorage.getItem('expiry')) : false;

    if (expiry && !moment().isAfter(expiry)) {
      return true;   
    } 
    else {
      this.removeSessaoLocalStorage();
      return false;
    }
  }

  atualizaTempoSessao(){
    if (this.isSessaoValida()) {
      localStorage.setItem('expiry', moment().add(1, 'h').format());
    }
  }

  removeSessaoLocalStorage(){
    localStorage.removeItem('usuario');
    localStorage.removeItem('expiry');
  }

  recuperaSenha(email: string){
    return this.loginService.getUsuarioFromEmail(email).toPromise().then(data => {      
      return true;
    }).catch((err) => {
      return false;
    });
  }

  alteraDadosUsuario(nome: string, idioma: string){
    let user = JSON.parse(localStorage.getItem('usuario')).login;
    return this.loginService.setUsuario(user, nome, idioma).toPromise().then(data => {
        localStorage.setItem('usuario', JSON.stringify(data));
        return true;
    }).catch((err) => {
      this.removeSessaoLocalStorage();
      return false;
    });
  }
}
