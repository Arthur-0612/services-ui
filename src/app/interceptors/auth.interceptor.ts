import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { StorageService } from '../services/storage.service'
import { environment } from 'src/environments/environment'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _storageService: StorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let localUser = this._storageService.getLocalUser()

    let N = environment.urlApi.length
    let requestToAPI = req.url.substring(0, N) === environment.urlApi

    if (localUser && requestToAPI) {
      const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + localUser.token)})

      return next.handle(authReq)
    } else {
      return next.handle(req)
    }
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
}
