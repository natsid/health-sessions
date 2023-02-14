import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatDividerModule,
        MatGridListModule,
        MatToolbarModule,
    ],
    exports: [
        CommonModule,
        MatCardModule,
        MatDividerModule,
        MatGridListModule,
        MatToolbarModule,
    ],
})
export class MaterialModule { }