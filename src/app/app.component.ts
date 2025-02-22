import { Component } from '@angular/core'
import { AuthService } from './services/auth.service'

declare let $: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AL SISTEMAS LTDA'

  isLoggedIn = false

  constructor(
    private _authService: AuthService,) {
    this._authService.isLoggedIn.subscribe(log => { this.isLoggedIn = log })
  }
}
