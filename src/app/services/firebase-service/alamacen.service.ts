import { Injectable } from "@angular/core";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Almacen } from "../../models/Almacen";

@Injectable()

export class AlmacenService{

private almacenPath: FirebaseListObservable<Almacen[]> ;

constructor(db: AngularFireDatabase){
    this.almacenPath = db.list("/almacenes");
}


public addAlmacen(almacen:Almacen){  
    return this.almacenPath.push(almacen);
}

public getAllAlmacen(){
    return this.almacenPath;
}


}