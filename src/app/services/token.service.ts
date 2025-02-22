import { Injectable } from '@angular/core'
import { JwtHelperService } from '@auth0/angular-jwt'
import { StorageService } from './storage.service'

@Injectable()
export class TokenService {

  dateToday: Date = new Date()
  isMobileDevice: boolean = false
  isTabletDevice: boolean = false

  constructor(private _jwtHelper: JwtHelperService, private _storageService: StorageService) { }

  decodeToken() {
    const localUser = this._storageService.getLocalUser()

    return this._jwtHelper.decodeToken(localUser.token)
  }

  isAccountExpired(): boolean {
    const dateExpiration = new Date(this.getDateExpiration())

    return dateExpiration < this.dateToday
  }

  private getDateExpiration() {
    const decodeToken = this.decodeToken()

    return decodeToken.exp * 1000
  }
}