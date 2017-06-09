

export class Usuario{

    constructor(private nombre:string
                , private correo:string 
                , private tipoUser:string
                , private idUser:string){

    }
    public getNombre() : string {
        return this.nombre;
    }
    
    public getCorreo() : string {
        return this.correo;
    }
    public getTipoUser() : string {
        return this.tipoUser;
    }
    public getIdUser() : string {
        return this.idUser;
    }
    

}