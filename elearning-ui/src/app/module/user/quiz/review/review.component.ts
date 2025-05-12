import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {ResponseData} from '../../../../shared/model/response-data.model';
import {QuizDetailDTO} from '../../../../shared/model/QuizDetailDTO';
import {FormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-review',
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './review.component.html',
  standalone: true,
  styleUrl: './review.component.scss'
})
export class ReviewComponent implements OnInit {
  data: QuizDetailDTO = new QuizDetailDTO();

  constructor(
    protected http: HttpClient,
    protected toast: ToastrService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(res => {
      const id = res['id'];
      if (!id) {
        this.toast.error('Quiz not found');
        return;
      }
      this.http.get<ResponseData<QuizDetailDTO>>(`api/student/course/review/${id}`)
        .subscribe(res => {
          if (res.success) {
            this.data = res.data;
          } else {
            this.toast.error(res.message);
          }
        })
    });
  }
}
