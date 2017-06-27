import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { DespachoItems } from '../../models/Despacho';
import { Pedido } from '../../models/Pedido';
import { Item } from '../../models/Item';
import { ItemService } from "../firebase-service/items.service";


@Injectable()
export class PedidoService {
    private pedidoPath: FirebaseListObservable<Pedido[]>;

    constructor(private db: AngularFireDatabase, private itemS: ItemService) {
        this.pedidoPath = db.list("/pedidos");
    }

    public addPedido(pedido: Pedido) {
        return this.pedidoPath.push(pedido);
    }

    public getAllPedido() {
        return this.pedidoPath;
    }

    public getPedido( key: string){
        return this.db.object('/pedidos/'+key);
    }
   
    public updatePedido(key:string, newPedido:Pedido){
        return this.db.list('/pedidos/').update( key, newPedido );
    }

    public cancelarPedido(listaDespachoItems: DespachoItems[]) {

        let itemsA: any[];
        const r = this.itemS.getAllItem().subscribe((items: any[]) => {
            itemsA = items;
        });
        setTimeout(() => {
            for (let i = 0; i < listaDespachoItems.length; i++) {
                for (let x = 0; x < itemsA.length; x++) {
                    if (itemsA[x].$key == listaDespachoItems[i].keyItem) {
                        console.log("repetir");
                        itemsA[x].cantidad += listaDespachoItems[i].item.cantidad;
                        this.itemS.updateItem(itemsA[x].$key, itemsA[x], null);
                        break;
                    }
                }
            }
        }, 2000);
    }


}