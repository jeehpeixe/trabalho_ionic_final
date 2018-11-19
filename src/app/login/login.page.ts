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
      this.authenticationService.atualizaTempoSessao();
      this.route.navigate(["list"]);
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

  async recuperarSenha(){
    const alert = await this.alertController.create({
      header: 'Esqueceu a senha?', 
      message: "Digite seu e-mail abaixo:",
      inputs: [{name: 'email', placeholder: 'E-mail', type: 'email'}],
      buttons: [
        {text: 'Cancelar', role: 'cancel'},
        {text: 'OK', handler: (data) => { 
          if (!( /(.+)@(.+){2,}\.(.+){2,}/.test(data.email))) {
            this.exibeAlertaEmail("E-mail Inválido", "Por favor, informe o e-mail em um formato válido!");
            return;
          }
          this.authenticationService.recuperaSenha(data.email).then((valido) => {
            if (valido) {
              this.exibeAlertaEmail("Nova Senha Enviada", "Sua nova senha foi enviada para seu e-mail com sucesso!");
            }
            else {
              this.exibeAlertaEmail("Usuário Não Encontrado", "Este e-mail não foi encontrado na base de dados!");
            }
          }); 
        }}
      ]
    });
    await alert.present();
  }

  async exibeAlertaEmail(header: string, message: string) {
    const alert = await this.alertController.create({header: header, message: message, buttons: ['OK']});
    await alert.present();
  }
}
