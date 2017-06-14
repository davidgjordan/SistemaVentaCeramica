import { Item } from "./Item";

export class Almacen{

    constructor(private nombre:string
                , private items?:Item[] 
              ){

    }
    public getNombre() : string {
        return this.nombre;
    }
    
    public getitems() : Item[]  {
        return this.items;
    }

}