import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit {
  private ancho:number=0;
  private alto:number=0;

  private area:number=0;

  private unidadesNecesarias:number=0;

  constructor(private auth:Auth) { }

  ngOnInit() {
  }

  calcularUnidadesCeramina(){
    if(this.ancho == 0 || this.alto == 0 || this.area == 0){
      return;
    }

    let canrtidadAlto = 100 / this.alto;
    let canrtidadAncho = 100 / this.ancho;
    let resMetro = canrtidadAlto * canrtidadAncho;

    
    this.unidadesNecesarias = Math.floor(resMetro*this.area)+1;




  }

}
