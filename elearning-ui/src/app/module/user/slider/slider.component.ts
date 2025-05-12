import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-slider',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './slider.component.html',
  standalone: true,
  styleUrl: './slider.component.scss'
})
export class SliderComponent {

}
