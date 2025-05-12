import {Component, OnInit, signal} from '@angular/core';
import {Course} from '../../../shared/model/Course';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ActivatedRoute, Router} from '@angular/router';
import {ResponseData} from '../../../shared/model/response-data.model';
import {NgClass, NgOptimizedImage, NgStyle} from '@angular/common';
import {AuthenticationService} from '../../../shared/service/authentication.service';
import {CommonModalComponent} from '../modal/common-modal/common-modal.component';
import {ConfirmModalComponent} from '../../../common/confirm-modal/confirm-modal.component';
import {MediaLesson} from '../../../shared/model/LessonDTO';
import {MediaPopupComponent} from './media-popup/media-popup.component';
import {QuizDTO} from '../../../shared/model/QuizDTO';

@Component({
  selector: 'app-course-detail',
  imports: [
    NgOptimizedImage,
    NgStyle,
    NgClass
  ],
  templateUrl: './course-detail.component.html',
  standalone: true,
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {
  data: Course = new Course();
  courseId: number = 0;
  students: string[] = [];
  quizzes: QuizDTO[] = [];
  isExpired: boolean = false;

  constructor(
    protected http: HttpClient,
    protected toast: ToastrService,
    protected bsModal: BsModalService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected auth: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.courseId = param['cid'];
      if (!this.courseId) {
        this.toast.error('Course not found');
        this.router.navigate(['/course']).then();
        return;
      }
      this.getData();
    })
  }

  getData() {
    this.http.get<ResponseData<Course>>(`api/student/course/${this.courseId}`)
      .subscribe(res => {
        if (res) {
          this.data = res.data;
          this.isExpired = new Date(res.data.endDate).getTime() < new Date().getTime();
        } else {
          this.toast.error('Course not found');
          this.router.navigate(['/course']).then();
        }
      });

    this.http.get<ResponseData<string[]>>(`api/student/course/${this.courseId}/student`)
      .subscribe(res => {
        if (res.success) {
          this.students = res.data;
        } else {
          this.toast.error(res.message);
        }
      });

    this.http.get<ResponseData<QuizDTO[]>>(`api/student/course/${this.courseId}/quizzes`)
      .subscribe(res => {
        if (res.success) {
          this.quizzes = res.data;
        } else {
          this.toast.error(res.message);
        }
      });
  }

  enroll() {
    if (!this.auth.isLoggedIn) {
      this.toast.error('Please login to enroll');
      this.bsModal.show(CommonModalComponent, {
        class: 'modal-lg modal-dialog-centered',
        initialState: {
          action: signal('login')
        }
      });
      return;
    }

    this.bsModal.show(ConfirmModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      initialState: {
        title: 'Enroll',
        message: 'Do you want to enroll this course?'
      }
    }).content?.eventOut.subscribe(res => {
      if (res) {
        this.http.post<ResponseData<string>>(`api/enrollment?cid=${this.courseId}`, {})
          .subscribe(dt => {
            if (dt.success) {
              this.toast.success('Enroll success. Please wait for approval');
              this.getData();
            } else {
              this.toast.error(dt.message);
            }
          });
      }
    });
  }

  openMedia(item: MediaLesson) {
    if (item.type.includes('image')) {
      this.bsModal.show(MediaPopupComponent, {
        class: 'modal-dialog-centered',
        initialState: {
          media: item
        }
      })
    } else {
      this.openPdfFromBase64(item.urlBlob);
    }
  }

  openPdfFromBase64(base64String: string) {
    const byteCharacters = atob(base64String); // Giải mã Base64 về binary
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: 'application/pdf'}); // Tạo Blob PDF
    const blobUrl = URL.createObjectURL(blob); // Tạo URL từ Blob

    // Mở file PDF trong cửa sổ mới với iframe
    const newWindow = window.open('');
    newWindow?.document.write(`
    <iframe style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none;"
      src="${blobUrl}"></iframe>
  `);
  }

  doQuiz(quiz: QuizDTO) {
    this.router.navigate(['/course/quiz'], {
      queryParams: {
        qid: quiz.quizId
      }
    }).then();
  }
}
