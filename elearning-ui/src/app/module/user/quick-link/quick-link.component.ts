import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-quick-link',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './quick-link.component.html',
  standalone: true,
  styleUrl: './quick-link.component.scss'
})
export class QuickLinkComponent {

}
