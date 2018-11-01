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

  removeSessaoLocalStorage(){
    localStorage.removeItem('usuario');
    localStorage.removeItem('expiry');
  }
}
