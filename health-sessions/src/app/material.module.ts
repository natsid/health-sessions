import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatNativeDateModule } from '@angular/material/core'
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDividerModule,
        MatFormFieldModule,
        MatGridListModule,
        MatInputModule,
        MatToolbarModule,
    ],
    exports: [
        CommonModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDividerModule,
        MatFormFieldModule,
        MatGridListModule,
        MatInputModule,
        MatToolbarModule,
    ],
})
export class MaterialModule { }