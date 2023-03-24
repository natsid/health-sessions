import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

// TODO: Move this interface to its own file.
interface HealthSession {
  sessionDuration?: number,
  startTime?: Date,
  stopTime?: Date,
  clinicId?: number,
  clinicName?: string,
  clinicLatitude?: string,
  clinicLongitude?: string,
  providerId?: number,
  userType?: "Subscriber"|"Patient",
  birthYear?: number|null,
  gender?: 0|1|2,
  distance?: number,
}

const NUM_HOURS_IN_DAY = 24;
const START_TIME = 'startTime';
const STOP_TIME = 'stopTime';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {
  /**
   * The Health Session JSON data processed into a list of HealthSessions.
   */
  private _sessions$: Observable<HealthSession[]>|undefined;
  private get sessions$() {
    if (this._sessions$ === undefined) {
      this._sessions$ =
          this.http.get<any[]>('https://lo-interview.s3.us-west-2.amazonaws.com/health_sessions.json')
              .pipe(map((result) => result.map(this.rawJsonToHealthSession)));
    }
    return this._sessions$;
  }

  private startTimeCounts$: Observable<number[]>|undefined;
  private stopTimeCounts$: Observable<number[]>|undefined;
  private durationCounts$: Observable<number[]>|undefined;

  constructor(private http: HttpClient) {}

  /**
   * @param queryDateString the date to query for number of sessions. Should
   *   be in format like '2000-01-31' or '2000-01-31T00:00:00'
   * @returns the number of sessions that either began or ended on the given
   *    date
   */
  getNumSessionsOnDate(queryDateString: string): Observable<number> {
    // TODO: save answers in cache map and lookup before performing expensive op
    return this.getSessionsOnDate(queryDateString).pipe(map(sessions => sessions.length));
  }

  /**
   * @param queryDateString the date to query for average session duration.
   *   Should be in format like '2000-01-31' or '2000-01-31T00:00:00'.
   * @returns the average duration of sessions on the given date, rounded to the
   *   nearest integer, e.g., 8.1 will round down to 8 and 8.6 will round up to 9
   */
  getAverageDurationOnDate(queryDateString: string): Observable<number|null> {
    // TODO: save answers in cache map and lookup before performing expensive op
    return this.getAverageValueOnDate(queryDateString, 'sessionDuration');
  }

  /**
   * @param queryDateString the date to query for average distanced traveled.
   *   Should be in format like '2000-01-31' or '2000-01-31T00:00:00'.
   * @returns the average distance traveled on the given date, rounded to the
   *   nearest integer, e.g., 8.1 will round down to 8 and 8.6 will round up to 9
   */
  getAverageDistanceOnDate(queryDateString: string): Observable<number|null> {
    // TODO: save answers in cache map and lookup before performing expensive op
    return this.getAverageValueOnDate(queryDateString, 'distance');
  }
 
  /**
   * @param queryDateString the date to query for average patient age.
   *   Should be in format like '2000-01-31' or '2000-01-31T00:00:00'.
   * @returns the average patient age on the given date, rounded to the nearest
   *   integer, e.g., 8.1 will round down to 8 and 8.6 will round up to 9
   */
  getAverageAgeOnDate(queryDateString: string): Observable<number|null> {
    return this.getSessionsOnDate(queryDateString).pipe(map(sessions => {
      // Get a list of field ages, filtering out sessions with undefined birth years or start times.
      const ages =
          sessions
              .filter(session => session !== undefined && session.birthYear !== undefined && session.startTime !== undefined)
              // Age = year of session - birth year
              .map(session => session.startTime!.getFullYear() - session.birthYear!);
        
        if (ages.length > 0) {
          const sumOfAges: number = ages.reduce((a, b) =>  a + b, 0);
          return Math.round(sumOfAges / ages.length);
        }
        
        // No sessions on the given date or undefined birth years.
        return null;
    }));
  }

  /**
   * Returns an Observable of the average value for the given field across all sessions
   * on the given date. If the given field is not of type number or if there are no
   * sessions on the given date, returns Observable<null>.
   */
  private getAverageValueOnDate(queryDateString: string, field: keyof HealthSession): Observable<number|null> {
    return this.getSessionsOnDate(queryDateString).pipe(map(sessions => {
      // Get a list of field values, filtering out sessions with undefined values.
      const values =
          sessions
              .filter(session => session !== undefined && session[field] !== undefined)
              .map(session => session[field]!);
        
        // Need to check the type of values[] since there are non-number members of HealthSession.
        if (values.length > 0 && typeof values[0] === 'number') {
          const sumOfValues: number = (values as number[]).reduce((a, b) =>  a + b, 0);
          return Math.round(sumOfValues / values.length);
        }
        
        // No sessions on the given date or field isn't of type number.
        return null;
    }));
  }
  
  /* 
   * @param queryDateString 
   * @returns an Observable of a list of health sessions that happened on the given date
   */
  private getSessionsOnDate(queryDateString: string): Observable<HealthSession[]> {
    const queryDate = SessionsService.convertStringToCorrectDate(queryDateString);
    return this.sessions$.pipe(
      map((sessions: HealthSession[]) => {
        return sessions.filter((session: HealthSession) => {
              return SessionsService.isSameDate(session.startTime, queryDate) ||
                     SessionsService.isSameDate(session.stopTime, queryDate)
         })
      }));
  }

  /**
   * @returns An array of counts representing the number of sessions that
   * started within each hour of a 24-hour day. The index represents the
   * hour, e.g., result[2] is the number of sessions that began within
   * the 02:00 hour.
   */
  getSessionStartTimeCounts() {
    if (this.startTimeCounts$ === undefined) {
      this.startTimeCounts$ = this.getHourCounts(START_TIME);
    }
    return this.startTimeCounts$;
  }

  /**
   * @returns An array of counts representing the number of sessions that
   * stopped within each hour of a 24-hour day. The index represents the
   * hour, e.g., result[2] is the number of sessions that began within
   * the 02:00 hour.
   */
  getSessionStopTimeCounts() {
    if (this.stopTimeCounts$ === undefined) {
      this.stopTimeCounts$ = this.getHourCounts(STOP_TIME);
    }
    return this.stopTimeCounts$;
  }
  
  /**
   * @returns An array of counts representing the number of sessions that
   * lasted each number of minutes. The index represents the duration, e.g.,
   * result[10] is the number of sessions that lasted for 10 minutes.
   */
  getSessionDurationCounts() {
    if (this.durationCounts$ === undefined) {
      this.durationCounts$ = this.sessions$.pipe(
        map((sessions) => {
          // TODO: Is there a good way to fill this array w/o finding the max
          // duration first?
          const maxDuration = sessions
              .filter((session) => session.sessionDuration !== undefined)
              .map((session) => session.sessionDuration!)
              .reduce((maxDuration, currentDuration) => {
                  return maxDuration > currentDuration? maxDuration : currentDuration;
              }, 0)

          // Length of array needs to be maxDuration + 1 so there is an index
          // for maxDuration itself.
          const counts = new Array<number>(maxDuration + 1).fill(0);
          sessions
              .filter((session) => session.sessionDuration !== undefined)
              .map((session) => counts[session.sessionDuration!] += 1);

          return counts;
        })
      );
    }

    return this.durationCounts$;
  }

  private getHourCounts(key: 'startTime'|'stopTime') {
    return this.sessions$.pipe(
      map((sessions) => {
        const counts = new Array<number>(NUM_HOURS_IN_DAY).fill(0);
        sessions
            .filter((session) =>
                session[key] !== undefined && session[key]?.getHours() !== undefined)
            .map((session) => counts[session[key]!.getHours()] += 1);
        return counts;
      })
    );
  }

  /**
   * @param rawSessionData raw JSON representing one health session
   * @returns a HealthSession populated with the given raw data
   */
  private rawJsonToHealthSession(rawSessionData: any): HealthSession {
    let healthSession: HealthSession = {};
    for (let key in rawSessionData) {
      switch (key) {
        case 'sessionduration':
          healthSession.sessionDuration = parseInt(rawSessionData[key]);
          break;
        case 'start_time':
          healthSession.startTime = new Date(rawSessionData[key]);
          break;
        case 'stop_time':
          healthSession.stopTime = new Date(rawSessionData[key]);
          break;
        case 'clinic_id':
          healthSession.clinicId = parseInt(rawSessionData[key]);
          break;
        case 'clinic_name':
          healthSession.clinicName = rawSessionData[key];
          break;
        case 'clinic latitude':
          healthSession.clinicLatitude = rawSessionData[key];
          break;
        case 'clinic_longitude':
          healthSession.clinicLongitude = rawSessionData[key];
          break;
        case 'provider_id':
          healthSession.providerId = rawSessionData[key];
          break;
        case 'usertype':
          healthSession.userType = rawSessionData[key];
          break;
        case 'birth year':
          healthSession.birthYear = parseInt(rawSessionData[key]);
          break;
        case 'gender':
          healthSession.gender = rawSessionData[key];
          break;
        case 'distance':
          healthSession.distance = parseFloat(rawSessionData[key]);
          break;
      
        default:
          break;
      }
    }
    return healthSession;
  }

  /**
   * See the top answer on the following post to understand why this is necessary:
   * https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
   * @param dateString a string like '2000-01-31' or '2000-01-31T00:00:00' to be
   *   converted to a Date object
   * @returns a Date corresponding to the given dateString
   */
  private static convertStringToCorrectDate(dateString: string): Date {
    return new Date(dateString.replace(/-/g, '\/').replace(/T.+/, ''));
  }

  /**
   * @param date1 a date to compare
   * @param date2 the other date to compare
   * @returns Whether date1 and date2 have the same year, month, and day
   *   of month. If either or both dates are undefined, returns false.
   */
  private static isSameDate(date1?: Date, date2?: Date): boolean {
    if (date1 === undefined || date2 === undefined) return false;
    return date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate();
  }
}
