import { Component } from '@angular/core';

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
  // TODO: Update filter and startDate to be based on the data we get back.
  // Will need to use observables w/ async pipe in template.
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };
  startDate = new Date(2015, 0, 1);

  // TODO: Get each piece of data for a hard-coded date at first.

  constructor(private sessionsService: SessionsService) {
    sessionsService.getNumSessionsOnDate('2015-02-01 00:10:58').subscribe({
      next: numSessions => console.log(numSessions),
    });
    
    sessionsService.getAverageSessionDurationOnDate('2015-02-01 00:10:58').subscribe({
      next: averageDuration => console.log(averageDuration),
    });
  }
}
