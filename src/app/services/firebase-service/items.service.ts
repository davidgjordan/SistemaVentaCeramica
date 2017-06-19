import { Injectable } from "@angular/core";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Item } from "../../models/Item";

@Injectable()

export class ItemService{

private itemsPath: FirebaseListObservable<Item[]> ;

constructor(private db: AngularFireDatabase){
    this.itemsPath = db.list("/items");
}


public addItem(item:Item){  
    return this.itemsPath.push(item);
}

public getAllItem(){
    return this.itemsPath;
}

public getItem(key:string){
    return this.db.object("/items/"+key);
}


}