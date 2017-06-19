import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Almacen } from "../../../models/Almacen";
import { Item } from "../../../models/Item";
import { AlmacenService } from "../../../services/firebase-service/alamacen.service";

@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  providers:[AlmacenService]
})
export class AlmacenComponent implements OnInit {

  private agregarAlmacenButton:boolean = false;
  private almacen:Almacen = new  Almacen("");
  private formatoAlmacen:FormGroup;
  private listAlmacenes:Almacen[];

  constructor(private almacenS:AlmacenService) { 
    this.formatoAlmacen = new FormGroup({
      'nombre': new FormControl('', [Validators.required])
    })
  }

  ngOnInit() {
    this.almacenS.getAllAlmacen().subscribe( (almacenes) =>{
   

        this.listAlmacenes = almacenes;
        console.log(this.listAlmacenes);

    } );
  }
  guardarAlmacen(){
    console.log(this.formatoAlmacen.value);
    this.almacen.nombre = this.formatoAlmacen.value.nombre;
    this.almacen.items = new Array<Item>();
    this.almacenS.addAlmacen(this.almacen)
    .then( () => {
      console.log("alamacen agregado")
        this.almacen.nombre = "";
        this.agregarAlmacenButton = false;
    })
    .catch( (error) => console.error("Error", error) );

  }

}
