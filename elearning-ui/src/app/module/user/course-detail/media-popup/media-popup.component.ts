import {Component} from '@angular/core';
import {MediaLesson} from '../../../../shared/model/LessonDTO';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {PdfViewerModule} from 'ng2-pdf-viewer';

@Component({
  selector: 'app-media-popup',
  imports: [
    PdfViewerModule
  ],
  templateUrl: './media-popup.component.html',
  standalone: true,
  styleUrl: './media-popup.component.scss'
})
export class MediaPopupComponent {
  media: MediaLesson = new MediaLesson();

  constructor(
    protected bsRef: BsModalRef
  ) {
  }

  close() {
    this.bsRef.hide();
  }
}
