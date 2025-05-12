import {Component, signal} from '@angular/core';
import {InfoComponent} from './info/info.component';
import {ExamComponent} from './exam/exam.component';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {TransferFileService} from '../../../shared/service/transfer-file.service';
import {HttpClient} from '@angular/common/http';
import {ResponseData} from '../../../shared/model/response-data.model';
import {UserService} from '../../../shared/service/user.service';
import {HistoryQuizComponent} from './history-quiz/history-quiz.component';

@Component({
  selector: 'app-profile',
  imports: [
    InfoComponent,
    ExamComponent,
    NgOptimizedImage,
    NgClass,
    HistoryQuizComponent
  ],
  templateUrl: './profile.component.html',
  standalone: true,
  styleUrl: './profile.component.scss',
  providers: [TransferFileService]
})
export class ProfileComponent {
  mode = signal('info');

  constructor(protected fileService: TransferFileService, protected http: HttpClient, protected userService: UserService) {
  }

  changeAvatar(event: any) {
    this.fileService.processFileObs(event)
      .subscribe(file => {
        const formData = new FormData();
        formData.append('file', file.file);
        this.http.patch<ResponseData<string>>('api/user/change-avatar', formData)
          .subscribe(res => {
            if (res) {
              this.userService.getProfileData();
            }
          });
      });
  }
}
