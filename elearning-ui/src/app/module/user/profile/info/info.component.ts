import {Component, OnInit} from '@angular/core';
import {DatePipe, NgOptimizedImage} from '@angular/common';
import {UserService} from '../../../../shared/service/user.service';
import {FormsModule} from '@angular/forms';
import {BsDatepickerDirective, BsDatepickerInputDirective} from 'ngx-bootstrap/datepicker';
import {UserInfo} from '../../../../shared/model/profile.model';
import {HttpClient} from '@angular/common/http';
import {DateService} from '../../../../shared/service/date.service';

@Component({
  selector: 'app-info',
  imports: [
    NgOptimizedImage,
    DatePipe,
    FormsModule,
    BsDatepickerDirective,
    BsDatepickerInputDirective
  ],
  templateUrl: './info.component.html',
  standalone: true,
  styleUrl: './info.component.scss'
})
export class InfoComponent implements OnInit {
  editMode = false;
  userParam: UserInfo = new UserInfo();
  dob: Date = new Date();

  constructor(protected userService: UserService, protected http: HttpClient, protected dateService: DateService) {
  }

  edit(): void {
    this.editMode = true;
  }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.userParam = JSON.parse(JSON.stringify(this.userService.profile));
    this.dob = !!this.userParam.dob ? new Date(this.userParam.dob) : new Date();
  }

  update() {
    this.userParam.dob = this.dateService.getFormatDate(this.dob, 'yyyy-MM-dd');
    this.http.patch('api/user', this.userParam)
      .subscribe(res => {
        if (res) {
          this.editMode = false;
          this.userService.getProfileData()
            .subscribe(_ => {
              this.initData();
            });
        }
      });
  }
}
