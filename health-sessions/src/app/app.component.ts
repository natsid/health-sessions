import { Component, OnInit } from '@angular/core';
import { SessionsService } from './services/sessions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'health-sessions';
  
  constructor(private sessionsService: SessionsService) { }

  ngOnInit(): void {
    this.sessionsService.getJson().subscribe({
      next: (response) => console.log(response),
      error: () => console.log('Request failed with error')
    });
  }
}
