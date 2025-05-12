import {Component} from '@angular/core';
import {CopyRightComponent} from './copy-right/copy-right.component';

@Component({
  selector: 'app-footer',
  imports: [
    CopyRightComponent
  ],
  templateUrl: './footer.component.html',
  standalone: true,
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
