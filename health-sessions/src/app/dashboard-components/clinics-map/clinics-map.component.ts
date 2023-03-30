import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';

import { Clinic, SessionsService } from 'src/app/services/sessions.service';
import { MAPS_API_KEY } from './maps-api-key';

@Component({
  selector: 'clinics-map',
  templateUrl: './clinics-map.component.html',
  styleUrls: ['./clinics-map.component.scss']
})
export class ClinicsMapComponent implements OnInit {
  clinics: Clinic[] = [];
  
  @ViewChild(GoogleMap) set googleMap(googleMap: GoogleMap) {
    // The element won't exist until after the Maps API is loaded.
    if (googleMap) {
      this.fitMapBounds(googleMap);
    }
  }

  mapsApiLoaded: Observable<boolean>;

  /**
   * Important note: In order for the Maps API to be loaded, you must create
   * a maps-api-key.ts file that exports member MAPS_API_KEY which is a
   * valid Maps API key. Navigate to the following to find your keys:
   * https://console.cloud.google.com/google/maps-apis/credentials.
   */
  constructor(httpClient: HttpClient, private sessionsService: SessionsService) {
    // Lazy load the Maps API
    this.mapsApiLoaded = httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}`, 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
          shareReplay(),
        );
  }

  // TODO: Implement method on SessionsService to get list of markers (lat, long, name)
  ngOnInit(): void {
    this.sessionsService.getClinics().subscribe(
      (clinics: Clinic[]) =>  this.clinics.push(...clinics)
    );

    // TODO: remove
    this.clinics.push({
      position: {
        lat: 42.366426,
        lng: -71.105495,
      },
      name: 'Central Sq Post Office \/ Cambridge City Hall at Mass Ave \/ Pleasant St',
    },
    {
      position: {
        lat: 42.3581,
        lng: -71.093198,
      },
      name: 'MIT at Mass Ave \/ Amherst St',
    });
  }

  fitMapBounds(googleMap: GoogleMap) {
    const bounds = ClinicsMapComponent.getBounds(this.clinics);
    googleMap.googleMap!.fitBounds(bounds);
  }

  /**
   * @param clinics all the clinics to include; must have at least one
   *   element, else throws error
   * @returns appropriate NESW bounds such that all clinics are in view
   */
  static getBounds(clinics: Clinic[]) {
    if (clinics.length == 0) {
      throw Error('cannot get bounds because there are no elements in clinics');
    }

    let north = clinics[0].position.lat;
    let south = clinics[0].position.lat;
    let east = clinics[0].position.lng;
    let west = clinics[0].position.lng;
    
    for (let i = 1; i < clinics.length; i++) {
      north = Math.max(north, clinics[i].position.lat);
      south = Math.min(south, clinics[i].position.lat);
      east = Math.max(east, clinics[i].position.lng);
      west = Math.min(west, clinics[i].position.lng);
    };
 
    const bounds = { north, south, east, west };
  
    return bounds;
  }
}
