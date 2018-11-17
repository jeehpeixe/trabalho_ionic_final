import { AuthenticationService } from './../service/authentication.service';
import { ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
})
export class ConfiguracoesPage implements OnInit {

  usuario = null;
  idioma = null;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    let dadosUsuario = JSON.parse(localStorage.getItem('usuario'));
    this.usuario = dadosUsuario.nome;
    this.idioma = dadosUsuario.idioma;
  }

  voltar(){
    this.router.navigate(['/list']);
  }

  gravar(){
    this.authenticationService.alteraDadosUsuario(this.usuario, this.idioma).then(() => {
      this.exibirToast();
      this.router.navigate(['/list']);
    });
  }

  async exibirToast() {
    let toast = await this.toastController.create({
      message: 'Registro salvo com sucesso!',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

}
