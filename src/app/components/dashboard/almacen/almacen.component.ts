import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Almacen } from "../../../models/Almacen";
import { Item } from "../../../models/Item";
import { AlmacenService } from "../../../services/firebase-service/alamacen.service";
import { ItemService } from "../../../services/firebase-service/items.service";



@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  providers: [AlmacenService, ItemService]
})
export class AlmacenComponent implements OnInit {

  private agregarAlmacenButton: boolean = false;
  private almacen: Almacen = new Almacen("");
  private formatoAlmacen: FormGroup;
  private listAlmacenes: Almacen[] = [];
  private listAllItems: Item[] = [];
  private keyItem:string ="";
  private item:Item = new Item("", 0, 0, 0, 0, "", "", "", false);;
  @ViewChild('cerrarModalAlmacen') cerrarModalAlmacen:ElementRef;

  constructor(private almacenS: AlmacenService, private itemS: ItemService) {
    this.formatoAlmacen = new FormGroup({
      'nombre': new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.almacenS.getAllAlmacen().subscribe((almacenes) => {


      this.listAlmacenes = almacenes;

    });

    this.itemS.getAllItem().subscribe((items) => {
      this.listAllItems = items;
      console.log(this.listAllItems)

    });
  }


  guardarAlmacen() {
    console.log(this.formatoAlmacen.value);
    this.almacen.nombre = this.formatoAlmacen.value.nombre;
    this.almacen.items = new Array<Item>();
    this.almacenS.addAlmacen(this.almacen)
      .then(() => {
        console.log("alamacen agregado")
        this.almacen.nombre = "";
        this.agregarAlmacenButton = false;
      })
      .catch((error) => console.error("Error", error));

  }

  setKeyCambiarAlmacen(itemKey:string){
    console.log(itemKey);

    this.keyItem = itemKey;
    this.itemS.getItem(this.keyItem).subscribe( (item) =>{
        this.item = item;
    } );
  }
  //recive el nuevo parametro de tipoAlmacen
  guardarCambiosAlmacen(cantidadPorMover:number, tipoAlmacen:string){
    let itemAux:any = this.item;
    console.log(itemAux._cantidad);
    if(cantidadPorMover<1){
        return;
    }
    if( itemAux._cantidad >= cantidadPorMover){
        this.itemS.getItemCambioAlmacen(itemAux, cantidadPorMover, this.keyItem, tipoAlmacen);

    }
    this.cerrarModalAlmacen.nativeElement.click();
  }

}
