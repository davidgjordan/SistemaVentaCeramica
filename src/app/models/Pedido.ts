import { Item } from "./Item";

export class Pedido{

    constructor(private idPedido:string
                , private idUser:string 
                , private nitCliente:string
                , private items:Item[]
                , private total:string
                , private exitoso:boolean){

    }
    public getIdPedido() : string {
        return this.idPedido;
    }
    
    public getIdUser() : string {
        return this.idUser;
    }
    public getNitCliente() : string {
        return this.nitCliente;
    }

    public getItems() : Item[] {
        return this.items;
    }

    public getTotal() : string {
        return this.total;
    }

    public getExitoso() : boolean {
        return this.exitoso;
    }
    

}