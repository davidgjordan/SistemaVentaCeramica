import { Injectable } from "@angular/core";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Item } from "../../models/Item";
import * as firebase from "firebase"; 

@Injectable()

export class ItemService{

private itemsPath: FirebaseListObservable<Item[]> ;
private storageRef:firebase.storage.Reference;
constructor(private db: AngularFireDatabase){
    this.itemsPath = db.list("/items");
    this.storageRef = firebase.storage().ref();
}


public addItem(item:Item, file:File){
    let itemAux:Item;
    let tareaSubidaImagen = this.storageRef.child('/imagenes/'+file.name).put(file).then( (imagen) => {

       itemAux = new Item(item.getNombre,item.getPrecio, item.getAlto, 
                                    item.getAncho, item.getCantidad,item.getDescripcion,
                                    item.getTipoALmacen,imagen.downloadURL,false);
                console.log("exitoso");
               this.itemsPath.push(itemAux);

               });

}

public updateItem(key:string, item:Item){
return this.db.object('/items/'+key).update(item);
}


public getAllItem(){
    return this.itemsPath;
}

public getItem(key:string){
    return this.db.object("/items/"+key);
}


}