import { ApiService } from './../service/api.service';
import { BancoService } from './../service/banco.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit, OnDestroy {

    name: string;
    lista = [];
    page  = 0;
    filtro: string = '';
    searchQuery: string = '';
    navigationSubscription;
    dados: any;

    private loading;

    constructor(
        private apiService: ApiService, 
        private router: Router, 
        private bancoService: BancoService,
        public loadingController: LoadingController
    ) {
        if (this.loading) {
            this.loading.dismiss();
        }
        
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
                this.presentLoading();
                this.filtro = '';
                this.insereDadosIniciais();
            }
        });
    }

    async presentLoading() {
        this.loading = await this.loadingController.create({message: 'Carregando...', duration: 0});
        return await this.loading.present();
    }

    insereDadosIniciais(){
        var promises = [];

        this.apiService.getAllProfessores().toPromise().then((data: any) => {
            this.dados = data;
            for (let i = 0; i < data.length; i++) {
                promises.push(this.bancoService.insert(
                    data[i].id, data[i].nome, data[i].nascimento, data[i].curriculo, data[i].status, data[i].foto
                ));
            }

            Promise.all(promises).then(() => {
                this.atualiza();
            });
        });
    }

    ngOnInit() {}

    ngOnDestroy() {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    atualiza(event?: any) {
        this.lista = [];
        this.page  = 0;
        this.carregaFromInfinite(event);
    }

    carregaFromInfinite(event?: any) {
        this.bancoService.getProfessoresFromPagina(this.page).then(data => {
            for (const professor of data) {
                this.lista.push(professor);
            }
            this.page++;
            this.loading.dismiss();
            if (event) {
                event.target.complete();
            }
        }, err => {
            this.loading.dismiss();
            if (event) {
                event.target.complete();
            }
        });
    }

    criaProfessor() {
      this.router.navigateByUrl('new'); 
    }

    alteraProfessor(professor) {
        this.apiService.currentProfessor = professor;
        this.router.navigate(['new', {id: professor.id, visualizacao: true}]);
    }

    getItems(ev: any) {
        this.lista = [];
        this.page  = 0;
    
        const val = ev.target.value;
    
        if (val && val.trim() != '') {
          this.lista = this.dados.filter((item) => {
            return (item.nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
        }
        else {
            this.carregaFromInfinite();
        }
      }
}
