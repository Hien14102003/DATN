import {Component} from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {LeftMenuComponent} from '../left-menu/left-menu.component';
import {BreadCrumbComponent} from '../bread-crumb/bread-crumb.component';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthenticationService} from '../../../shared/service/authentication.service';
import {UserService} from '../../../shared/service/user.service';

@Component({
  selector: 'app-admin-layout',
  imports: [
    NgOptimizedImage,
    NgClass,
    LeftMenuComponent,
    BreadCrumbComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './admin-layout.component.html',
  standalone: true,
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

  constructor(
    protected auth: AuthenticationService,
    protected profile: UserService
  ) {
  }
}
