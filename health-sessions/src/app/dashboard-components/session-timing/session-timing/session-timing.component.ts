import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { SessionsService } from 'src/app/services/sessions.service';
import { BaseChartDirective } from 'ng2-charts';
import { combineLatestWith } from 'rxjs';


const LABEL_START_TIME = 'sessions that started during this hour';
const LABEL_STOP_TIME = 'sessions that stopped during this hour';
const LABEL_NUM_SESSIONS = 'number of sessions';
const LABEL_TIME_OF_DAY = 'time of day';
const LABEL_DURATION = 'duration of session';


/**
 * Displays distributions of session timing:
 *  - distribution of session start time throughout a 24-hour day
 *  - distribution of session end time throughout a 24-hour day
 *  - distribution of session duration
 */
@Component({
  selector: 'session-timing',
  templateUrl: './session-timing.component.html',
  styleUrls: ['./session-timing.component.scss']
})
export class SessionTimingComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  
  public barChartType: ChartType = 'bar';
  public sessionTimeChartData: ChartData<'bar'> = {datasets: []};
  public sessionTimeChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {title: {display: true, text: LABEL_TIME_OF_DAY}},
      y: {title: {display: true, text: LABEL_NUM_SESSIONS}},
    }
  };
  public sessionDurationChartData: ChartData<'bar'> = {datasets: []};
  public sessionDurationChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {title: {display: true, text: LABEL_DURATION}},
      y: {title: {display: true, text: LABEL_NUM_SESSIONS}},
    }
  };

  constructor(private sessionsService: SessionsService) {}

  ngOnInit(): void {
    this.getSessionStartStopTimeData();
    this.getSessionDurationData();
  }

  private getSessionStartStopTimeData() {
    this.sessionsService.getSessionStartTimeCounts()
        .pipe(combineLatestWith(this.sessionsService.getSessionStopTimeCounts()))
        .subscribe({
          next: ([startTimes, stopTimes]) => {
            this.sessionTimeChartData.labels = startTimes.map((_, i) => i);

            this.sessionTimeChartData.datasets.push({
              data: startTimes,
              label: LABEL_START_TIME
            });

            this.sessionTimeChartData.datasets.push({
              data: stopTimes,
              label: LABEL_STOP_TIME
            });

            this.chart?.update();
          },
          error: () => console.log('Error retrieving or processing start times'),
        });
  }

  // TODO: Distribution of session durations
  private getSessionDurationData() {

  }
}
