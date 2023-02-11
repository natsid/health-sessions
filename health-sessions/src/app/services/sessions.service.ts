import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  constructor(private http: HttpClient) { }

  getJson() {
    return this.http.get('https://lo-interview.s3.us-west-2.amazonaws.com/health_sessions.json');
  }
}
