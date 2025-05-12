import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {PagingData, ResponseData} from '../../../shared/model/response-data.model';
import {Course} from '../../../shared/model/Course';
import {ToastrService} from 'ngx-toastr';
import {PaginationComponent} from 'ngx-bootstrap/pagination';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-course',
  imports: [
    PaginationComponent,
    FormsModule
  ],
  templateUrl: './course.component.html',
  standalone: true,
  styleUrl: './course.component.scss'
})
export class CourseComponent implements OnInit {
  data: PagingData<Course> = new PagingData<Course>();

  constructor(
    protected http: HttpClient,
    protected router: Router,
    protected toast: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.http.get<ResponseData<PagingData<Course>>>(`api/student/course?page=${this.data.page}&size=${this.data.size}`)
      .subscribe(res => {
        if (res.success) {
          this.data = res.data;
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

  pageChanged(event: any): void {
    this.data.page = event.page;
    this.getData();
  }
}
