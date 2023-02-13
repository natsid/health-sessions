import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DayOverviewComponent } from './dashboard-components/day-overview/day-overview/day-overview.component';
import { SessionTimingComponent } from './dashboard-components/session-timing/session-timing/session-timing.component';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    DayOverviewComponent,
    SessionTimingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [
    Title,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
