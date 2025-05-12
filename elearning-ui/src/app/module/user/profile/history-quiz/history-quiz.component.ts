import {Component, OnInit} from '@angular/core';
import {DatePipe, NgOptimizedImage} from '@angular/common';
import {ResultDTO} from '../../../../shared/model/ResultDTO';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ResponseData} from '../../../../shared/model/response-data.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-history-quiz',
  imports: [
    DatePipe,
    NgOptimizedImage
  ],
  templateUrl: './history-quiz.component.html',
  standalone: true,
  styleUrl: './history-quiz.component.scss'
})
export class HistoryQuizComponent implements OnInit {
  data: ResultDTO[] = [];

  constructor(
    protected http: HttpClient,
    protected toast: ToastrService,
    protected router: Router
  ) {
  }

  ngOnInit(): void {
    this.http.get<ResponseData<ResultDTO[]>>('api/user/result')
      .subscribe(res => {
        if (res.success) {
          this.data = res.data;
        } else {
          this.toast.error(res.message);
        }
      });
  }

  review(id: number): void {
    this.router.navigate(['/quiz/review'], {
      queryParams: {
        id: id
      }
    }).then().catch(err => this.toast.error(err));
  }
}
