import { AuthenticationService } from './../service/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario = null;
  senha = null;
  caminhoImagem = '../assets/img/logo.png';

  constructor(
    private route : Router, 
    private authenticationService : AuthenticationService, 
    private alertController : AlertController
  ){}

  ngOnInit() {
    if (this.authenticationService.isSessaoValida()){
      this.route.navigateByUrl('list');    
    }
  }

  async showAlert(message: string, messageButton = 'OK') {
    const alert = await this.alertController.create({header: 'Atenção!', message: message, buttons: [messageButton]});
    await alert.present();
  }

  login(){
      this.authenticationService.efetuarLogin(this.usuario, this.senha).then(valido => {
        if (valido) {
          this.route.navigate(["list"]);
        }
        else {
          this.showAlert('Usuário ou Senha Inválidos!');
        }
      });
  }

  recuperarSenha(){

  }
}
