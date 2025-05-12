import {Component, OnInit, signal} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {CommonModalComponent} from '../../modal/common-modal/common-modal.component';
import {AuthenticationService} from '../../../../shared/service/authentication.service';

@Component({
  selector: 'app-top-bar',
  imports: [],
  templateUrl: './top-bar.component.html',
  standalone: true,
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent implements OnInit {
  constructor(
    protected bsModal: BsModalService,
    protected authService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
  }

  openModal(action: string) {
    this.bsModal.show(CommonModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      initialState: {
        action: signal(action)
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
