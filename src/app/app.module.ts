import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HttpClientModule } from '@angular/common/http'
import { AuthService } from './services/auth.service'
import { TokenService } from './services/token.service'
import { JwtModule } from '@auth0/angular-jwt'
import { AuthGuard } from './services/auth.guard'
import { AuthInterceptorProvider } from './interceptors/auth.interceptor'
import { registerLocaleData } from '@angular/common'
import localePT from '@angular/common/locales/pt'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgxMaskModule } from 'ngx-mask'

registerLocaleData(localePT)

export function tokenGetter() {
  return sessionStorage.getItem('localUser')
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NgxMaskModule.forRoot(),
    BrowserModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [],
        disallowedRoutes: []
      }
    }),
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    AuthInterceptorProvider,
    AuthGuard,
    AuthService,
    TokenService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
