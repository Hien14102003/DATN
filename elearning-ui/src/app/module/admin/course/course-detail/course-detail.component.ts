import {Component} from '@angular/core';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {DetailComponent} from '../detail/detail.component';
import {CourseSyllabusComponent} from '../course-syllabus/course-syllabus.component';
import {CourseSyllabusUpsertComponent} from '../course-syllabus-upsert/course-syllabus-upsert.component';
import {QuizComponent} from '../../../user/quiz/quiz.component';
import {CourseQuizzUpsertComponent} from '../course-quizz-upsert/course-quizz-upsert.component';
import {CourseQuizzComponent} from '../course-quizz/course-quizz.component';

@Component({
  selector: 'app-course-detail',
  imports: [
    TabsModule,
    DetailComponent,
    CourseSyllabusComponent,
    CourseSyllabusUpsertComponent,
    QuizComponent,
    CourseQuizzUpsertComponent,
    CourseQuizzComponent
  ],
  templateUrl: './course-detail.component.html',
  standalone: true,
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent {

}
