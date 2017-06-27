import { Component, OnInit, ViewChild, ElementRef, OnDestroy, DoCheck } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
//Modesls
import { Cliente } from "../../../models/Cliente";
import { Item } from "../../../models/Item";
import { DespachoItems } from "../../../models/Despacho";
import { Pedido } from "../../../models/Pedido";
import { Usuario } from "../../../models/Usuario";

//Servicios
import { ItemService } from "../../../services/firebase-service/items.service";
import { ClienteService } from "../../../services/firebase-service/cliente.service";
import { PedidoService } from "../../../services/firebase-service/pedido.service";
import { SaveInstancePedido } from "../../../services/firebase-service/saveInstacePedido.service";
import { Auth } from "../../../services/auth.service";




@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  providers: [ItemService, PedidoService, Auth, ClienteService],

})
export class PedidoComponent implements OnInit, DoCheck, OnDestroy {

  @ViewChild('cerrarAgregar') closeModal: ElementRef;
  @ViewChild('cantidadItems') cantidadItems: ElementRef;
  private mostrarProductos: boolean = false;
  private formatoCliente: FormGroup;
  private listaItems: Item[] = [];
  private itemKey: string = "";
  private item: Item = new Item("", 0, 0, 0, 0, "", "", "", false);
  private listaDespachosItems: DespachoItems[] = [];
  private pedido: Pedido = new Pedido("","", 0, this.listaDespachosItems, 0,0,0, false, false, false);
  private total: number = 0;
  private pedidoSaveInstance:Pedido;


  constructor(private itemS: ItemService, private pedidoS: PedidoService, private auth: Auth, private saveI: SaveInstancePedido, private clienteS:ClienteService) {

    this.formatoCliente = new FormGroup({
      'nombre': new FormControl('', [Validators.required]),
      'nit': new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    console.log("entraste");
    //le damos el pedido a un servicio
    this.itemS.getAllItem().subscribe((items) => {
      this.listaItems = items;
    });
    if(this.saveI.getPedido()){
    console.log("entraste if onitit");
      
      this.formatoCliente.value.nit = this.saveI.getPedido().nitCliente;
      this.listaDespachosItems = this.saveI.getPedido().despachoItems;
      this.total = this.saveI.getPedido().total;

    }
    this.formatoCliente.value.nombre = this.saveI.nombre;
  }
  ngOnDestroy(){
    //se esq la lista de despacho de items tiene items y actualizan la pagina o se salen debolver esos items aqui
  }
 
  ngDoCheck() {
    console.log("hisiste un ngDoCheck");
     this.pedidoSaveInstance = new Pedido(
                this.auth.getProfile().user_id,
                this.formatoCliente.value.nombre,
                this.formatoCliente.value.nit,
                this.listaDespachosItems,
                this.total,
                0,
                this.total,
                false,
                false, 
                false
            );
         this.saveI.saveInstace(this.pedidoSaveInstance, this.formatoCliente.value.nombre );

  }

  setDetalleKey(itemKey: string) {
    this.itemKey = itemKey;
    this.itemS.getItem(itemKey).subscribe((item: Item) => {
      this.item = item;
    });
  }
  setEditKey(itemKey: string) {
    this.itemKey = itemKey;
    this.itemS.getItem(itemKey).subscribe((item: Item) => {
      this.item = item;
    });
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
          itemAux.cantidad = itemAux.cantidad - cantidad;
          this.itemS.updateItem(this.itemKey, itemAux, null);
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

    setTimeout(() => {
      this.calcularTotal();
    }, 1500);
  }


  calcularTotal() {

    if (this.listaDespachosItems.length > 0) {
      this.total = 0;
      for (let y = 0; y < this.listaDespachosItems.length; y++) {
        this.total = this.total + (this.listaDespachosItems[y].item.cantidad * this.listaDespachosItems[y].item.precio);
      }
    }

  }

  guardarPedido() {

      //NOS QUEDAMOS EN LA GENERACION DEL PEDIDO--------------------------------------------------------
      this.pedido.idUser = this.auth.getProfile().user_id;
      this.pedido.nitCliente = this.formatoCliente.value.nit;
      this.pedido.despachoItems = this.listaDespachosItems;
      this.pedido.total = this.total;
      this.pedido.despachoExitoso = false;
      this.pedido.ventaExitosa = false;
      this.pedido.borrado = false;
      this.pedido.descuento = 0;
      this.pedido.totalFinal = this.total;
      this.pedido.nombreCliente = this.formatoCliente.value.nombre;


      let cliente = new Cliente(this.formatoCliente.value.nombre, this.formatoCliente.value.nit);
      this.clienteS.addCliente(cliente);
      this.pedidoS.addPedido(this.pedido).then(() => {
        console.log("exito")
        this.formatoCliente.reset();
        this.listaDespachosItems = [];
        this.total = 0;
       })
    .catch((error) => console.log(error));



  }


  cancelarPedido(){
    this.formatoCliente.reset();
    if( this.listaDespachosItems.length > 0 ){
        this.pedidoS.cancelarPedido(this.listaDespachosItems);
        this.listaDespachosItems = [];
        this.total = 0;
    }
  }

  eliminarItemTabla(keyItem:DespachoItems){
    let index:number = this.listaDespachosItems.indexOf(keyItem);
    console.log(index);
    let cantidad:number = this.listaDespachosItems[index].item.cantidad;
    let key:string = this.listaDespachosItems[index].keyItem;
    this.listaDespachosItems.splice(index,1);
    let itemAux:any;
    this.itemS.getItem(key).subscribe( (item:Item) => {
      itemAux = item;
    });
    setTimeout( ()=>{
      itemAux.cantidad += cantidad;
      this.itemS.updateItem(key, itemAux,null);
    },1000 )

  }

}
