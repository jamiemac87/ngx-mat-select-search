/**
 * Copyright (c) 2018 Bithost GmbH All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatSelectSearchComponent } from './mat-select-search.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatSelectSearchClearDirective } from './mat-select-search-clear.directive';
import { ReactiveFormsModule } from '@angular/forms';
import * as i0 from "@angular/core";
export const MatSelectSearchVersion = '4.0.2';
export { MatSelectSearchClearDirective };
export class NgxMatSelectSearchModule {
}
NgxMatSelectSearchModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: NgxMatSelectSearchModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgxMatSelectSearchModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: NgxMatSelectSearchModule, declarations: [MatSelectSearchComponent,
        MatSelectSearchClearDirective], imports: [CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatTooltipModule], exports: [MatSelectSearchComponent,
        MatSelectSearchClearDirective] });
NgxMatSelectSearchModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: NgxMatSelectSearchModule, imports: [[
            CommonModule,
            ReactiveFormsModule,
            MatButtonModule,
            MatCheckboxModule,
            MatIconModule,
            MatProgressSpinnerModule,
            MatTooltipModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: NgxMatSelectSearchModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        ReactiveFormsModule,
                        MatButtonModule,
                        MatCheckboxModule,
                        MatIconModule,
                        MatProgressSpinnerModule,
                        MatTooltipModule
                    ],
                    declarations: [
                        MatSelectSearchComponent,
                        MatSelectSearchClearDirective
                    ],
                    exports: [
                        MatSelectSearchComponent,
                        MatSelectSearchClearDirective
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW1hdC1zZWxlY3Qtc2VhcmNoLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAvbWF0LXNlbGVjdC1zZWFyY2gvbmd4LW1hdC1zZWxlY3Qtc2VhcmNoLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDekUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzNELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUM5RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDcEYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7O0FBRXJELE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHLE9BQU8sQ0FBQztBQUM5QyxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsQ0FBQztBQXFCekMsTUFBTSxPQUFPLHdCQUF3Qjs7cUhBQXhCLHdCQUF3QjtzSEFBeEIsd0JBQXdCLGlCQVJqQyx3QkFBd0I7UUFDeEIsNkJBQTZCLGFBVjdCLFlBQVk7UUFDWixtQkFBbUI7UUFDbkIsZUFBZTtRQUNmLGlCQUFpQjtRQUNqQixhQUFhO1FBQ2Isd0JBQXdCO1FBQ3hCLGdCQUFnQixhQU9oQix3QkFBd0I7UUFDeEIsNkJBQTZCO3NIQUdwQix3QkFBd0IsWUFsQjFCO1lBQ1AsWUFBWTtZQUNaLG1CQUFtQjtZQUNuQixlQUFlO1lBQ2YsaUJBQWlCO1lBQ2pCLGFBQWE7WUFDYix3QkFBd0I7WUFDeEIsZ0JBQWdCO1NBQ2pCOzJGQVVVLHdCQUF3QjtrQkFuQnBDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osbUJBQW1CO3dCQUNuQixlQUFlO3dCQUNmLGlCQUFpQjt3QkFDakIsYUFBYTt3QkFDYix3QkFBd0I7d0JBQ3hCLGdCQUFnQjtxQkFDakI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLHdCQUF3Qjt3QkFDeEIsNkJBQTZCO3FCQUM5QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1Asd0JBQXdCO3dCQUN4Qiw2QkFBNkI7cUJBQzlCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTggQml0aG9zdCBHbWJIIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0U2VsZWN0U2VhcmNoQ29tcG9uZW50IH0gZnJvbSAnLi9tYXQtc2VsZWN0LXNlYXJjaC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWF0QnV0dG9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uJztcbmltcG9ydCB7IE1hdENoZWNrYm94TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY2hlY2tib3gnO1xuaW1wb3J0IHsgTWF0SWNvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xuaW1wb3J0IHsgTWF0UHJvZ3Jlc3NTcGlubmVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcHJvZ3Jlc3Mtc3Bpbm5lcic7XG5pbXBvcnQgeyBNYXRUb29sdGlwTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvdG9vbHRpcCc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBNYXRTZWxlY3RTZWFyY2hDbGVhckRpcmVjdGl2ZSB9IGZyb20gJy4vbWF0LXNlbGVjdC1zZWFyY2gtY2xlYXIuZGlyZWN0aXZlJztcbmltcG9ydCB7IFJlYWN0aXZlRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmV4cG9ydCBjb25zdCBNYXRTZWxlY3RTZWFyY2hWZXJzaW9uID0gJzQuMC4yJztcbmV4cG9ydCB7IE1hdFNlbGVjdFNlYXJjaENsZWFyRGlyZWN0aXZlIH07XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICBNYXRCdXR0b25Nb2R1bGUsXG4gICAgTWF0Q2hlY2tib3hNb2R1bGUsXG4gICAgTWF0SWNvbk1vZHVsZSxcbiAgICBNYXRQcm9ncmVzc1NwaW5uZXJNb2R1bGUsXG4gICAgTWF0VG9vbHRpcE1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXRTZWxlY3RTZWFyY2hDb21wb25lbnQsXG4gICAgTWF0U2VsZWN0U2VhcmNoQ2xlYXJEaXJlY3RpdmVcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIE1hdFNlbGVjdFNlYXJjaENvbXBvbmVudCxcbiAgICBNYXRTZWxlY3RTZWFyY2hDbGVhckRpcmVjdGl2ZVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE5neE1hdFNlbGVjdFNlYXJjaE1vZHVsZSB7XG59XG4iXX0=