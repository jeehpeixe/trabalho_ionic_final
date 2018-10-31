import { ApiService } from './../service/api.service';
import { BancoService } from './../service/banco.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit, OnDestroy {

  public name: string;
  public terms: string;
  public lista = [];
  public page  = 0;
  navigationSubscription;

    constructor(private apiService: ApiService, private router: Router, private bancoService: BancoService) {
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {

                this.apiService.getAllProfessores().subscribe((data: any) => {
                    for (let i = 0; i < data.length; i++) {
                        this.bancoService.insert(
                            data[i].id, data[i].nome, data[i].nascimento, data[i].curriculo, data[i].status, data[i].foto
                        );
                    }

                    this.refresh();
                });
            }
        });
    }

    ngOnInit() {}

    ngOnDestroy() {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    refresh(event?: any) {
        this.lista = [];
        this.page = 0;
        this.loadProfessorDataFromDB(event);
    }

    loadProfessorDataFromDB(event?: any) {
        console.log('buscou');
        this.bancoService.getProfessoresFromPagina(this.page).then(data => {
            for (const professor of data) {
                this.lista.push(professor);
            }
            this.page++;
            if (event) {
                event.target.complete();
            }
        }, err => {
            if (event) {
                event.target.complete();
            }
        });
    }

    criaProfessor() {
      this.router.navigateByUrl('new'); 
    }

    showProfessorDetails(professor) {
        this.apiService.currentProfessor = professor;
        this.router.navigate(['new', {id: professor.id, visualizacao: true}]);
    }
}
