
export class Item{

    constructor(private nombre:string
                , private precio:string 
                , private idItem:string
                , private alto:number
                , private ancho:number
                , private cantidad:string
                , private descripcion:string
                , private tipoALmacen:string){

    }
    public getNombre() : string {
        return this.nombre;
    }
    
    public getAlto() : number {
        return this.alto;
    }
    public getAncho() : number {
        return this.ancho;
    }
    public getPrecio() : string {
        return this.precio;
    }
    public getIdItem() : string {
        return this.idItem;
    }
    public getCantidad() : string {
        return this.cantidad;
    }
    
    public getTipoALmacen() : string {
        return this.tipoALmacen;
    }
    public getDescripcion() : string {
        return this.descripcion;
    }

}