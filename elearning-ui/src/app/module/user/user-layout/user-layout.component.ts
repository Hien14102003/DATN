import {Component} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {MobileMenuComponent} from '../mobile-menu/mobile-menu.component';
import {QuickLinkComponent} from '../quick-link/quick-link.component';
import {Router, RouterOutlet} from '@angular/router';
import {FooterComponent} from '../footer/footer.component';
import {SocialMediaShareComponent} from '../social-media-share/social-media-share.component';
import {AuthenticationService} from '../../../shared/service/authentication.service';

@Component({
  selector: 'app-user-layout',
  imports: [
    HeaderComponent,
    MobileMenuComponent,
    QuickLinkComponent,
    RouterOutlet,
    FooterComponent,
    SocialMediaShareComponent
  ],
  templateUrl: './user-layout.component.html',
  standalone: true,
  styleUrl: './user-layout.component.scss'
})
export class UserLayoutComponent {
  constructor(protected auth: AuthenticationService, protected router: Router) {
    if (auth.isAdmin) {
      router.navigate(['/admin']).then(_ => location.reload());
    }
  }
}
