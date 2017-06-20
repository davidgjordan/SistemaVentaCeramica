import { Component, OnInit } from '@angular/core';
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
  private listItem: Item[]=[];

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

    console.log("this.formatoItem");
    console.log(this.formatoItem.value);
    let datos = this.formatoItem.value;
    let itemAux: Item = new Item(datos.nombre, 0, datos.alto, datos.ancho, datos.cantidad, datos.descripcion, datos.tipoAlmacen, "imagen", false);
    this.itemS.addItem(itemAux, this.imagen);
    setTimeout(() => {
      this.agregarItemButton = false;
      this.formatoItem.reset();
    }, 2000)

  }

  setDetalle(itemkey: string) {

    this.itemS.getItem(itemkey).subscribe((item) => this.itemAux = item);

  }
  setEdit(itemKey: string) {

  }
  setRemove(itemKey: string) {
    
  }


}
