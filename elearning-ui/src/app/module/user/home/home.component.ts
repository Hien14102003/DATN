import {Component} from '@angular/core';
import {SliderComponent} from '../slider/slider.component';
import {QuickLinkComponent} from '../quick-link/quick-link.component';
import {PopularCourseComponent} from '../popular-course/popular-course.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    SliderComponent,
    QuickLinkComponent,
    PopularCourseComponent
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(protected router: Router) {
  }


}
