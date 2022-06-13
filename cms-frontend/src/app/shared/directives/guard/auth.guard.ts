import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private sub: any;

  constructor(private router: Router,
    private userService: UserService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let isAdmin = next?.data?.isAdmin || false;
      if (!localStorage.getItem('user') || (isAdmin && !this.userService?.userDetails?.admin))  {
        this.router.navigate(['/home']);
        return false;
      }
      return true;
  }
  
}
