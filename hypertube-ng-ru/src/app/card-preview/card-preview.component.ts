import {Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-card-preview',
  templateUrl: './card-preview.component.html',
  styleUrls: ['./card-preview.component.css']
})
export class CardPreviewComponent implements OnInit {
  @Input() id: number;
  @Input() title: string;
  @Input() year: number;
  @Input() rating: number;
  @Input() img_url: string;
  @Input() is_seen: boolean;
  @Input() genre: string;
  @Input() self: object;

  @ViewChild('movieImg') movoeImg;

  constructor(private router: Router,) {
  }

  ngOnInit() {
    this.resizeImg();
  }

  resizeImg() {
    let my_img = this.movoeImg;
    let width = my_img.nativeElement.clientWidth;
    my_img.nativeElement.style.height = width * 500 / 430 + 'px';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeImg();
  }

  public watch(event) {
    localStorage.setItem('movie', JSON.stringify(this.self));
    this.router.navigate(['/watch', this.id]);

  }
}
