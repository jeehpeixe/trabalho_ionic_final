import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router : Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      const expiry = localStorage.getItem('expiry') ? moment(localStorage.getItem('expiry')) : false;

      if (!(expiry && !moment().isAfter(expiry))) {
          localStorage.removeItem('usuario');
          localStorage.removeItem('expiry');
      }

      let user = localStorage.getItem('usuario');

      if (!user || user === 'undefined') {
        this.router.navigate(['/login']);
      }
      return true;
    }
}
