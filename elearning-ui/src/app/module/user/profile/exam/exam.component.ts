import {Component, OnInit} from '@angular/core';
import {DatePipe, NgOptimizedImage} from '@angular/common';
import {EnrollCourseDTO} from '../../../../shared/model/EnrollCourseDTO';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ResponseData} from '../../../../shared/model/response-data.model';

@Component({
  selector: 'app-exam',
  imports: [
    NgOptimizedImage,
    DatePipe
  ],
  templateUrl: './exam.component.html',
  standalone: true,
  styleUrl: './exam.component.scss'
})
export class ExamComponent implements OnInit {
  dataPending: EnrollCourseDTO[] = [];
  dataApproved: EnrollCourseDTO[] = [];
  dataRejected: EnrollCourseDTO[] = [];

  constructor(protected http: HttpClient, protected toast: ToastrService) {
  }

  ngOnInit(): void {
    this.http.get<ResponseData<EnrollCourseDTO[]>>('api/student/course/my-course')
      .subscribe(res => {
        this.dataApproved = res.data.filter(e => e.enrollmentStatus.toUpperCase() === 'APPROVED');
        this.dataPending = res.data.filter(e => e.enrollmentStatus.toUpperCase() === 'PENDING');
        this.dataRejected = res.data.filter(e => e.enrollmentStatus.toUpperCase() === 'REJECTED');
      });
  }
}
