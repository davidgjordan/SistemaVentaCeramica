import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Pedido } from "../../models/Pedido";


@Injectable()
export class PedidoService{
private pedidoPath: FirebaseListObservable<Pedido[]> ;

constructor(db: AngularFireDatabase){
    this.pedidoPath = db.list("/pedidos");
}

public addPedido(pedido:Pedido){  
    return this.pedidoPath.push(pedido);
}

public getAllPedido(){
    return this.pedidoPath;
}


}