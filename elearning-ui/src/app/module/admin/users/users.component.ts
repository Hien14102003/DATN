import {Component, OnInit, signal} from '@angular/core';
import {StudentDTO} from '../../../shared/model/StudentDTO';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {PagingData, ResponseData} from '../../../shared/model/response-data.model';
import {PaginationComponent} from 'ngx-bootstrap/pagination';
import {FormsModule} from '@angular/forms';
import {debounceTime, Subject} from 'rxjs';

@Component({
  selector: 'app-users',
  imports: [
    PaginationComponent,
    FormsModule
  ],
  templateUrl: './users.component.html',
  standalone: true,
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  students: PagingData<StudentDTO> = new PagingData<StudentDTO>();
  key = signal('');
  searchSubject = new Subject<string>();

  constructor(
    protected http: HttpClient,
    protected toast: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.getData();
    this.searchSubject.pipe(
      debounceTime(500)
    ).subscribe(() => this.getData());
  }

  getData(): void {
    this.http.get<ResponseData<PagingData<StudentDTO>>>(`/api/user?page=${this.students.page}&size=${this.students.size}&key=${this.key()}`)
      .subscribe(rs => {
        if (rs.success) {
          this.students = rs.data;
        } else {
          this.toast.error(rs.message);
        }
      });
  }

  changeStatus(student: StudentDTO, status: string): void {
    const apiUrl = status === 'block' ? `api/user/block/${student.userId}` : `api/user/unblock/${student.userId}`;
    this.http.patch<ResponseData<any>>(apiUrl, {})
      .subscribe({
        next: res => {
          if (res.success) {
            this.toast.success('Change status successfully');
          } else {
            this.toast.error(res.message);
          }
        },
        error: err => {
          this.toast.error(err.message);
        },
        complete: () => {
          this.getData();
        }
      });
  }

  search(): void {
    this.searchSubject.next(this.key());
  }

  pageChanged(event: any): void {
    this.students.page = event.page;
    this.getData();
  }
}
