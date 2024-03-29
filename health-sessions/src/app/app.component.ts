import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SessionsService } from './services/sessions.service';

const TITLE = 'Health Sessions'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private sessionsService: SessionsService,
    public title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(TITLE);
  }
}
