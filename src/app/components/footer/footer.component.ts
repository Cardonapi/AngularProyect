import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  test: Date = new Date();

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log('[FooterComponent] ngOnDestroy called');
  }

}
