import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DayOverviewComponent } from './dashboard-components/day-overview/day-overview/day-overview.component';
import { SessionTimingComponent } from './dashboard-components/session-timing/session-timing/session-timing.component';

@NgModule({
  declarations: [
    AppComponent,
    DayOverviewComponent,
    SessionTimingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
