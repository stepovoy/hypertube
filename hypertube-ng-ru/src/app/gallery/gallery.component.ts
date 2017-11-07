import {Component, OnInit, ViewChild} from '@angular/core';
import {GalleryPreviewComponent} from '../gallery-preview/gallery-preview.component';
import {expandCollapse, fade} from '../common/animations';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  animations: [
    fade,
    expandCollapse
  ]
})
export class GalleryComponent implements OnInit {

  @ViewChild(GalleryPreviewComponent) galleryPreview;

  title_filter: string;
  genre_filter: string;
  rating_filter_from: string;
  rating_filter_to: string;
  year_filter_from: string;
  year_filter_to: string;
  show_order_filters = false;
  title_order = true;
  genre_order = true;
  rating_order = true;
  year_order = true;

  constructor() {
  }

  show_hide_filters() {
    this.show_order_filters = !this.show_order_filters;
  }

  ngOnInit() {
  }


}
