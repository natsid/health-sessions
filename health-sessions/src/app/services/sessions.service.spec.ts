import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { SessionsService } from './sessions.service';

describe('SessionsService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let sessionsService: SessionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
      ],
    });

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    sessionsService = TestBed.inject(SessionsService);
  });

  it('should be created', () => {
    expect(sessionsService).toBeTruthy();
  });

  // TODO: Add tests for cache logic.

  describe('getClinics', () => {
    it('returns list of unique clinics with their lat and lng coordinates', waitForAsync(() => {
      const expected = [
        {
          name: 'Apple Clinic',
          position: { lat: 42.366426, lng: -71.105495 }
        },
        {
          name: 'Banana Clinic',
          position: { lat: 42.370803, lng: -71.104412 }
        },
        {
          name: 'Canteloupe Clinic',
          position: { lat: 42.374035, lng: -71.101427 }
        },
      ];

      sessionsService.getClinics().subscribe({
        next: clinics => {
          expect(clinics)
            .withContext('expcted clinics')
            .toEqual(expected);
        },
      });

      respondWithMockData();
    }));
  });
  
  describe('getNumSessionsOnDate', () => {
    it('zero sessions on date', waitForAsync(() => {
      // See the top answer on the following post to understand why we must use the
      // '2015/02/01' format of date instead of '2015-02-01'.
      // https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
      const testDate = new Date('2015/12/01');
      const expected = 0;

      sessionsService.getNumSessionsOnDate(testDate).subscribe({
        next: numSessions => {
          expect(numSessions)
            .withContext('expcted number of sessions')
            .toEqual(expected);
        },
      });

      respondWithMockData();
    }));

    it('one session on date', waitForAsync(() => {
      const testDate = new Date('2015/02/01');
      const expected = 1;

      sessionsService.getNumSessionsOnDate(testDate).subscribe({
        next: numSessions => {
          expect(numSessions)
            .withContext('expcted number of sessions')
            .toEqual(expected);
        },
      });

      respondWithMockData();
    }));

    it('multiple sessions on same date', waitForAsync(() => {
      const testDate = new Date('2015/02/28');
      const expected = 3;
      
      sessionsService.getNumSessionsOnDate(testDate).subscribe({
        next: numSessions => {
          expect(numSessions)
            .withContext('expcted number of sessions')
            .toEqual(expected);
        },
      });

      respondWithMockData();
    }));
  });
  
  describe('getAverageDurationOnDate', () => {
    it('zero sessions on date', waitForAsync(() => {
      const testDate = new Date('2015/12/01');
      const expected = null;

      sessionsService.getAverageDurationOnDate(testDate).subscribe({
        next: numSessions => {
          expect(numSessions)
            .withContext('expcted average duration of sessions')
            .toEqual(expected);
        },
      });

      respondWithMockData();
    }));
    
    it('one session on date', waitForAsync(() => {
      const testDate = new Date('2015/02/01');
      const expected = 86;

      sessionsService.getAverageDurationOnDate(testDate).subscribe({
        next: numSessions => {
          expect(numSessions)
            .withContext('expcted average duration of sessions')
            .toEqual(expected);
        },
      });

      respondWithMockData();
    }));
    
    it('multiple sessions on date', waitForAsync(() => {
      const testDate = new Date('2015/02/28');
      const expected = 67;

      sessionsService.getAverageDurationOnDate(testDate).subscribe({
        next: numSessions => {
          expect(numSessions)
            .withContext('expcted average duration of sessions')
            .toEqual(expected);
        },
      });

      respondWithMockData();
    }));
  });
  
  describe('getAverageDistanceOnDate', () => {
    it('zero sessions on date', waitForAsync(() => {
      const testDate = new Date('2015/12/01');
      const expected = null;

      sessionsService.getAverageDistanceOnDate(testDate).subscribe({
        next: numSessions => {
          expect(numSessions)
            .withContext('expcted average distance traveled')
            .toEqual(expected);
        },
      });

      respondWithMockData();
    }));
    
    it('one session on date', waitForAsync(() => {
      const testDate = new Date('2015/02/01');
      const expected = 905;

      sessionsService.getAverageDistanceOnDate(testDate).subscribe({
        next: numSessions => {
          expect(numSessions)
            .withContext('expcted average distance traveled')
            .toEqual(expected);
        },
      });

      respondWithMockData();
    }));
    
    it('multiple sessions on date', waitForAsync(() => {
      const testDate = new Date('2015/02/28');
      const expected = 1272;

      sessionsService.getAverageDistanceOnDate(testDate).subscribe({
        next: numSessions => {
          expect(numSessions)
            .withContext('expcted average distance traveled')
            .toEqual(expected);
        },
      });

      respondWithMockData();
    }));
  });
  
  describe('getAverageAgeOnDate', () => {
    // TODO: Add test for birthYear NaN.

    it('zero sessions on date', waitForAsync(() => {
      const testDate = new Date('2015/12/01');
      const expected = null;

      sessionsService.getAverageAgeOnDate(testDate).subscribe({
        next: numSessions => {
          expect(numSessions)
            .withContext('expcted average age')
            .toEqual(expected);
        },
      });

      respondWithMockData();
    }));
    
    it('one session on date', waitForAsync(() => {
      const testDate = new Date('2015/02/01');
      const expected = 24;

      sessionsService.getAverageAgeOnDate(testDate).subscribe({
        next: numSessions => {
          expect(numSessions)
            .withContext('expcted average age')
            .toEqual(expected);
        },
      });

      respondWithMockData();
    }));
    
    it('multiple sessions on date', waitForAsync(() => {
      const testDate = new Date('2015/02/28');
      const expected = 40;

      sessionsService.getAverageAgeOnDate(testDate).subscribe({
        next: numSessions => {
          expect(numSessions)
            .withContext('expcted average age')
            .toEqual(expected);
        },
      });

      respondWithMockData();
    }));
  });
  
  describe('getSessionStartTimeCounts', () => {
    it('correctly counts start times', waitForAsync(() => {
      const expected: number[] = new Array<number>(24).fill(0);
      expected[13] = 2;
      expected[22] = 1;
      expected[23] = 1;

      sessionsService.getSessionStartTimeCounts().subscribe({
        next: numSessions => {
          expect(numSessions)
            .withContext('expcted session start time counts')
            .toEqual(expected);
        },
      });

      respondWithMockData();
    }));
  });

  describe('getSessionStopTimeCounts', () => {
    it('correctly counts stop times', waitForAsync(() => {
      const expected: number[] = new Array<number>(24).fill(0);
      expected[0] = 1;
      expected[15] = 2;
      expected[23] = 1;

      sessionsService.getSessionStopTimeCounts().subscribe({
        next: numSessions => {
          expect(numSessions)
            .withContext('expcted session stop time counts')
            .toEqual(expected);
        },
      });

      respondWithMockData();
    }));
  });

  describe('getSessionDurationCounts', () => {
    it('correctly counts session durations', waitForAsync(() => {
      const expected: number[] = new Array<number>(100).fill(0);
      expected[16] = 1;
      expected[86] = 2;
      expected[99] = 1;

      sessionsService.getSessionDurationCounts().subscribe({
        next: numSessions => {
          expect(numSessions)
            .withContext('expcted session duration counts')
            .toEqual(expected);
        },
      });

      respondWithMockData();
    }));
  });

  
  // Helper function that should be run at the bottom of most test blocks here.
  function respondWithMockData() {
      // The following `expectOne()` will match the request's URL.
      // If no requests or multiple requests matched that URL
      // `expectOne()` would throw.
      const req = httpTestingController.expectOne(SESSIONS_GET_URL);

      // Assert that the request is a GET.
      expect(req.request.method).toEqual('GET');

      // Respond with mock data, causing Observable to resolve.
      // Subscribe callback asserts that correct data was returned.
      req.flush(MOCK_RAW_SESSION_DATA);

      // Finally, assert that there are no outstanding requests.
      httpTestingController.verify();
  }
});

