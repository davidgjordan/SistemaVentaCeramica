import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forEach } from '@angular/router/src/utils/collection';
import { Item } from "../../../models/Item";
import { Almacen } from "../../../models/Almacen";
import { ItemService } from "../../../services/firebase-service/items.service";
import { AlmacenService } from "../../../services/firebase-service/alamacen.service";

@Component({
  selector: 'app-produccion',
  templateUrl: './produccion.component.html',
  providers: [ItemService, AlmacenService]
})
export class ProduccionComponent implements OnInit {
  private agregarItemButton: boolean = false;
  private mostrarItemButton: boolean = false;
  private item: Item = new Item("", 0, 0, 0, 0, "", "", "", false);
  private itemAux: Item = new Item("", 0, 0, 0, 0, "", "", "", false);
  private formatoItem: FormGroup;
  private imagen: File;
  private listAlmacenes: Almacen[];
  private listItem: Item[] = [];
  private itemKey: string = "";
  @ViewChild('cerrarModalEliminar') cerrarModalEliminar: ElementRef;

  private buttonGuardarrItem: boolean = false;
  private buttonActualizarCambiosItem: boolean = false;


  constructor(private itemS: ItemService, private almacenS: AlmacenService) {

    this.formatoItem = new FormGroup({
      'nombre': new FormControl('', Validators.required),
      'alto': new FormControl('', Validators.required),
      'ancho': new FormControl('', Validators.required),
      'cantidad': new FormControl('', Validators.required),
      'descripcion': new FormControl('', Validators.required),
      'tipoAlmacen': new FormControl('', Validators.required),
      'imagen': new FormControl('')
    });

  }

  ngOnInit() {
    this.almacenS.getAllAlmacen().subscribe((almacenes) => {
      this.listAlmacenes = almacenes;
    });

    this.itemS.getAllItem().subscribe((items) => {
      this.listItem = items;

      console.log(this.listItem);
    });
  }


  cargaImagen(event) {
    let file = event.srcElement.files;
    console.log(file);
    this.imagen = file[0];
  }
  guardarItem() {

    let datos = this.formatoItem.value;
    let itemAux: Item = new Item(datos.nombre, 0, datos.alto, datos.ancho, datos.cantidad, datos.descripcion, datos.tipoAlmacen, "imagen", false);

    this.itemS.addItem(itemAux, this.imagen);
    setTimeout(() => {
      this.agregarItemButton = false;
      this.formatoItem.reset();
    }, 2000)

  }

  setDetalleKey(itemkey: string) {
    this.itemS.getItem(itemkey).subscribe((item) => this.itemAux = item);
  }


  setEditKey(itemKey: string) {

    this.buttonActualizarCambiosItem = true;
    this.buttonGuardarrItem = false;
    this.itemKey = itemKey;
    this.agregarItemButton = true;
    this.itemS.getItem(itemKey).subscribe((item) => {
      this.item.imagen = null;
      this.item = item;
    });

  }
  //-------
  actualizarItem() {
      console.log("this.itemKey");
      console.log(this.itemKey);
      if( this.imagen){
        this.itemS.updateItem(this.itemKey, this.item, this.imagen);
      }else{
        this.itemS.updateItem(this.itemKey, this.item, null);    
      }
      setTimeout( () => {
        this.agregarItemButton = false;
      }, 1000 );


  }


  setRemoveKey(itemKey: string) {

    this.itemKey = itemKey;
    

  }

  eliminarItem() {
    this.itemS.removeItem(this.itemKey);
    this.cerrarModalEliminar.nativeElement.click();
  }

  habilitarDesabilitar() {

    this.buttonActualizarCambiosItem = false;
    this.buttonGuardarrItem = true;
    this.agregarItemButton = !this.agregarItemButton;
    this.formatoItem.reset();
  }

}
