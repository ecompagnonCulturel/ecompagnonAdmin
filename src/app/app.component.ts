import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Ecompagnon Culturel';
  version:any;
  navLinks: any[];
  activeLinkIndex = -1;

  constructor (){



  }

  ngOnInit(): void {

  }

}
