import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatCardModule,
    ],
    exports: [
        CommonModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatCardModule,
    ],
})
export class MaterialModule { }