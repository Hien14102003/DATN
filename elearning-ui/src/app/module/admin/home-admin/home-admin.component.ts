import {Component, OnInit} from '@angular/core';
import {ShareService} from '../../../shared/service/share.service';
import {EnrollmentsComponent} from '../enrollments/enrollments.component';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ResponseData} from '../../../shared/model/response-data.model';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartData} from 'chart.js';
import {CHART_OPTIONS} from '../../../shared/constant';
import {forkJoin} from 'rxjs';
import {Chart} from '../../../shared/model/Chart';

@Component({
  selector: 'app-home-admin',
  imports: [
    EnrollmentsComponent,
    BaseChartDirective
  ],
  templateUrl: './home-admin.component.html',
  standalone: true,
  styleUrl: './home-admin.component.scss'
})
export class HomeAdminComponent implements OnInit {
  data: DashboardDTO = {};
  public barChartOptions: ChartConfiguration<'bar'>['options'] = CHART_OPTIONS.bar;
  public barChartData: ChartData<'bar'> = CHART_OPTIONS.init;

  constructor(
    protected shareService: ShareService,
    protected http: HttpClient,
    protected toast: ToastrService
  ) {
  }

  ngOnInit(): void {
    forkJoin([
      this.http.get<ResponseData<DashboardDTO>>('api/dashboard'),
      this.http.get<ResponseData<Chart>>('api/dashboard/chart')
    ]).subscribe(([res1, res2]) => {
      if (res1.success) {
        this.data = res1.data;
      } else {
        this.toast.error(res1.message);
      }

      if (res2.success) {
        const datasets = [...res2.data.datasets];
        this.barChartData = {
          labels: [...res2.data.labels],
          datasets: datasets
        }
      } else {
        this.toast.error(res2.message);
      }
    });
  }
}

export interface DashboardDTO {
  totalCourses?: number;
  totalQuiz?: number;
  totalStudent?: number;
  totalLesson?: number;
}
