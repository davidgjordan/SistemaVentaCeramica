import { EventEmitter } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';

import { Auth } from '../../../services/auth.service';


@Component({
  selector: 'app-menu-opciones',
  templateUrl: './menu-opciones.component.html',
  styles: []
})
export class MenuOpcionesComponent implements OnInit {

  @Output() eventoOpcion = new EventEmitter<string>();

  constructor(private _auth:Auth) { }

  ngOnInit() {
  }


  private cargarPedidos() {
    this.eventoOpcion.emit("pedido");
  }
  private cargarDespacho() {
    this.eventoOpcion.emit("despacho");
  }
  private cargarPrecios() :void{
    this.eventoOpcion.emit("precio");

  }
  private cargarCliente() {
    this.eventoOpcion.emit("cliente");

  }
  private cargarProduccion() {
    this.eventoOpcion.emit("produccion");

  }
  private cargarAlmacenes() {
    this.eventoOpcion.emit("almacen");

  }
  private cargarCobros() {
    this.eventoOpcion.emit("cobro");

  }

}
