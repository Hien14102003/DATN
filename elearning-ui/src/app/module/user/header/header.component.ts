import {Component, OnInit} from '@angular/core';
import {LogoMenuComponent} from './logo-menu/logo-menu.component';
import {TopBarComponent} from './top-bar/top-bar.component';
import {Course} from '../../../shared/model/Course';
import {HttpClient} from '@angular/common/http';
import {PagingData, ResponseData} from '../../../shared/model/response-data.model';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    LogoMenuComponent,
    TopBarComponent,
    FormsModule
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  data: Course[] = [];
  selectedCourse: string = '';

  constructor(protected http: HttpClient, protected router: Router) {
  }

  ngOnInit(): void {
    this.http.get<ResponseData<PagingData<Course>>>('api/student/course?size=10000')
      .subscribe(res => {
        if (res.success) {
          this.data = res.data.contents;
        }
      });
  }

  submit() {
    const course = this.data.find(c => c.name === this.selectedCourse);
    this.router.navigate(['/course/detail'], {queryParams: {cid: course?.courseId}}).then();
  }
}
