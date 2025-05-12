import {Component, signal} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {CommonModalComponent} from '../common-modal/common-modal.component';
import {RegisterDTO} from '../../../../shared/model/RegisterDTO';
import {FormsModule} from '@angular/forms';
import {ResponseData} from '../../../../shared/model/response-data.model';

@Component({
  selector: 'app-register-modal',
  imports: [
    NgOptimizedImage,
    FormsModule
  ],
  templateUrl: './register-modal.component.html',
  standalone: true,
  styleUrl: './register-modal.component.scss'
})
export class RegisterModalComponent {
  param: RegisterDTO = new RegisterDTO();

  constructor(
    protected http: HttpClient
    , protected toast: ToastrService
    , protected bsRef: BsModalRef
    , protected bsModal: BsModalService
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
    if (!this.param.email || !this.param.password || !this.param.rePassword || !this.param.firstName || !this.param.lastName) {
      this.toast.error('Please fill in all fields');
      return;
    }

    if (this.param.password !== this.param.rePassword) {
      this.toast.error('Password and Confirm Password must be the same');
      return;
    }

    this.http.post<ResponseData<string>>('api/auth/register', this.param)
      .subscribe({
        next: res => {
          if (res.success) {
            this.toast.success('Register successfully');
            this.openModal('login');
          } else {
            this.toast.error(res.message);
          }
        },
        error: err => {
          console.log(err)
          this.toast.error(err);
        }
      });
  }
}
