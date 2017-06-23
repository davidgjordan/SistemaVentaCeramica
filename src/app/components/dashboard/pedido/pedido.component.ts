import { Component, OnInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Cliente } from "../../../models/Cliente";
import { Item } from "../../../models/Item";
import { DespachoItems } from "../../../models/Despacho";
import { Pedido } from "../../../models/Pedido";
import { Usuario } from "../../../models/Usuario";
import { ItemService } from "../../../services/firebase-service/items.service";
import { PedidoService } from "../../../services/firebase-service/pedido.service";
import { Auth } from "../../../services/auth.service";




@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  providers: [ItemService, PedidoService, Auth],

})
export class PedidoComponent implements OnInit, OnChanges {

  @ViewChild('cerrarAgregar') closeModal: ElementRef;
  @ViewChild('cantidadItems') cantidadItems: ElementRef;
  private mostrarProductos: boolean = false;
  private formatoCliente: FormGroup;
  private listaItems: Item[] = [];
  private itemKey: string = "";
  private item: Item = new Item("", 0, 0, 0, 0, "", "", "", false);
  private listaDespachosItems: DespachoItems[] = [];
  private pedido: Pedido = new Pedido("", "", this.listaDespachosItems, 0, false, false);
  private total: number = 0;



  constructor(private itemS: ItemService, private pedidoS: PedidoService, private auth: Auth) {

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

  ngOnChanges() {
    if (this.listaDespachosItems) {
      console.log("1")
      for (let y = 0; y < this.listaDespachosItems.length; y++) {
        this.total += (this.listaDespachosItems[y].item.cantidad * this.listaDespachosItems[y].item.precio);
      }
    }
  }

  setDetalleKey(itemKey: string) {
    this.itemKey = itemKey;
    this.itemS.getItem(itemKey).subscribe((item: Item) => {
      this.item = item;
    });
  }
  setEditKey(itemKey: string) {
    this.itemKey = itemKey;
  }

  //metodo para agregar items a la tabla 
  agregarItems(cantidadStr: number) {
    let cantidad: number = Number(cantidadStr);
    let itemAux: Item;
    if (cantidad > 0) {

      this.itemS.getItem(this.itemKey).subscribe((item) => {
        itemAux = item;

      });
      setTimeout(() => {
        if (itemAux.cantidad >= cantidad) {
          //restar y actualizar
          let cantidadPrimera: number = itemAux.cantidad;
          itemAux.cantidad = itemAux.cantidad - cantidad;
          this.itemS.updateItem(this.itemKey, itemAux, null).then(() => console.log("then entre")).catch((error) => console.log("then entre"));
          //pushear a la lista de listaDespachositemAuxs 
          let existe: boolean = false;
          let num: number = 0;

          for (let i = 0; i < this.listaDespachosItems.length; i++) {
            if (this.itemKey === this.listaDespachosItems[i].keyItem) {
              existe = true;
              num = i;
            }
          }
          if (existe) {

            this.listaDespachosItems[num].item.cantidad += cantidad;

            let despachoAux: DespachoItems = {
              keyItem: this.itemKey,
              item: this.listaDespachosItems[num].item
            };
            this.listaDespachosItems[num] = despachoAux;
            this.cantidadItems.nativeElement.value = "";
            this.closeModal.nativeElement.click();
          } else {
            itemAux.cantidad = cantidad;
            let despachoAux: DespachoItems = {
              keyItem: this.itemKey,
              item: itemAux
            };
            this.listaDespachosItems.push(despachoAux);
            this.cantidadItems.nativeElement.value = "";
            this.closeModal.nativeElement.click();
          }

        } else {
          console.log("no hay cantidad suficiente")
        }

      }, 1000);

    }

    setTimeout( () =>{
      this.calcularTotal();
    }, 1500);
  }


  calcularTotal() {

    if (this.listaDespachosItems.length > 0) {
      console.log("2")
        this.total = 0;
      for (let y = 0; y < this.listaDespachosItems.length; y++) {
        this.total = this.total + (this.listaDespachosItems[y].item.cantidad * this.listaDespachosItems[y].item.precio);
        console.log("total");
        
        console.log(this.total);
        console.log(this.listaDespachosItems[y].item.cantidad * this.listaDespachosItems[y].item.precio);
      }
      
    }
  }

  guardarPedido() {
    //NOS QUEDAMOS EN LA GENERACION DEL PEDIDO--------------------------------------------------------
    this.pedido.idUser = this.auth.getProfile().user_id;
    this.pedido.nitCliente = this.formatoCliente.value.nit;
    this.pedido.despachoItems = this.listaDespachosItems;

  }

}
