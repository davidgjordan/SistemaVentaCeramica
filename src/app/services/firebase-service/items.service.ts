import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { equal } from 'assert';
import * as firebase from 'firebase';
import { Item } from "../../models/Item";

@Injectable()

export class ItemService {

    private itemsPath: FirebaseListObservable<Item[]>;
    private storageRef: firebase.storage.Reference;
    constructor(private db: AngularFireDatabase) {
        this.itemsPath = db.list("/items");
        this.storageRef = firebase.storage().ref();
    }


    public addItem(item: Item, file: File) {
        let itemAux: Item;
        if (file != null) {

            let tareaSubidaImagen = this.storageRef.child('/imagenes/' + file.name).put(file).then((imagen) => {

                itemAux = new Item(item.getNombre, item.getPrecio, item.getAlto,
                    item.getAncho, item.getCantidad, item.getDescripcion,
                    item.getTipoALmacen, imagen.downloadURL, false);
                console.log("exitoso");
                this.itemsPath.push(itemAux);

            });
        } else {
            this.itemsPath.push(item);

        }

    }

    public updateItem(key: string, item: Item, file: File) {


        return this.db.object('/items/' + key).update(item);

    }

    public removeItem(key: string) {
        this.getItem(key).subscribe((data) => {
            data._borrado = true;
            console.log("Borrado exitoso");
            this.db.object('/items/' + key).update(data);
        });
    }


    public getAllItem() {
        return this.itemsPath;
    }

    public getItem(key: string) {
        return this.db.object("/items/" + key);
    }
    //tambien aumente q nos mande el parametro key para poder mandarle al metodo actualizar y el parametro
    // tipoAl...para que sepamos a q almacen cambiar 
    public getItemCambioAlmacen(itemRestado: any, cantidad: number, key: string, tipoAlmacenCambio: string) {

        let alm = this.db.list('/items', {
            query: {
                //faltaba este para q busq la propiedad nombre en la lista de objetos 
                orderByChild: '_nombre',
                equalTo: itemRestado._nombre
            }
        });
        console.log("alm")
        console.log(alm);
        alm.subscribe((items) => {
            if (items) {

                console.log("item extraido antes if uno");
                console.log(items);
                console.log(itemRestado._nombre);
                items.forEach((itemSumado: any) => {
                    //si tienen el mismo nombre y sus tipos de almacen son distintos significa q el objeto existe en dos almacennes diferentes
                    if (itemRestado._tipoAlmacen != itemSumado._tipoAlmacen) {
                        console.log("item extraido if dos");
                        console.log(itemRestado);
                        //restamos la cantidad al objeto q nos pasan y actualizamos sus valores 
                        itemRestado._cantidad = cantidad;
                        this.updateItem(key, itemRestado, null);
                        //sumamos la cantidad al objeto del otro almacen y lo actualizamos con su propia key
                        itemSumado._cantidad + cantidad;
                        this.updateItem(itemSumado.$key, itemSumado, null);

                        //este return era para q una ves q actualize termine el ciclo for pero no me da.....
                        return;
                        ///si sus tipos de almacenes son iguales significa q solo hay un objeto
                    } else {

                        //le restamos la cantidad al objeto que quiere cambiarse de almacen y lo actualizamos 
                        itemRestado._cantidad -= cantidad;
                        this.updateItem(key, itemRestado, null);
                        //y ahora le damos la cantidad para poder pushearlo como un item nuevo en su nuevo almacen
                        itemRestado._tipoAlmacen = tipoAlmacenCambio;
                        itemRestado._cantidad = cantidad;
                        this.addItem(itemRestado, null);
                        //este return era para q una ves q actualize termine el ciclo for pero no me da.....
                        return;
                    }

                });
            } else {

            }
        });


    }



}