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
        
        if (file != null) {

            let tareaSubidaImagen = this.storageRef.child('/imagenes/' + file.name).put(file).then((imagen) => {

                
                console.log("exitoso");
                item.imagen = imagen.downloadURL;
                item.borrado = false;
                this.itemsPath.push(item);

            });
        } else {
            this.itemsPath.push(item);

        }

    }

    public updateItem(key: string, item: Item, file: File) {
        console.log("key");
        console.log(key);
        if( file != null){
            let tareaSubidaNuevaImagen = this.storageRef.child('/imagenes/'+file.name).put(file).then( (imagen) =>{

                item.imagen = imagen.downloadURL;
                item.borrado = false;
                 return this.db.list('/items/').update(key,item).then( () => console.log("then entre")).catch( (error) =>console.log("cath entre"+error));
                 
            });
        }else{

             this.db.list('/items/').update(key, item).then( () => console.log("then entre")).catch( (error) =>console.log("cath entre"+error)); 
             
        }

    }

    public removeItem(key: string) {
        this.getItem(key).subscribe((data:Item) => {
            data.borrado = true;
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

    //-----------------------------------------------------------------------------------------------------------
    public getItemCambioAlmacen(itemRestado: Item) {

        const list = this.db.list('/items', {
            query: {
                //faltaba este para q busq la propiedad nombre en la lista de objetos 
                orderByChild: 'nombre',
                equalTo: itemRestado.nombre
            }
        });
        return list;

    }
//----------------------------------------------FIN--------------------------------------------------------

public removeItemDef(key: string) {
        return this.getItem(key).subscribe((data) => {
            data.borrado = true;
            console.log("Borrado exitoso");
            this.db.object('/items/' + key).remove().then( () => {
                console.log("borradoDef")
            } );
        });
    }






}