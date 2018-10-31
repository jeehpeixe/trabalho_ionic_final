import { BancoService } from './service/banco.service';
import { AuthenticationService } from './service/authentication.service';
import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {title: 'Adicionar Professor',  url: '/new'},
    {title: 'Lista de Professores', url: '/list'},
    {title: 'Configurações',        url: '/configuracoes'}
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private menuController: MenuController,
    private authenticationService: AuthenticationService,
    private bancoService: BancoService 
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (!this.platform.is("mobile")) {
        this.menuController.close();
      }
    });
  }

  onClickSair(){
    this.authenticationService.sair();
    this.router.navigate(["login"]);
    this.menuController.close();
  }
}
