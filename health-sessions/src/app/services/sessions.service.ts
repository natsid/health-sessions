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
   * had a given duration. The index represents the duration, e.g., result[10]
   * is the number of sessions that lasted for 10 units(?) of time.
   */
  getSessionDurationCounts() {
    if (this.durationCounts$ === undefined) {
      this.durationCounts$ = this.sessions$.pipe(
        map((sessions) => {
          // TODO: Is there a way to fill this array w/o finding the max
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
}
