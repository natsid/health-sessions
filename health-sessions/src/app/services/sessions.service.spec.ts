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

  describe('getNumSessionsOnDate', () => {
    
    it('multiple sessions on same date', waitForAsync(() => {
      const testDate = '2015-02-28';
      const expectedNumSessionsOnDate = 2;
      
      sessionsService.getNumSessionsOnDate(testDate).subscribe({
        next: numSessions => {
          expect(numSessions)
            .withContext('expcted number of sessions')
            .toEqual(expectedNumSessionsOnDate);
        },
      });
      
      // The following `expectOne()` will match the request's URL.
      // If no requests or multiple requests matched that URL
      // `expectOne()` would throw.
      const req = httpTestingController.expectOne(SESSIONS_GET_URL);

      // Assert that the request is a GET.
      expect(req.request.method).toEqual('GET');

      // Respond with mock data, causing Observable to resolve.
      // Subscribe callback asserts that correct data was returned.
      req.flush(FAKE_RAW_SESSION_DATA);

      // Finally, assert that there are no outstanding requests.
      httpTestingController.verify();
    }));
    
    it('one session on date', waitForAsync(() => {
      const testDate = '2015-02-01';
      const expectedNumSessionsOnDate = 1;

      sessionsService.getNumSessionsOnDate(testDate).subscribe({
        next: numSessions => {
          expect(numSessions)
            .withContext('expcted number of sessions')
            .toEqual(expectedNumSessionsOnDate);
        },
      });
      
      const req = httpTestingController.expectOne(SESSIONS_GET_URL);
      expect(req.request.method).toEqual('GET');
      req.flush(FAKE_RAW_SESSION_DATA);
      httpTestingController.verify();
    }));
    
    it('zero sessions on date', waitForAsync(() => {
      const testDate = '2015-12-01';
      const expectedNumSessionsOnDate = 0;

      sessionsService.getNumSessionsOnDate(testDate).subscribe({
        next: numSessions => {
          expect(numSessions)
            .withContext('expcted number of sessions')
            .toEqual(expectedNumSessionsOnDate);
        },
      });
      
      const req = httpTestingController.expectOne(SESSIONS_GET_URL);
      expect(req.request.method).toEqual('GET');
      req.flush(FAKE_RAW_SESSION_DATA);
      httpTestingController.verify();
    }));
    
  });
});

const SESSIONS_GET_URL = 'https://lo-interview.s3.us-west-2.amazonaws.com/health_sessions.json';

const FAKE_RAW_SESSION_DATA = [
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
    'sessionduration': 84,
    'start_time': '2015-02-28 22:11:56',
    'stop_time': '2015-02-28 23:35:56',
    'usertype': 'Subscriber',
  },
];
