import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SessionsService } from './services/sessions.service';

const TITLE = 'Health Sessions'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  constructor(private sessionsService: SessionsService,
    public title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(TITLE);

    this.sessionsService.getJson().subscribe({
      next: (response) => console.log(response),
      error: () => console.log('Request failed with error')
    });
  }
}
