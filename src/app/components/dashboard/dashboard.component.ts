import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import { Auth } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit,  DoCheck {

  perfil:Object;
  private opcionMenu:string="";
  private keyPedido:string="";
;

  constructor(private _auth:Auth) {
    this.perfil = this._auth.getProfile();

    console.log(this.perfil);
   }

  ngOnInit() {
  }
  ngDoCheck(){
  
  }

  reciviEvento(eventType:string){
    this.opcionMenu = eventType;
  }



}
