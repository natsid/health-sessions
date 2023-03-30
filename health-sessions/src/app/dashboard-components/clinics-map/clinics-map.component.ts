import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';

import { Clinic } from 'src/app/services/sessions.service';

@Component({
  selector: 'clinics-map',
  templateUrl: './clinics-map.component.html',
  styleUrls: ['./clinics-map.component.scss']
})
export class ClinicsMapComponent implements OnInit, AfterViewInit {
  clinics: Clinic[] = [];
  
  @ViewChild(GoogleMap) map!: GoogleMap;

  // TODO: Implement method on SessionsService to get list of markers (lat, long, name)
  ngOnInit(): void {
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

  ngAfterViewInit(){
    const bounds = this.getBounds(this.clinics);
    this.map.googleMap!.fitBounds(bounds);
  }

  /**
   * @param markers all the markers to be displayed
   * @returns appropriate bounds such that all markers are in view
   */
  getBounds(markers: any[]) {
    let north;
    let south;
    let east;
    let west;
  
    for (const marker of markers){
      // set the coordinates to marker's lat and lng on the first run.
      // if the coordinates exist, get max or min depends on the coordinates.
      north = north !== undefined ? Math.max(north, marker.position.lat) : marker.position.lat;
      south = south !== undefined ? Math.min(south, marker.position.lat) : marker.position.lat;
      east = east !== undefined ? Math.max(east, marker.position.lng) : marker.position.lng;
      west = west !== undefined ? Math.min(west, marker.position.lng) : marker.position.lng;
    };
  
    const bounds = { north, south, east, west };
  
    return bounds;
  }
}
