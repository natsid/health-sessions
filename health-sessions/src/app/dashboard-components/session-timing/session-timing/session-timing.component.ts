import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { SessionsService } from 'src/app/services/sessions.service';
import { BaseChartDirective } from 'ng2-charts';
import { combineLatestWith } from 'rxjs';


const INDEX_OF_START_STOP_TIME_CHART = 0;
const INDEX_OF_DURATION_CHART = 1;

const TITLE_START_STOP_TIME = 'Health Session start and stop times';
const TITLE_DURATION = 'Health Session durations, in minutes';
const LABEL_NUM_SESSIONS = 'number of sessions';
const LABEL_START_TIME = 'sessions that started during this hour';
const LABEL_STOP_TIME = 'sessions that stopped during this hour';
const LABEL_TIME_OF_DAY = 'time of day';
const LABEL_DURATION = 'duration of session in minutes';

const COLOR_START_TIME = '#76D7C4';
const COLOR_STOP_TIME = '#F1948A';
const COLOR_DURATION = '#7FB3D5';

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
  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective> | undefined;

  public startStopTimeTitle = TITLE_START_STOP_TIME;
  public durationTitle = TITLE_DURATION;
  
  public barChartType: ChartType = 'bar';
  
  /* Chart data and options are set on initialization. */
  public sessionTimeChartData: ChartData<'bar'> = {datasets: []};
  public sessionTimeChartOptions: ChartConfiguration['options']|undefined;

  /* Chart data and options are set on initialization. */
  public sessionDurationChartData: ChartData<'bar'> = {datasets: []};
  public sessionDurationChartOptions: ChartConfiguration['options']|undefined;

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
              label: LABEL_START_TIME,
              backgroundColor: COLOR_START_TIME,
              borderColor: COLOR_START_TIME,
            });

            this.sessionTimeChartData.datasets.push({
              data: stopTimes,
              label: LABEL_STOP_TIME,
              backgroundColor: COLOR_STOP_TIME,
              borderColor: COLOR_STOP_TIME,
            });
            
            this.sessionTimeChartOptions = {
              responsive: true,
              plugins: {
                legend: {display: true},
                title: {text: TITLE_START_STOP_TIME}
              },
              scales: {
                x: {title: {display: true, text: LABEL_TIME_OF_DAY}},
                y: {title: {display: true, text: LABEL_NUM_SESSIONS}},
              }
            };

            this.charts?.get(INDEX_OF_START_STOP_TIME_CHART)?.update();
          },

          error: () => console.log('Error retrieving or processing start and stop times'),
        });
  }

  private getSessionDurationData() {
    this.sessionsService.getSessionDurationCounts()
        .subscribe({
          next: (durations) => {
            this.sessionDurationChartData.labels = durations.map((_, i) => i);

            this.sessionDurationChartData.datasets.push({
              data: durations,
              backgroundColor: COLOR_DURATION,
              borderColor: COLOR_DURATION,
            });

            this.sessionDurationChartOptions = {
              responsive: true,
              plugins: {
                legend: {display: false},
                title: {text: TITLE_DURATION}
              },
              scales: {
                x: {
                  title: {display: true, text: LABEL_DURATION},
                  min: durations.findIndex(duration => duration > 0),
                },
                y: {title: {display: true, text: LABEL_NUM_SESSIONS}},
              }
            };
            
            this.charts?.get(INDEX_OF_DURATION_CHART)?.update();
          },

          error: () => console.log('Error retrieving or processing session durations'),
        });
  }
}
