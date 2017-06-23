import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Almacen } from "../../../models/Almacen";
import { Item } from "../../../models/Item";
import { AlmacenService } from "../../../services/firebase-service/alamacen.service";
import { ItemService } from "../../../services/firebase-service/items.service";
import { ISubscription } from "rxjs/Subscription";


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
  private keyItem: string = "";
  private item: Item = new Item("", 0, 0, 0, 0, "", "", "", false);;
  @ViewChild('cerrarModalAlmacen') cerrarModalAlmacen: ElementRef;

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
      console.log(this.listAllItems);

    });

  }


  guardarAlmacen() {
    console.log(this.formatoAlmacen.value);
    this.almacen.nombre = this.formatoAlmacen.value.nombre;
    this.almacenS.addAlmacen(this.almacen)
      .then(() => {
        console.log("alamacen agregado")
        this.almacen.nombre = "";
        this.agregarAlmacenButton = false;
      })
      .catch((error) => console.error("Error", error));

  }

  setKeyCambiarAlmacen(itemKey: string) {
    console.log(itemKey);

    this.keyItem = itemKey;
    this.itemS.getItem(this.keyItem).subscribe((item) => {
      this.item = item;
    });
  }
  //recive el nuevo parametro de tipoAlmacen
  guardarCambiosAlmacen(cM: number, tipoAlmacen: string) {
    let itemAux: Item = this.item;
    let ls: any[] = [];
      console.log("canti");
      console.log( typeof  cM);
    
    let cantidadPorMover:number = Number(cM);
     console.log("cantiMMM");
      console.log( typeof  cantidadPorMover);
    //si selecciona la cantidad menor o el tipo almacen igual al item seleecionado no acemos nada
    if (cantidadPorMover < 1 || tipoAlmacen == itemAux.tipoAlmacen) {
      console.log("menor a 0 o almacen igual")
      return;
    }
    //si la cantidad del item seleecionado es mayor a la cantidad a mover obtenemos la lista con los items q coincidan en nombre
    if (itemAux.cantidad >= cantidadPorMover) {
      this.itemS.getItemCambioAlmacen (itemAux ).subscribe((items:Item[]) => {
        console.log(items);
        ls = items;

      });
      
      //creamos un setT... de dos segundos para q espere q cargue la lista de los items y ya acerlo dentro del subscribe de arriba porq se convertia en un cicle
      setTimeout(() => {
        //si la lista tiene datos operamos
        if (ls) {
          console.log("primer if");
          let tam: number = ls.length;
          console.log(tam);
          //si el tamaño de la lista es de 1 significa q solo hay un item en todos los almacenes y procedemos a crear un 
          //nuevo item con su nuevo almacen y su nueva cantidad y actualizamos el item selleccionado 
          if (tam == 1) {
            console.log("segundo if");
            itemAux.cantidad -= cantidadPorMover;
            this.itemS.updateItem(this.keyItem, itemAux, null);
            //y ahora le damos la cantidad para poder pushearlo como un item nuevo en su nuevo almacen
            itemAux.tipoAlmacen = tipoAlmacen;
            itemAux.cantidad = cantidadPorMover;
            this.itemS.addItem(itemAux, null);
            //si el tamaño de la lista es mayor significa q el item existe en dos almacenes distintos
          } else {
            console.log("primer else");
            //iteramos por cada item en la lista
            for (let z = 0; z < ls.length; z++) {
              console.log("primer for");
              //si el tipoAlmacen dek item selleccionado es distinto al item de la lista y no esta borrado significa q encontramos el 
              //item a actualizar y actualizamos ambos items
              if (itemAux.tipoAlmacen != ls[z].tipoAlmacen && ls[z].borrado === false) {
                console.log("tercer if");
                //restamos la cantidad al objeto SELLECIONADO y actualizamos sus valores 
                itemAux.cantidad -= cantidadPorMover;
                this.itemS.updateItem(this.keyItem, itemAux, null);
                //sumamos la cantidad al objeto del otro almacen y lo actualizamos con su propia key
                //-----POR ALGUN MOTIVO SE VOLVIO STRING CREO Q PORQ ESTAMOS MANEJANDO ANY AMOR TUVE Q CONVERTIR PARA OPERAR------------
                              
                ls[z].cantidad += cantidadPorMover ;
                let itemAux2:Item = ls[z];
                this.itemS.updateItem(ls[z].$key, itemAux2, null);
                //podiamos aumentar un break para q solo entre aqui una ves
                //---------------------------------------------------------------
                //si el tipo almacen del item seleccionado es igual al tipo almacen del item de la lista y este esta borrado
                //significa que tenemos q crear otro item con su nuevo tipo de almacen y actualizar el seleccionado,
                //TAMBIEN EN VES DE CREAR OTRO PODRIAMOS RESCATAR EL ITEM BORRADO Y DARLE SU NUEVA CANTIDAD
              } else if (itemAux.tipoAlmacen != ls[z].tipoAlmacen && ls[z].borrado === true) {
                itemAux.cantidad -= cantidadPorMover;
                this.itemS.updateItem(this.keyItem, itemAux, null);
                //y ahora le damos la cantidad para poder pushearlo como un item nuevo en su nuevo almacen
                itemAux.tipoAlmacen = tipoAlmacen;
                itemAux.cantidad = cantidadPorMover;
                this.itemS.addItem(itemAux, null);
                setTimeout( ()=>{

                this.itemS.removeItemDef(ls[z].$key);
                }, 2000 );
                break;
              }
            }

          }


        } else {
          console.log("no hacemos nada error")
        }//
      }, 2000);




    } else {
      console.log("Cantidad Insuficiente");
    }

    this.cerrarModalAlmacen.nativeElement.click();
  }






}
