import { Injectable } from '@angular/core'


@Injectable()
export class StorageService {

  getLocalUser() {
    let user = sessionStorage.getItem('LocalUser')

    if(!user){
      return null
    }

    return JSON.parse(user)
  }

  setLocalUser(localUser: any) {
    if(!localUser){
      sessionStorage.removeItem('LocalUser')
    }
    else{
      sessionStorage.setItem('LocalUser', JSON.stringify(localUser))
    }
  }
}
