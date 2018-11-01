import { ApiService } from './../service/api.service';
import { BancoService } from './../service/banco.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {
  avatarpadrao = '../assets/img/avatar.png';
  leitura: boolean;
  titulo: string;
  nome: any;
  nascto: any;
  curriculo: any;
  status: any;
  foto: string = this.avatarpadrao;
  id: number;
  alteracao: boolean;
  
  @ViewChild('avatarimg') avatar: ElementRef;  

  constructor(
    public actionSheetController: ActionSheetController, 
    private route: ActivatedRoute,
    private bancoService: BancoService,
    private camera: Camera,
    private apiService: ApiService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.params.subscribe( (params) => {

      this.leitura   = params['id'] && params['visualizacao'];
      this.alteracao = params['id'] && !params['visualizacao'];
      this.titulo    = (!params['id'] ? 'Adicionar' : (params['visualizacao'] ? 'Visualizar' : 'Editar')) + ' Professor';

      if (params['id']) {
        this.bancoService.getProfessorFromId(params['id']).then((retorno: any)=> {
            this.id        = retorno.id;
            this.nome      = retorno.nome;
            this.curriculo = retorno.curriculo;
            this.status    = retorno.status;
            this.nascto    = retorno.nascto;

            if (retorno.imagem.length > 0) {
              this.foto = retorno.imagem;;
            }
        });
      }
    });
  }

  incluir(id?: number){

    let nascimento = this.getNascimentoTratado();

    if (id) {
      this.apiService.alteraProfessor(id, this.nome, this.curriculo, this.status, nascimento, this.foto).toPromise().then((ok) => {
        this.bancoService.alteraProfessor(id, this.nome, this.curriculo, this.status, nascimento, this.foto).then((ret) => {
         this.router.navigate(['/list']);
        });
      });
    }
    else {
      this.apiService.insereProfessor(this.nome, this.curriculo, this.status, nascimento, this.foto).toPromise().then((ok) => {
        this.router.navigate(['/list']);
      });
    }
  }

  excluir(id:number){
    this.exibeAlertaExclusao();
  }

  async escolherFoto(){
    if (this.leitura){
      return;
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Fotos',
      buttons: [ 
        {text: 'Galeria', icon: 'photos', role: 'destructive', handler: () => { this.abreGaleria(); }}, 
        {text: 'Câmera' , icon: 'camera', role: 'destructive', handler: () => { this.abreCamera(); }},
        {text: 'Padrão' , icon: 'photos', role: 'destructive', handler: () => { this.setAvatarPadrao(); }}, 
        {text: 'Fechar' , icon: 'close',  role: 'cancel',}
      ]
    });

    await actionSheet.present();
  }

  setAvatarPadrao(){
    this.foto = '../assets/img/avatar.png';
    this.avatar.nativeElement.src = this.foto;
    this.salvaFoto();
  }

  abreGaleria() {
    const options: CameraOptions = {
        quality        : 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType     : this.camera.PictureSourceType.PHOTOLIBRARY,
        encodingType   : this.camera.EncodingType.JPEG,
        mediaType      : this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((img) => {
      this.adicionaDadosImagem(img);
    });
  }

  abreCamera() {
    const options: CameraOptions = {
        quality        : 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType   : this.camera.EncodingType.JPEG,
        mediaType      : this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((img) => {
      this.adicionaDadosImagem(img);
    });
  }

  adicionaDadosImagem(img){
    this.foto = 'data:image/jpeg;base64,' + img;
    this.avatar.nativeElement.src = this.foto;
    this.salvaFoto();
  }

  salvaFoto() {
    if (this.alteracao) {
      return;
    }

    let nascimento = this.getNascimentoTratado();

    this.apiService.alteraProfessor(this.id, this.nome, this.curriculo, this.status, this.nascto, this.foto).toPromise().then((ok) => {
      this.bancoService.alteraProfessor(this.id, this.nome, this.curriculo, this.status, nascimento, this.foto).then((ret) => {
        this.router.navigate(['/list']);
       });
    });
  }

  editarProfessor(){
    this.router.navigate(['/new', {id: this.id}]);
  }

  getNascimentoTratado(){
    let nascimento = this.nascto;

    if (nascimento instanceof Object) {
      nascimento = new Date(this.nascto.day['text']+'/'+this.nascto.month['text']+'/'+this.nascto.year['text']).toISOString();
    }

    return nascimento;
  }

  async exibeAlertaExclusao() {
    const alert = await this.alertController.create(
      {
        message: 'Tem certeza que deseja excluir o registro?',
        buttons: [
          {text: 'Não', role: 'cancel'},
          {text: 'Sim', handler: () => {this.processaExclusaoRegistro();}}
        ]
      }
    );
    await alert.present();
  }

  processaExclusaoRegistro(){
    this.apiService.excluiProfessor(this.id).toPromise().then((ok) => {
      this.bancoService.excluiProfessor(this.id).then((ret) => {
        this.router.navigate(['/list']);
      });
    });
  }
}
