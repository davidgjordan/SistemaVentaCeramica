import { Injectable } from '@angular/core';
//ActivatedRouteSnapshot nos ayuda para saber cual es la pagina en la q esta y a la q se quiere mover
//RouterStateSnapshot para saber el estado actual
//CanActivate es como el ngoninit ace como una funcion q dice si puede activar esa ruta o no
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';

import { Auth } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate{

  constructor(private auth:Auth,
              private router:Router){
   }

canActivate( next:ActivatedRouteSnapshot, estate:RouterStateSnapshot  ){
    //llamamos al metodo q tiene el servicio q devuelve si esta autenticado o no
    //regresa el estado del token true o false si esta autenticado o no
    if(this.auth.authenticated()){
      console.log("El guard paso");
      return true;
    }else{
      console.error("Bloqueado por el guard");
      //con esto lo mandamos a la pantalla de home cuando no este autenticado
      this.router.navigate(['/home']);
      return false;
    }
}

}
