import {Component, signal} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {CommonModalComponent} from '../common-modal/common-modal.component';
import {LoginDTO} from '../../../../shared/model/LoginDTO';
import {FormsModule} from '@angular/forms';
import {AuthenticationService} from '../../../../shared/service/authentication.service';

@Component({
  selector: 'app-login-modal',
  imports: [
    NgOptimizedImage,
    FormsModule
  ],
  templateUrl: './login-modal.component.html',
  standalone: true,
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent {
  param: LoginDTO = new LoginDTO();

  constructor(
    protected http: HttpClient
    , protected toast: ToastrService
    , protected bsRef: BsModalRef
    , protected bsModal: BsModalService
    , protected authService: AuthenticationService
  ) {
  }

  openModal(action: string) {
    this.bsRef.hide();
    this.bsModal.show(CommonModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      initialState: {
        action: signal(action)
      }
    });
  }

  submit() {
    if (!this.param.email || !this.param.password) {
      this.toast.warning('Please enter email and password');
      return;
    }

    this.authService.loginV3(this.param)
      .subscribe(res => {
        if (res.success) {
          this.toast.success('Login successfully');
          this.authService.redirectHome();
        } else {
          this.toast.error(res.message);
        }
      });
  }
}
