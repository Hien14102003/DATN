import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {CourseQuizzUpsertComponent} from '../course/course-quizz-upsert/course-quizz-upsert.component';
import {CourseSyllabusUpsertComponent} from '../course/course-syllabus-upsert/course-syllabus-upsert.component';
import {DetailComponent} from '../course/detail/detail.component';
import {TabDirective, TabsetComponent} from 'ngx-bootstrap/tabs';
import {SyllabusComponent} from '../syllabus/syllabus.component';
import {CourseSyllabusComponent} from '../course/course-syllabus/course-syllabus.component';
import {Course} from '../../../shared/model/Course';
import {ResponseData} from '../../../shared/model/response-data.model';
import {DatePipe} from '@angular/common';
import {CourseQuizzComponent} from '../course/course-quizz/course-quizz.component';

@Component({
  selector: 'app-detail-course',
  imports: [
    CourseQuizzUpsertComponent,
    CourseSyllabusUpsertComponent,
    DetailComponent,
    TabDirective,
    TabsetComponent,
    SyllabusComponent,
    CourseSyllabusComponent,
    DatePipe,
    CourseQuizzComponent
  ],
  templateUrl: './detail-course.component.html',
  standalone: true,
  styleUrl: './detail-course.component.scss'
})
export class DetailCourseComponent implements OnInit {
  courseId = 0;
  data: Course = new Course();
  selectedTab: string = '';

  constructor(
    protected http: HttpClient,
    protected toast: ToastrService,
    protected route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.courseId = param['cid'];
      this.http.get<ResponseData<Course>>(`api/course/${this.courseId}`)
        .subscribe(res => {
          if (res.success) {
            this.data = res.data;
          } else {
            this.toast.error(res.message);
          }
        });
    });
  }

  onTabSelected(tabName: string) {
    this.selectedTab = tabName;
  }
}
