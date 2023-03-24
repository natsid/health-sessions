import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable } from 'rxjs';

import { SessionsService } from 'src/app/services/sessions.service';

/**
 * For a specific day, shows a simple snapshot of the following data:
 *  - number of sessions
 *  - average length of a session
 *  - average distance traveled by patient
 *  - average age of patient
 */
@Component({
  selector: 'day-overview',
  templateUrl: './day-overview.component.html',
  styleUrls: ['./day-overview.component.scss']
})
export class DayOverviewComponent {
  // TODO: Create a helper in SessionService that provides the appropriate
  // date range instead of hardcoding dates here. 
  datePickerStartDate = new Date(2015, 1, 1);
  datePickerStopDate = new Date(2015, 2, 1);

  // TODO: In retrospect, I would just compute all of these at the same all
  // together in SessionsService since, in our use case, we always want to get
  // all pieces of the day overview.
  // Something like this.sessionsService.getDayOverview(date);
  numSessions$?: Observable<number>;
  averageDuration$?: Observable<number|null>;
  averageDistance$?: Observable<number|null>;
  averageAge$?: Observable<number|null>;

  constructor(private sessionsService: SessionsService) {
  }

  onDateInput(event: MatDatepickerInputEvent<Date>) {
    if (event.value !== null) {
      this.numSessions$ = this.sessionsService.getNumSessionsOnDate(event.value);
      this.averageDuration$ = this.sessionsService.getAverageDurationOnDate(event.value);
      this.averageDistance$ = this.sessionsService.getAverageDistanceOnDate(event.value);
      this.averageAge$ = this.sessionsService.getAverageAgeOnDate(event.value);
    }
  }
}
