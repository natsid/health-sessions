import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleMapsModule } from '@angular/google-maps'
import { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DayOverviewComponent } from './dashboard-components/day-overview/day-overview.component';
import { SessionTimingComponent } from './dashboard-components/session-timing/session-timing.component';
import { MaterialModule } from './material.module';
import { ClinicsMapComponent } from './dashboard-components/clinics-map/clinics-map.component';

@NgModule({
  declarations: [
    AppComponent,
    DayOverviewComponent,
    SessionTimingComponent,
    ClinicsMapComponent
  ],
  imports: [
    BrowserModule,
    GoogleMapsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgChartsModule,
  ],
  providers: [
    Title,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
