import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { CredentialDTO } from '../models/credential-dto'
import { Router } from '@angular/router'
import { ToastService } from './toast.service'
import { LoadingService } from './loading.service'
import { BehaviorSubject, Observable } from 'rxjs'
import { JwtHelperService } from '@auth0/angular-jwt'
import { StorageService } from './storage.service'

@Injectable()
export class AuthService {
  private _isloggedIn$ = new BehaviorSubject<boolean>(this.hasToken())

  private readonly URL: string = `${environment.urlApi}/api/v1/auth`

  constructor(
    private _httpClient: HttpClient,
    private _jwtHelper: JwtHelperService,
    private _router: Router,
    private _loadingService: LoadingService,
    private _storageService: StorageService,
    private _toastService: ToastService) { }

  get isLoggedIn(): Observable<boolean> {
    this.isAuthenticated() ? this._isloggedIn$.next(true) : this._isloggedIn$.next(false)
    return this._isloggedIn$.asObservable()
  }

  login(creds: CredentialDTO) {
    this._loadingService.show()
    return this._httpClient.post(`${this.URL}/login`, creds).subscribe({
      next: (resp: any) => {
        this.loginSuccessful(resp.token)
      },
      error: this.handleError.bind(this)
    }).add(() => this._loadingService.hide())
  }

  logout() {
    this._storageService.setLocalUser(null)
    this._isloggedIn$.next(false)
    this._router.navigate(['login'])
  }

  forgot(email: string) {
    return this._httpClient.put(`${this.URL}/forgot`, email)
  }

  private loginSuccessful(token: string | null) {
    if (!token) {
      this.logout()
    } else {
      const decodeToken = this._jwtHelper.decodeToken(token)

      if (!decodeToken) {
        this.logout()
      }

      let localUser = {
        token: token,
        name: decodeToken.nome,
        email: decodeToken.sub
      }

      this._storageService.setLocalUser(localUser)
      this._isloggedIn$.next(true)

      this._router.navigate(['home'])
    }
  }

  private hasToken(): boolean {
    return !!this._storageService.getLocalUser()
  }

  private isAuthenticated(): boolean {
    const localUser = this._storageService.getLocalUser()

    return localUser ? !this._jwtHelper.isTokenExpired(localUser.token) : false
  }

  private handleError(error: any) {
    this._toastService.showErrorToast('Login', 'Ocorreu um erro, tente novamente. Se o erro persistir entre em contato conosco.')
  }
}