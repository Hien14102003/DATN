import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {MenuDTO} from '../../../../shared/model/MenuDTO';
import {AuthenticationService} from '../../../../shared/service/authentication.service';

@Component({
  selector: 'app-logo-menu',
  imports: [
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './logo-menu.component.html',
  standalone: true,
  styleUrl: './logo-menu.component.scss'
})
export class LogoMenuComponent implements OnInit {
  menus: MenuDTO[] = [];

  constructor(protected router: Router, protected auth: AuthenticationService) {
    this.menus = [
      new MenuDTO('Home', '/home'),
      new MenuDTO('About', '/about'),
      new MenuDTO('All Courses', '/course'),
    ];
    if (auth.isLoggedIn) {
      this.menus.push(new MenuDTO('Profile', '/profile'));
    }
  }

  ngOnInit(): void {
    this.menus.forEach(menu => {
      menu.active = this.router.url.includes(menu.url);
    });
  }

  navigate(menu: MenuDTO): void {
    this.menus.forEach(m => m.active = false);
    menu.active = true;
    this.router.navigate([menu.url]).then();
  }


}