const SESSIONS_GET_URL = 'https://lo-interview.s3.us-west-2.amazonaws.com/health_sessions.json';

const MOCK_RAW_SESSION_DATA = [
  {
    'birth year': '1991',
    'clinic_id': 143,
    'clinic latitude': '42.366426',
    'clinic_longitude': '-71.105495',
    'clinic_name': 'Apple Clinic',
    'distance': 904.6142985828,
    'gender': 1,
    'provider_id': 768,
    'sessionduration': 86,
    'start_time': '2015-02-01 13:59:49',
    'stop_time': '2015-02-01 15:25:49',
    'usertype': 'Patient',
  },
  {
    'birth year': '1978',
    'clinic_id': 143,
    'clinic latitude': '42.366426',
    'clinic_longitude': '-71.105495',
    'clinic_name': 'Apple Clinic',
    'distance': 904.6142985828,
    'gender': 1,
    'provider_id': 1006,
    'sessionduration': 16,
    'start_time': '2015-02-28 23:47:42',
    'stop_time': '2015-03-01 00:03:42',
    'usertype': 'Patient',
  },
  {
    'birth year': '1990',
    'clinic_id': 156,
    'clinic latitude': '42.370803',
    'clinic_longitude': '-71.104412',
    'clinic_name': 'Banana Clinic',
    'distance': 1372.2887327726,
    'gender': 2,
    'provider_id': 1083,
    'sessionduration': 86,
    'start_time': '2015-02-28 22:11:56',
    'stop_time': '2015-02-28 23:37:56',
    'usertype': 'Subscriber',
  },
  {
    'birth year': '1956',
    'clinic_id': 141,
    'clinic latitude': '42.374035',
    'clinic_longitude': '-71.101427',
    'clinic_name': 'Canteloupe Clinic',
    'distance': 1539.0231745867,
    'gender': 1,
    'provider_id': 783,
    'sessionduration': 99,
    'start_time': '2015-02-28 13:49:02',
    'stop_time': '2015-02-28 15:28:02',
    'usertype': 'Subscriber',
  },
];
