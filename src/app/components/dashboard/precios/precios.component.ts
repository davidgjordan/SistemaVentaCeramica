import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ItemService } from "../../../services/firebase-service/items.service";
import { Item } from "../../../models/Item";

@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  providers: [ItemService]
})
export class PreciosComponent implements OnInit {

  private listItems: Item[] = [];
  private keyItem: string = "";
  private item: Item = new Item("", 0, 0, 0, 0, "", "", "", false);
  @ViewChild('cerrarEditarPrecio') cerrarEditarPrecio: ElementRef;
  @ViewChild('precio') precio: ElementRef;

  constructor(private itemS: ItemService) { }

  ngOnInit() {
    this.itemS.getAllItem().subscribe((items: Item[]) => {
      this.listItems = items;
    });
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
      let precio:number = Number(precioStr);
    if (precio > 0) {

          this.itemS.getItem(this.keyItem).subscribe((item: Item) => {
              item.precio = precio;
              this.itemS.updateItem(this.keyItem, item, null);
              setTimeout( () =>{

                  this.precio.nativeElement.value = "";
                  this.cerrarEditarPrecio.nativeElement.click();
              }, 1000);
          });
    }else{
      console.log("Precio Invalido")
      return;
    }
  }





}
