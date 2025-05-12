import {Component, OnInit} from '@angular/core';
import {Course} from '../../../shared/model/Course';
import {HttpClient} from '@angular/common/http';
import {ResponseData} from '../../../shared/model/response-data.model';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-popular-course',
  imports: [],
  templateUrl: './popular-course.component.html',
  standalone: true,
  styleUrl: './popular-course.component.scss'
})
export class PopularCourseComponent implements OnInit {
  dataLeft: Course[] = [];
  dataRight: Course[] = [];

  constructor(private http: HttpClient, protected toast: ToastrService, protected router: Router) {
  }

  ngOnInit(): void {
    this.http.get<ResponseData<Course[]>>('api/student/course/popular')
      .subscribe(res => {
        if (res.success) {
          const middle = Math.ceil(res.data.length / 2);
          this.dataLeft = res.data.slice(0, middle);
          this.dataRight = res.data.slice(middle, res.data.length);
        } else {
          this.toast.error(res.message);
        }
      });
  }

  detail(courseId: number): void {
    this.router.navigate(['/course/detail'], {
      queryParams: {
        cid: courseId
      }
    }).then();
  }
}
