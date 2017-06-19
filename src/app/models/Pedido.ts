import { Item } from "./Item";

export class Pedido{

    constructor(private idUser:string 
                , private nitCliente:string
                , private items:Item[]
                , private total:number
                , private exitoso:boolean
                , private borrado?:boolean){

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

    public getTotal() : number {
        return this.total;
    }

    public getExitoso() : boolean {
        return this.exitoso;
    }
    

}