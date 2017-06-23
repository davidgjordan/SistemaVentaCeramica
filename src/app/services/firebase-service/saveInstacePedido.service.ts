import { Pedido } from '../../models/Pedido';

import { Injectable } from "@angular/core";

@Injectable()
export class SaveInstancePedido{

public pedido:Pedido;
public saveInstace(pedido:Pedido){

    this.pedido = pedido;
}

public getPedido(){


    if(this.pedido){

    return this.pedido;
    }else{
        return null;
    }
}

}