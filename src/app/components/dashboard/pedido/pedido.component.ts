import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Cliente } from "../../../models/Cliente";
import { Item } from "../../../models/Item";
import { Pedido } from "../../../models/Pedido";
import { Usuario } from "../../../models/Usuario";
import { ItemService } from "../../../services/firebase-service/items.service";
import { PedidoService } from "../../../services/firebase-service/pedido.service";
import { Auth } from "../../../services/auth.service";

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  providers: [ItemService, PedidoService, Auth],
  styles: []
})
export class PedidoComponent implements OnInit {

  @ViewChild('cerrarAgregar') closeModal: ElementRef;
  private mostrarProductos: boolean = false;
  private formatoCliente: FormGroup;
  private cantidad: number = 0;
  private usuario: Usuario;

  private itemDetalle: Item;
  private cliente: Cliente;
  private listaItems: Item[] = [];
  private listaItemsPedidoNuevo: Item[] = [];
  private totales: number[] = [0];
  private total: number = 0;
  private pedido: Pedido;


  constructor(private itemS: ItemService, private pedidoS: PedidoService, private auth: Auth) {
    this.itemDetalle = new Item("nombre", 1, "id", 12, 12, 12, "descripcion");
    this.cliente = new Cliente("", "");
    this.usuario = new Usuario(auth.getProfile().user_metadata.apodo
      , auth.getProfile().email
      , auth.getProfile().user_metadata.tipo_user
      , auth.getProfile().user_id);


    this.formatoCliente = new FormGroup({
      'nombre': new FormControl('', [Validators.required]),
      'nit': new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {

    this.itemS.getAllItem().subscribe((items) => {
      this.listaItems = items;
    });

    

  }

  public guardarPedido() {
    if (this.formatoCliente.value.nombre.length > 0 && this.formatoCliente.value.nit.length > 0 && this.listaItemsPedidoNuevo.length > 0) {
        this.pedido = new Pedido(this.usuario.getIdUser(),
        this.formatoCliente.value.nit,
        this.listaItemsPedidoNuevo,
        this.total,
        false,
        false    
      );
      this.pedidoS.addPedido(this.pedido);
    } else {
      return;
    }
    console.log(this.formatoCliente.value.nombre);
  }

  obtenerLlaveItem(itemkey: string) {
    this.itemS.getItem(itemkey).subscribe(item => {
      this.itemDetalle = item;
    });
  }

  mardarATabla() {
    this.listaItemsPedidoNuevo.push(this.itemDetalle);
    console.log(this.cantidad);

    this.totales.push(this.cantidad * this.itemDetalle.precio);

    console.log(this.totales);
    this.totales.forEach(num => {
      this.total += num;
    })
    this.closeModal.nativeElement.click();
  }

}
