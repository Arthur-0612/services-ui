import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router'
import { map, Observable, take } from 'rxjs'
import { AuthService } from 'src/app/services/auth.service'
import { TokenService } from './token.service'

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private _authService: AuthService,
    private _tokenService: TokenService) { }

  canActivate(): Observable<boolean> {
    return this._authService.isLoggedIn.pipe(
      take(1),
      map((isLoggedIn: boolean) => {
        if (isLoggedIn && !this._tokenService.isAccountExpired()) {
          return true
        }

        this._authService.logout()
        return false
      })
    )
  }
}