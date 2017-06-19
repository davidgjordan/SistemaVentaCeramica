
export class Cliente {

    constructor(private nombre: string
        , private nit: string) { }


    public getNombre(): string {
        return this.nombre;
    }

    public getNit(): string {
        return this.nit;
    }

    public setNombre(nombre: string) {
        this.nombre = nombre;
    }
    public setNit(nit: string) {
        this.nit = nit;
    }

}