import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
    imports: [
        CommonModule,
        MatToolbarModule,
        MatGridListModule,
        MatCardModule,
    ],
    exports: [
        CommonModule,
        MatToolbarModule,
        MatGridListModule,
        MatCardModule,
    ],
})
export class MaterialModule { }