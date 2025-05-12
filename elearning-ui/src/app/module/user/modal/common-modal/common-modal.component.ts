import {Component, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {NgOptimizedImage} from '@angular/common';
import {LoginModalComponent} from '../login-modal/login-modal.component';
import {RegisterModalComponent} from '../register-modal/register-modal.component';
import {ForgetModalComponent} from '../forget-modal/forget-modal.component';
import {CONSTANT} from '../../../../shared/constant';

@Component({
  selector: 'app-common-modal',
  imports: [
    NgOptimizedImage,
    LoginModalComponent,
    RegisterModalComponent,
    ForgetModalComponent
  ],
  templateUrl: './common-modal.component.html',
  standalone: true,
  styleUrl: './common-modal.component.scss'
})
export class CommonModalComponent {
  action = signal('login')

  constructor(
    protected http: HttpClient
    , protected toast: ToastrService
    , protected bsRef: BsModalRef
    , protected bsModal: BsModalService
  ) {
  }

  comingSoon() {
    console.log('Coming soon');
    this.toast.info('Coming soon', '', {progressBar: true});
  }

  loginWithSocial(provider: string) {
    switch (provider) {
      case 'google':
        window.location.href = `${CONSTANT.BE_URL_LOCAL}/api/oauth2/authorize/google?redirect_uri=${window.location.origin}/#/oauth2/redirect`;
        break;
      default:
        this.toast.warning(`Provider ${provider.toUpperCase()} will be available soon`);
        break;
    }
  }

}
