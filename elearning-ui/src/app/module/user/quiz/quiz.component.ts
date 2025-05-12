import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {QuestionDTO} from '../../../shared/model/QuestionDTO';
import {ResponseData} from '../../../shared/model/response-data.model';
import {FormsModule} from '@angular/forms';
import {QuizDetailDTO} from '../../../shared/model/QuizDetailDTO';

@Component({
  selector: 'app-quiz',
  imports: [
    FormsModule
  ],
  templateUrl: './quiz.component.html',
  standalone: true,
  styleUrl: './quiz.component.scss'
})
export class QuizComponent implements OnInit {
  quizId: number = 0;
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
      this.quizId = res['qid'];
      if (!this.quizId) {
        this.toast.error('Quiz not found');
        return;
      }
      this.http.get<ResponseData<QuizDetailDTO>>(`api/student/course/quiz/${this.quizId}`)
        .subscribe(res => {
          if (res.success) {
            this.data = res.data;
          } else {
            this.toast.error(res.message);
          }
        })
    });
  }

  submit() {
    const param = {
      quizId: this.data.quizId,
      answer: this.data.questions.map(q => {
        return {
          qid: q.questionId,
          ans: q.userAnswer
        }
      })
    };
    this.http.post<ResponseData<string>>('api/quizz/submit', param)
      .subscribe(res => {
        if (res.success) {
          this.toast.success('Submit success');
          this.router.navigate(['quiz/review'], {
            queryParams: {
              id: this.quizId
            }
          }).then();
        } else {
          this.toast.error(res.message);
        }
      });
  }
}
