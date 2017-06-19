
export class Item{

private _nombre:string;
private _precio:number;
private _alto:number;
private _ancho:number;
private _cantidad:number;
private _descripcion:string;
private _tipoALmacen:string;
private _imagen:string;
private _borrado:boolean;


    constructor( nombre:string
                , precio:number 
                ,  alto:number
                ,  ancho:number
                ,  cantidad:number
                ,  descripcion:string
                ,  tipoALmacen?:string
                , imagen?:string
                , borrado?:boolean){

            this._nombre = nombre ;
            this._precio = precio ;
            this._alto = alto ;
            this._ancho = ancho ;
            this._cantidad = cantidad ;
            this._descripcion = descripcion ;
            this._tipoALmacen = tipoALmacen ;
            this._imagen = imagen ;
            this._borrado = borrado ;

    }
    //geters
    get getNombre() : string {
        return this._nombre;
    }
    
    get getPrecio() : number {
        return this._precio;
    }
    get getAlto() : number {
        return this._alto;
    }
    get getAncho() : number {
        return this._ancho;
    }

    get getCantidad() : number {
        return this._cantidad;
    }
    
    get getDescripcion() : string {
        return this._descripcion;
    }
    get getTipoALmacen() : string {
        return this._tipoALmacen;
    }
     get getImagen() : string {
        return this._imagen;
    }
    get getBorrado() : boolean {
        return this._borrado;
    }

    //seters
    set setNombre(nombre:string){
         this._nombre = nombre;
    }
    set setPrecio(precio:number){
         this._precio = precio;
    }
    
    set setAlto(alto:number){
         this._alto = alto ;
    }
    set setAncho(ancho:number){
         this._ancho = ancho ;
    }

    set setCantidad(cantidad:number){
         this._cantidad = cantidad;
    }
    set setDescripcion(descripcion:string){
         this._descripcion = descripcion ;
    }
    
    set setTipoALmacen(tipoAlmacen:string){
         this._tipoALmacen = tipoAlmacen ;
    }
     set setImagen(imagen:string){
         this._imagen = imagen ;
    }

     set setBorrado(borrado:boolean){
         this._borrado = borrado ;
    }
}
