import { Component, OnInit, ViewChild, ElementRef, DoCheck } from '@angular/core';
//services
import { ItemService } from "../../../services/firebase-service/items.service";
import { PrecioService } from "../../../services/firebase-service/precio.service";
//models
import { Item } from "../../../models/Item";
import { Precio } from "../../../models/Precio";

@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  providers: [ItemService, PrecioService]
})
export class PreciosComponent implements OnInit , DoCheck{

  private listItems: Item[] = [];
  private keyItem: string = "";
  private item: Item = new Item("", 0, 0, 0, 0, "", "", "", false);
  @ViewChild('cerrarEditarPrecio') cerrarEditarPrecio: ElementRef;
  @ViewChild('precio') precio: ElementRef;
  private nombreItemBuscar :string ="";
   private itemsAux: Item[] = [];

  constructor(private itemS: ItemService, private precioS: PrecioService) { }

  ngOnInit() {
    this.itemS.getAllItem().subscribe((items: Item[]) => {
      this.listItems = items;
      this.itemsAux = items;
    });
  }

  ngDoCheck(){
      this.buscarPorNombre();
  }


  setDetalleKey(itemKey: string) {
    this.itemS.getItem(itemKey).subscribe((item: Item) => {
      this.item = item;
    });
  }
  setEditKey(itemKey: string) {
    this.keyItem = itemKey;
    this.itemS.getItem(itemKey).subscribe((item: Item) => {
      this.item = item;
    });
  }

  editarPrecio(precioStr: number) {
    let precio: number = Number(precioStr);
    let itemAux:Item;
    if (precio > 0) {

      this.itemS.getItem(this.keyItem).subscribe((item: Item) => {

        itemAux = item;
        this.precio.nativeElement.value = "";
        this.cerrarEditarPrecio.nativeElement.click();
      });

      setTimeout(() => {

        let precioAnterior: number = itemAux.precio;
        itemAux.precio = precio;
        this.itemS.updateItem(this.keyItem, itemAux, null);
        let date = new Date();
        let dateStr: string = `${date.getDate()}:${date.getMonth() + 1}:${date.getFullYear()}`;
        let precioRegistro = new Precio(this.keyItem, precioAnterior, precio, dateStr);
        this.precioS.addPrecio(precioRegistro).then(() => console.log("precio agregado")).catch((error) => console.log("error precio" + error));


      }, 1000);


    } else {
      console.log("Precio Invalido")
      return;
    }
  }


buscarPorNombre(){
  
  console.log(this.nombreItemBuscar);
  if (this.nombreItemBuscar.length > 2) {
    this.nombreItemBuscar = this.nombreItemBuscar.toLowerCase();
    let itemsArrEncontrados: Item[] = [];
    for (let item of this.listItems) {
      let nombreItem: string = item.nombre.toLowerCase();
      if (nombreItem.indexOf(this.nombreItemBuscar) >= 0) {
        itemsArrEncontrados.push(item);
      }
    }
    if (itemsArrEncontrados.length > 0) {
      this.listItems = itemsArrEncontrados;
    } else {
      this.listItems = this.itemsAux;
    }
  } else {
    this.listItems = this.itemsAux;

  }
}



}
