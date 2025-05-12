import {Component, signal} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {CommonModalComponent} from '../common-modal/common-modal.component';
import {FormsModule} from '@angular/forms';
import {ResponseData} from '../../../../shared/model/response-data.model';

@Component({
  selector: 'app-forget-modal',
  imports: [
    NgOptimizedImage,
    FormsModule
  ],
  templateUrl: './forget-modal.component.html',
  standalone: true,
  styleUrl: './forget-modal.component.scss'
})
export class ForgetModalComponent {
  email: string = '';

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

  forget() {
    this.http.post<ResponseData<string>>('api/auth/forget-password', this.email)
      .subscribe(res => {
        if(res.success) {
          this.toast.success('Check your email for reset password link');
          this.openModal('login');
        } else {
          this.toast.error(res.message);
        }
      });
  }
}
