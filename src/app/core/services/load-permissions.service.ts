import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadPermissionsService {

  constructor() { }

  public loadPermissions(){
    let permissions = []
    if(localStorage.getItem('permissions')!=undefined){
      JSON.parse(localStorage.getItem('permissions')).forEach(element => {
        permissions.push(element.name)
      });
    }

    var promise = new Promise(function(resolve, reject) {
      resolve(permissions);
    });
    
    return promise;
  }
}
