import {Routes} from '@angular/router';
import {UserLayoutComponent} from './module/user/user-layout/user-layout.component';
import {AdminLayoutComponent} from './module/admin/admin-layout/admin-layout.component';
import {AuthGuard} from './shared/guards/auth.guard';
import {profileResolver} from './shared/service/user.service';

export const routes: Routes = [
  {
    path: 'oauth2/redirect',
    loadComponent: () => import('./module/user/modal/oauth2/oauth2.component')
      .then((mod) => mod.Oauth2Component),
  },
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./module/user/home/home.component')
          .then(m => m.HomeComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./module/user/about/about.component')
          .then(m => m.AboutComponent)
      },
      {
        path: 'course',
        loadComponent: () => import('./module/user/course/course.component')
          .then(m => m.CourseComponent)
      },
      {
        path: 'course/detail',
        loadComponent: () => import('./module/user/course-detail/course-detail.component')
          .then(m => m.CourseDetailComponent)
      },
      {
        path: 'course/quiz',
        loadComponent: () => import('./module/user/quiz/quiz.component')
          .then(m => m.QuizComponent)
      },
      {
        path: 'quiz/review',
        resolve: {
          profile: profileResolver
        },
        loadComponent: () => import('./module/user/quiz/review/review.component')
          .then(m => m.ReviewComponent)
      },
      {
        path: 'profile',
        resolve: {
          profile: profileResolver
        },
        loadComponent: () => import('./module/user/profile/profile.component')
          .then(m => m.ProfileComponent),
        children: [
          {
            path: '',
            redirectTo: 'info',
            pathMatch: 'full'
          },
          {
            path: 'info',
            loadComponent: () => import('./module/user/profile/info/info.component')
              .then(m => m.InfoComponent)
          },
          {
            path: 'exam',
            loadComponent: () => import('./module/user/profile/exam/exam.component')
              .then(m => m.ExamComponent)
          }
        ]
      }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    resolve: {
      profile: profileResolver
    },
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./module/admin/home-admin/home-admin.component')
          .then(m => m.HomeAdminComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./module/admin/users/users.component')
          .then(m => m.UsersComponent)
      },
      {
        path: 'courses',
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
          },
          {
            path: 'list',
            loadComponent: () => import('./module/admin/course/course.component')
              .then(m => m.CourseComponent)
          },
          {
            path: 'upsert',
            loadComponent: () => import('./module/admin/course/course-detail/course-detail.component')
              .then(m => m.CourseDetailComponent)
          },
          {
            path: 'detail',
            loadComponent: () => import('./module/admin/detail-course/detail-course.component')
              .then(m => m.DetailCourseComponent)
          }
        ]
      },
      {
        path: 'enrollments',
        loadComponent: () => import('./module/admin/enrollments/enrollments.component')
          .then(m => m.EnrollmentsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'xch'
  }
];
