/**
 * Copyright (c) 2018 Bithost GmbH All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, EventEmitter, forwardRef, HostBinding, Inject, Input, Optional, Output, ViewChild } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { _countGroupLabelsBeforeOption, MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatFormField } from '@angular/material/form-field';
import { A, DOWN_ARROW, END, ENTER, ESCAPE, HOME, NINE, SPACE, UP_ARROW, Z, ZERO, } from '@angular/cdk/keycodes';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { delay, filter, map, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { MatSelectSearchClearDirective } from './mat-select-search-clear.directive';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/scrolling";
import * as i2 from "@angular/cdk/a11y";
import * as i3 from "@angular/material/checkbox";
import * as i4 from "@angular/material/progress-spinner";
import * as i5 from "@angular/material/button";
import * as i6 from "@angular/material/icon";
import * as i7 from "@angular/common";
import * as i8 from "@angular/material/tooltip";
import * as i9 from "@angular/forms";
import * as i10 from "@angular/material/select";
import * as i11 from "@angular/material/core";
import * as i12 from "@angular/material/form-field";
/** The max height of the select's overlay panel. */
const SELECT_PANEL_MAX_HEIGHT = 256;
/* tslint:disable:member-ordering component-selector */
/**
 * Component providing an input field for searching MatSelect options.
 *
 * Example usage:
 *
 * interface Bank {
 *  id: string;
 *  name: string;
 * }
 *
 * @Component({
 *   selector: 'my-app-data-selection',
 *   template: `
 *     <mat-form-field>
 *       <mat-select [formControl]="bankCtrl" placeholder="Bank">
 *         <mat-option>
 *           <ngx-mat-select-search [formControl]="bankFilterCtrl"></ngx-mat-select-search>
 *         </mat-option>
 *         <mat-option *ngFor="let bank of filteredBanks | async" [value]="bank.id">
 *           {{bank.name}}
 *         </mat-option>
 *       </mat-select>
 *     </mat-form-field>
 *   `
 * })
 * export class DataSelectionComponent implements OnInit, OnDestroy {
 *
 *   // control for the selected bank
 *   public bankCtrl: FormControl = new FormControl();
 *   // control for the MatSelect filter keyword
 *   public bankFilterCtrl: FormControl = new FormControl();
 *
 *   // list of banks
 *   private banks: Bank[] = [{name: 'Bank A', id: 'A'}, {name: 'Bank B', id: 'B'}, {name: 'Bank C', id: 'C'}];
 *   // list of banks filtered by search keyword
 *   public filteredBanks: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);
 *
 *   // Subject that emits when the component has been destroyed.
 *   private _onDestroy = new Subject<void>();
 *
 *
 *   ngOnInit() {
 *     // load the initial bank list
 *     this.filteredBanks.next(this.banks.slice());
 *     // listen for search field value changes
 *     this.bankFilterCtrl.valueChanges
 *       .pipe(takeUntil(this._onDestroy))
 *       .subscribe(() => {
 *         this.filterBanks();
 *       });
 *   }
 *
 *   ngOnDestroy() {
 *     this._onDestroy.next();
 *     this._onDestroy.complete();
 *   }
 *
 *   private filterBanks() {
 *     if (!this.banks) {
 *       return;
 *     }
 *
 *     // get the search keyword
 *     let search = this.bankFilterCtrl.value;
 *     if (!search) {
 *       this.filteredBanks.next(this.banks.slice());
 *       return;
 *     } else {
 *       search = search.toLowerCase();
 *     }
 *
 *     // filter the banks
 *     this.filteredBanks.next(
 *       this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
 *     );
 *   }
 * }
 */
export class MatSelectSearchComponent {
    constructor(matSelect, changeDetectorRef, _viewportRuler, matOption = null, liveAnnouncer, matFormField = null) {
        this.matSelect = matSelect;
        this.changeDetectorRef = changeDetectorRef;
        this._viewportRuler = _viewportRuler;
        this.matOption = matOption;
        this.liveAnnouncer = liveAnnouncer;
        this.matFormField = matFormField;
        /** Label of the search placeholder */
        this.placeholderLabel = 'Suche';
        /** Type of the search input field */
        this.type = 'text';
        /** Label to be shown when no entries are found. Set to null if no message should be shown. */
        this.noEntriesFoundLabel = 'Keine Optionen gefunden';
        /**
         *  Text that is appended to the currently active item label announced by screen readers,
         *  informing the user of the current index, value and total options.
         *  eg: Bank R (Germany) 1 of 6
        */
        this.indexAndLengthScreenReaderText = ' of ';
        /**
          * Whether or not the search field should be cleared after the dropdown menu is closed.
          * Useful for server-side filtering. See [#3](https://github.com/bithost-gmbh/ngx-mat-select-search/issues/3)
          */
        this.clearSearchInput = true;
        /** Whether to show the search-in-progress indicator */
        this.searching = false;
        /** Disables initial focusing of the input field */
        this.disableInitialFocus = false;
        /** Enable clear input on escape pressed */
        this.enableClearOnEscapePressed = false;
        /**
         * Prevents home / end key being propagated to mat-select,
         * allowing to move the cursor within the search input instead of navigating the options
         */
        this.preventHomeEndKeyPropagation = false;
        /** Disables scrolling to active options when option list changes. Useful for server-side search */
        this.disableScrollToActiveOnOptionsChanged = false;
        /** Adds 508 screen reader support for search box */
        this.ariaLabel = 'dropdown search';
        /** Whether to show Select All Checkbox (for mat-select[multi=true]) */
        this.showToggleAllCheckbox = false;
        /** select all checkbox checked state */
        this.toggleAllCheckboxChecked = false;
        /** select all checkbox indeterminate state */
        this.toggleAllCheckboxIndeterminate = false;
        /** Display a message in a tooltip on the toggle-all checkbox */
        this.toggleAllCheckboxTooltipMessage = '';
        /** Define the position of the tooltip on the toggle-all checkbox. */
        this.toogleAllCheckboxTooltipPosition = 'below';
        /** Show/Hide the search clear button of the search input */
        this.hideClearSearchButton = false;
        /**
         * Always restore selected options on selectionChange for mode multi (e.g. for lazy loading/infinity scrolling).
         * Defaults to false, so selected options are only restored while filtering is active.
         */
        this.alwaysRestoreSelectedOptionsMulti = false;
        /** Output emitter to send to parent component with the toggle all boolean */
        this.toggleAll = new EventEmitter();
        this.onTouched = (_) => { };
        this._options$ = new BehaviorSubject(null);
        this.optionsList$ = this._options$.pipe(switchMap(_options => _options ?
            _options.changes.pipe(map(options => options.toArray()), startWith(_options.toArray())) : of(null)));
        this.optionsLength$ = this.optionsList$.pipe(map(options => options ? options.length : 0));
        this._formControl = new FormControl('');
        /** whether to show the no entries found message */
        this._showNoEntriesFound$ = combineLatest([
            this._formControl.valueChanges,
            this.optionsLength$
        ]).pipe(map(([value, optionsLength]) => this.noEntriesFoundLabel && value
            && optionsLength === this.getOptionsLengthOffset()));
        /** Subject that emits when the component has been destroyed. */
        this._onDestroy = new Subject();
    }
    get isInsideMatOption() {
        return !!this.matOption;
    }
    /** Current search value */
    get value() {
        return this._formControl.value;
    }
    /** Reference to the MatSelect options */
    set _options(_options) {
        this._options$.next(_options);
    }
    get _options() {
        return this._options$.getValue();
    }
    ngOnInit() {
        // set custom panel class
        const panelClass = 'mat-select-search-panel';
        if (this.matSelect.panelClass) {
            if (Array.isArray(this.matSelect.panelClass)) {
                this.matSelect.panelClass.push(panelClass);
            }
            else if (typeof this.matSelect.panelClass === 'string') {
                this.matSelect.panelClass = [this.matSelect.panelClass, panelClass];
            }
            else if (typeof this.matSelect.panelClass === 'object') {
                this.matSelect.panelClass[panelClass] = true;
            }
        }
        else {
            this.matSelect.panelClass = panelClass;
        }
        // set custom mat-option class if the component was placed inside a mat-option
        if (this.matOption) {
            this.matOption.disabled = true;
            this.matOption._getHostElement().classList.add('contains-mat-select-search');
        }
        else {
            console.error('<ngx-mat-select-search> must be placed inside a <mat-option> element');
        }
        // when the select dropdown panel is opened or closed
        this.matSelect.openedChange
            .pipe(delay(1), takeUntil(this._onDestroy))
            .subscribe((opened) => {
            if (opened) {
                this.updateInputWidth();
                // focus the search field when opening
                if (!this.disableInitialFocus) {
                    this._focus();
                }
            }
            else {
                // clear it when closing
                if (this.clearSearchInput) {
                    this._reset();
                }
            }
        });
        // set the first item active after the options changed
        this.matSelect.openedChange
            .pipe(take(1))
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
            if (this.matSelect._keyManager) {
                this.matSelect._keyManager.change.pipe(takeUntil(this._onDestroy))
                    .subscribe(() => this.adjustScrollTopToFitActiveOptionIntoView());
            }
            else {
                console.log('_keyManager was not initialized.');
            }
            this._options = this.matSelect.options;
            // Closure variable for tracking the most recent first option.
            // In order to avoid avoid causing the list to
            // scroll to the top when options are added to the bottom of
            // the list (eg: infinite scroll), we compare only
            // the changes to the first options to determine if we
            // should set the first item as active.
            // This prevents unnecessary scrolling to the top of the list
            // when options are appended, but allows the first item
            // in the list to be set as active by default when there
            // is no active selection
            let previousFirstOption = this._options.toArray()[this.getOptionsLengthOffset()];
            this._options.changes
                .pipe(takeUntil(this._onDestroy))
                .subscribe(() => {
                // avoid "expression has been changed" error
                setTimeout(() => {
                    // Convert the QueryList to an array
                    const options = this._options.toArray();
                    // The true first item is offset by 1
                    const currentFirstOption = options[this.getOptionsLengthOffset()];
                    const keyManager = this.matSelect._keyManager;
                    if (keyManager && this.matSelect.panelOpen) {
                        // set first item active and input width
                        // Check to see if the first option in these changes is different from the previous.
                        const firstOptionIsChanged = !this.matSelect.compareWith(previousFirstOption, currentFirstOption);
                        // CASE: The first option is different now.
                        // Indiciates we should set it as active and scroll to the top.
                        if (firstOptionIsChanged
                            || !keyManager.activeItem
                            || !options.find(option => this.matSelect.compareWith(option, keyManager.activeItem))) {
                            keyManager.setFirstItemActive();
                        }
                        // wait for panel width changes
                        setTimeout(() => {
                            this.updateInputWidth();
                        });
                        if (!this.disableScrollToActiveOnOptionsChanged) {
                            this.adjustScrollTopToFitActiveOptionIntoView();
                        }
                    }
                    // Update our reference
                    previousFirstOption = currentFirstOption;
                });
            });
        });
        // add or remove css class depending on whether to show the no entries found message
        // note: this is hacky
        this._showNoEntriesFound$.pipe(takeUntil(this._onDestroy)).subscribe(showNoEntriesFound => {
            // set no entries found class on mat option
            if (this.matOption) {
                if (showNoEntriesFound) {
                    this.matOption._getHostElement().classList.add('mat-select-search-no-entries-found');
                }
                else {
                    this.matOption._getHostElement().classList.remove('mat-select-search-no-entries-found');
                }
            }
        });
        // resize the input width when the viewport is resized, i.e. the trigger width could potentially be resized
        this._viewportRuler.change()
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
            if (this.matSelect.panelOpen) {
                this.updateInputWidth();
            }
        });
        this.initMultipleHandling();
        this.optionsList$.pipe(takeUntil(this._onDestroy)).subscribe(() => {
            // update view when available options change
            this.changeDetectorRef.markForCheck();
        });
    }
    _emitSelectAllBooleanToParent(state) {
        this.toggleAll.emit(state);
    }
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
    _isToggleAllCheckboxVisible() {
        return this.matSelect.multiple && this.showToggleAllCheckbox;
    }
    /**
     * Handles the key down event with MatSelect.
     * Allows e.g. selecting with enter key, navigation with arrow keys, etc.
     * @param event
     */
    _handleKeydown(event) {
        // Prevent propagation for all alphanumeric characters in order to avoid selection issues
        if ((event.key && event.key.length === 1) ||
            (event.keyCode >= A && event.keyCode <= Z) ||
            (event.keyCode >= ZERO && event.keyCode <= NINE) ||
            (event.keyCode === SPACE)
            || (this.preventHomeEndKeyPropagation && (event.keyCode === HOME || event.keyCode === END))) {
            event.stopPropagation();
        }
        if (this.matSelect.multiple && event.key && event.keyCode === ENTER) {
            // Regain focus after multiselect, so we can further type
            setTimeout(() => this._focus());
        }
        // Special case if click Escape, if input is empty, close the dropdown, if not, empty out the search field
        if (this.enableClearOnEscapePressed === true && event.keyCode === ESCAPE && this.value) {
            this._reset(true);
            event.stopPropagation();
        }
    }
    /**
     * Handles the key up event with MatSelect.
     * Allows e.g. the announcing of the currently activeDescendant by screen readers.
     */
    _handleKeyup(event) {
        if (event.keyCode === UP_ARROW || event.keyCode === DOWN_ARROW) {
            const ariaActiveDescendantId = this.matSelect._getAriaActiveDescendant();
            const index = this._options.toArray().findIndex(item => item.id === ariaActiveDescendantId);
            if (index !== -1) {
                const activeDescendant = this._options.toArray()[index];
                this.liveAnnouncer.announce(activeDescendant.viewValue + ' '
                    + this.getAriaIndex(index)
                    + this.indexAndLengthScreenReaderText
                    + this.getAriaLength());
            }
        }
    }
    /**
     * Calculate the index of the current option, taking the offset to length into account.
     * examples:
     *    Case 1 [Search, 1, 2, 3] will have offset of 1, due to search and will read index of total.
     *    Case 2 [1, 2, 3] will have offset of 0 and will read index +1 of total.
     */
    getAriaIndex(optionIndex) {
        if (this.getOptionsLengthOffset() === 0) {
            return optionIndex + 1;
        }
        return optionIndex;
    }
    /**
     * Calculate the length of the options, taking the offset to length into account.
     * examples:
     *    Case 1 [Search, 1, 2, 3] will have length of options.length -1, due to search.
     *    Case 2 [1, 2, 3] will have length of options.length.
     */
    getAriaLength() {
        return this._options.toArray().length - this.getOptionsLengthOffset();
    }
    writeValue(value) {
        this._lastExternalInputValue = value;
        this._formControl.setValue(value);
        this.changeDetectorRef.markForCheck();
    }
    onBlur() {
        this.onTouched();
    }
    registerOnChange(fn) {
        this._formControl.valueChanges.pipe(filter(value => value !== this._lastExternalInputValue), tap(() => this._lastExternalInputValue = undefined), takeUntil(this._onDestroy)).subscribe(fn);
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Focuses the search input field
     */
    _focus() {
        if (!this.searchSelectInput || !this.matSelect.panel) {
            return;
        }
        // save and restore scrollTop of panel, since it will be reset by focus()
        // note: this is hacky
        const panel = this.matSelect.panel.nativeElement;
        const scrollTop = panel.scrollTop;
        // focus
        this.searchSelectInput.nativeElement.focus();
        panel.scrollTop = scrollTop;
    }
    /**
     * Resets the current search value
     * @param focus whether to focus after resetting
     */
    _reset(focus) {
        this._formControl.setValue('');
        if (focus) {
            this._focus();
        }
    }
    /**
     * Initializes handling <mat-select [multiple]="true">
     * Note: to improve this code, mat-select should be extended to allow disabling resetting the selection while filtering.
     */
    initMultipleHandling() {
        if (!this.matSelect.ngControl) {
            if (this.matSelect.multiple) {
                // note: the access to matSelect.ngControl (instead of matSelect.value / matSelect.valueChanges)
                // is necessary to properly work in multi-selection mode.
                console.error('the mat-select containing ngx-mat-select-search must have a ngModel or formControl directive when multiple=true');
            }
            return;
        }
        // if <mat-select [multiple]="true">
        // store previously selected values and restore them when they are deselected
        // because the option is not available while we are currently filtering
        this.previousSelectedValues = this.matSelect.ngControl.value;
        this.matSelect.ngControl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe((currentSelectedValues) => {
            if (!this.matSelect.multiple) {
                this.previousSelectedValues = currentSelectedValues;
                return;
            }
            if (!this.alwaysRestoreSelectedOptionsMulti) {
                this.previousSelectedValues = currentSelectedValues;
                return;
            }
            const filteringInProgress = (this._formControl.value && this._formControl.value.length);
            let restoreSelectedValues = false;
            if (filteringInProgress && this.previousSelectedValues && Array.isArray(this.previousSelectedValues)) {
                if (!currentSelectedValues || !Array.isArray(currentSelectedValues)) {
                    currentSelectedValues = [];
                }
                const optionValues = this.matSelect.options.map(option => option.value);
                this.previousSelectedValues.forEach(previousValue => {
                    const previousValueDeselectedDuringFiltering = !currentSelectedValues.some(v => this.matSelect.compareWith(v, previousValue)) && !optionValues.some(v => this.matSelect.compareWith(v, previousValue));
                    if (previousValueDeselectedDuringFiltering) {
                        currentSelectedValues.push(previousValue);
                        restoreSelectedValues = true;
                    }
                });
            }
            this.previousSelectedValues = currentSelectedValues;
            if (restoreSelectedValues) {
                this.matSelect._onChange(currentSelectedValues);
            }
        });
    }
    /**
     * Scrolls the currently active option into the view if it is not yet visible.
     */
    adjustScrollTopToFitActiveOptionIntoView() {
        if (this.matSelect.panel && this.matSelect.options.length > 0) {
            const matOptionHeight = this.getMatOptionHeight();
            const activeOptionIndex = this.matSelect._keyManager.activeItemIndex || 0;
            const labelCount = _countGroupLabelsBeforeOption(activeOptionIndex, this.matSelect.options, this.matSelect.optionGroups);
            // If the component is in a MatOption, the activeItemIndex will be offset by one.
            const indexOfOptionToFitIntoView = (this.matOption ? -1 : 0) + labelCount + activeOptionIndex;
            const currentScrollTop = this.matSelect.panel.nativeElement.scrollTop;
            const searchInputHeight = this.innerSelectSearch.nativeElement.offsetHeight;
            const amountOfVisibleOptions = Math.floor((SELECT_PANEL_MAX_HEIGHT - searchInputHeight) / matOptionHeight);
            const indexOfFirstVisibleOption = Math.round((currentScrollTop + searchInputHeight) / matOptionHeight) - 1;
            if (indexOfFirstVisibleOption >= indexOfOptionToFitIntoView) {
                this.matSelect.panel.nativeElement.scrollTop = indexOfOptionToFitIntoView * matOptionHeight;
            }
            else if (indexOfFirstVisibleOption + amountOfVisibleOptions <= indexOfOptionToFitIntoView) {
                this.matSelect.panel.nativeElement.scrollTop = (indexOfOptionToFitIntoView + 1) * matOptionHeight
                    - (SELECT_PANEL_MAX_HEIGHT - searchInputHeight);
            }
        }
    }
    /**
     *  Set the width of the innerSelectSearch to fit even custom scrollbars
     *  And support all Operation Systems
     */
    updateInputWidth() {
        if (!this.innerSelectSearch || !this.innerSelectSearch.nativeElement) {
            return;
        }
        let element = this.innerSelectSearch.nativeElement;
        let panelElement;
        while (element = element.parentElement) {
            if (element.classList.contains('mat-select-panel')) {
                panelElement = element;
                break;
            }
        }
        if (panelElement) {
            this.innerSelectSearch.nativeElement.style.width = panelElement.clientWidth + 'px';
        }
    }
    getMatOptionHeight() {
        if (this.matSelect.options.length > 0) {
            return this.matSelect.options.first._getHostElement().getBoundingClientRect().height;
        }
        return 0;
    }
    /**
     * Determine the offset to length that can be caused by the optional matOption used as a search input.
     */
    getOptionsLengthOffset() {
        if (this.matOption) {
            return 1;
        }
        else {
            return 0;
        }
    }
}
MatSelectSearchComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: MatSelectSearchComponent, deps: [{ token: MatSelect }, { token: i0.ChangeDetectorRef }, { token: i1.ViewportRuler }, { token: MatOption, optional: true }, { token: i2.LiveAnnouncer }, { token: MatFormField, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatSelectSearchComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.1", type: MatSelectSearchComponent, selector: "ngx-mat-select-search", inputs: { placeholderLabel: "placeholderLabel", type: "type", noEntriesFoundLabel: "noEntriesFoundLabel", indexAndLengthScreenReaderText: "indexAndLengthScreenReaderText", clearSearchInput: "clearSearchInput", searching: "searching", disableInitialFocus: "disableInitialFocus", enableClearOnEscapePressed: "enableClearOnEscapePressed", preventHomeEndKeyPropagation: "preventHomeEndKeyPropagation", disableScrollToActiveOnOptionsChanged: "disableScrollToActiveOnOptionsChanged", ariaLabel: "ariaLabel", showToggleAllCheckbox: "showToggleAllCheckbox", toggleAllCheckboxChecked: "toggleAllCheckboxChecked", toggleAllCheckboxIndeterminate: "toggleAllCheckboxIndeterminate", toggleAllCheckboxTooltipMessage: "toggleAllCheckboxTooltipMessage", toogleAllCheckboxTooltipPosition: "toogleAllCheckboxTooltipPosition", hideClearSearchButton: "hideClearSearchButton", alwaysRestoreSelectedOptionsMulti: "alwaysRestoreSelectedOptionsMulti" }, outputs: { toggleAll: "toggleAll" }, host: { properties: { "class.mat-select-search-inside-mat-option": "this.isInsideMatOption" } }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MatSelectSearchComponent),
            multi: true
        }
    ], queries: [{ propertyName: "clearIcon", first: true, predicate: MatSelectSearchClearDirective, descendants: true }], viewQueries: [{ propertyName: "searchSelectInput", first: true, predicate: ["searchSelectInput"], descendants: true, read: ElementRef, static: true }, { propertyName: "innerSelectSearch", first: true, predicate: ["innerSelectSearch"], descendants: true, read: ElementRef, static: true }], ngImport: i0, template: "<!-- Placeholder to adjust vertical offset of the mat-option elements -->\n<input matInput class=\"mat-select-search-input mat-select-search-hidden\"/>\n\n<!-- Note: the  mat-datepicker-content mat-tab-header are needed to inherit the material theme colors, see PR #22 -->\n<div\n      #innerSelectSearch\n      class=\"mat-select-search-inner mat-typography mat-datepicker-content mat-tab-header\"\n      [ngClass]=\"{'mat-select-search-inner-multiple': matSelect.multiple, 'mat-select-search-inner-toggle-all': _isToggleAllCheckboxVisible() }\">\n\n  <mat-checkbox *ngIf=\"_isToggleAllCheckboxVisible()\"\n                [color]=\"matFormField?.color\"\n                class=\"mat-select-search-toggle-all-checkbox\"\n                [checked]=\"toggleAllCheckboxChecked\"\n                [indeterminate]=\"toggleAllCheckboxIndeterminate\"\n                [matTooltip]=\"toggleAllCheckboxTooltipMessage\"\n                matTooltipClass=\"ngx-mat-select-search-toggle-all-tooltip\"\n                [matTooltipPosition]=\"toogleAllCheckboxTooltipPosition\"\n                (change)=\"_emitSelectAllBooleanToParent($event.checked)\"\n  ></mat-checkbox>\n\n  <input class=\"mat-select-search-input mat-input-element\"\n         autocomplete=\"off\"\n         [type]=\"type\"\n         [formControl]=\"_formControl\"\n         #searchSelectInput\n         (keydown)=\"_handleKeydown($event)\"\n         (keyup)=\"_handleKeyup($event)\"\n         (blur)=\"onBlur()\"\n         [placeholder]=\"placeholderLabel\"\n         [attr.aria-label]=\"ariaLabel\"\n  />\n  <mat-spinner *ngIf=\"searching\"\n          class=\"mat-select-search-spinner\"\n          diameter=\"16\"></mat-spinner>\n\n  <button mat-button\n          *ngIf=\"!hideClearSearchButton && value && !searching\"\n          mat-icon-button\n          aria-label=\"Clear\"\n          (click)=\"_reset(true)\"\n          class=\"mat-select-search-clear\">\n    <ng-content *ngIf=\"clearIcon; else defaultIcon\" select=\"[ngxMatSelectSearchClear]\"></ng-content>\n    <ng-template #defaultIcon>\n      <mat-icon>close</mat-icon>\n    </ng-template>\n  </button>\n\n  <ng-content select=\".mat-select-search-custom-header-content\"></ng-content>\n\n</div>\n\n<div *ngIf=\"_showNoEntriesFound$ | async\"\n     class=\"mat-select-search-no-entries-found\">\n  {{noEntriesFoundLabel}}\n</div>\n<!--\nCopyright (c) 2018 Bithost GmbH All Rights Reserved.\n\nUse of this source code is governed by an MIT-style license that can be\nfound in the LICENSE file at https://angular.io/license\n-->\n", styles: [".mat-select-search-hidden{visibility:hidden}.mat-select-search-inner{position:absolute;top:0;width:100%;border-bottom-width:1px;border-bottom-style:solid;z-index:100;font-size:inherit;box-shadow:none;border-radius:4px 4px 0 0;-webkit-transform:translate3d(0,0,0)}.mat-select-search-inner.mat-select-search-inner-multiple{width:100%}.mat-select-search-inner.mat-select-search-inner-multiple.mat-select-search-inner-toggle-all{display:flex;align-items:center}.mat-select-search-inner .mat-input-element{flex-basis:auto}.mat-select-search-inner .mat-input-element:-ms-input-placeholder{-ms-user-select:text}::ng-deep .mat-select-search-panel{transform:none!important;overflow-x:hidden}.mat-select-search-input{padding:16px 44px 16px 16px;box-sizing:border-box;width:100%}:host-context([dir=rtl]) .mat-select-search-input{padding-right:16px;padding-left:44px}.mat-select-search-no-entries-found{padding:16px}.mat-select-search-clear{position:absolute;right:4px;top:5px}:host-context([dir=rtl]) .mat-select-search-clear{right:auto;left:4px}.mat-select-search-spinner{position:absolute;right:16px;top:calc(50% - 8px)}:host-context([dir=rtl]) .mat-select-search-spinner{right:auto;left:16px}:host.mat-select-search-inside-mat-option .mat-select-search-input{padding-top:0;padding-bottom:0;height:3em;line-height:3em}:host.mat-select-search-inside-mat-option .mat-select-search-clear{top:3px}::ng-deep .mat-option[aria-disabled=true].contains-mat-select-search{position:static;padding:0}::ng-deep .mat-option[aria-disabled=true].contains-mat-select-search .mat-icon{margin-right:0;margin-left:0}::ng-deep .mat-option[aria-disabled=true].contains-mat-select-search .mat-option-pseudo-checkbox{display:none}::ng-deep .mat-option[aria-disabled=true].contains-mat-select-search.mat-select-search-no-entries-found{height:6em}.mat-select-search-toggle-all-checkbox{padding-left:16px;padding-bottom:2px}:host-context([dir=rtl]) .mat-select-search-toggle-all-checkbox{padding-left:0;padding-right:16px}\n"], components: [{ type: i3.MatCheckbox, selector: "mat-checkbox", inputs: ["disableRipple", "color", "tabIndex", "aria-label", "aria-labelledby", "aria-describedby", "id", "required", "labelPosition", "name", "value", "checked", "disabled", "indeterminate"], outputs: ["change", "indeterminateChange"], exportAs: ["matCheckbox"] }, { type: i4.MatSpinner, selector: "mat-spinner", inputs: ["color"] }, { type: i5.MatButton, selector: "button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { type: i6.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }], directives: [{ type: i7.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i7.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i8.MatTooltip, selector: "[matTooltip]", exportAs: ["matTooltip"] }, { type: i9.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { type: i9.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i9.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }], pipes: { "async": i7.AsyncPipe }, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: MatSelectSearchComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-mat-select-search', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => MatSelectSearchComponent),
                            multi: true
                        }
                    ], changeDetection: ChangeDetectionStrategy.OnPush, template: "<!-- Placeholder to adjust vertical offset of the mat-option elements -->\n<input matInput class=\"mat-select-search-input mat-select-search-hidden\"/>\n\n<!-- Note: the  mat-datepicker-content mat-tab-header are needed to inherit the material theme colors, see PR #22 -->\n<div\n      #innerSelectSearch\n      class=\"mat-select-search-inner mat-typography mat-datepicker-content mat-tab-header\"\n      [ngClass]=\"{'mat-select-search-inner-multiple': matSelect.multiple, 'mat-select-search-inner-toggle-all': _isToggleAllCheckboxVisible() }\">\n\n  <mat-checkbox *ngIf=\"_isToggleAllCheckboxVisible()\"\n                [color]=\"matFormField?.color\"\n                class=\"mat-select-search-toggle-all-checkbox\"\n                [checked]=\"toggleAllCheckboxChecked\"\n                [indeterminate]=\"toggleAllCheckboxIndeterminate\"\n                [matTooltip]=\"toggleAllCheckboxTooltipMessage\"\n                matTooltipClass=\"ngx-mat-select-search-toggle-all-tooltip\"\n                [matTooltipPosition]=\"toogleAllCheckboxTooltipPosition\"\n                (change)=\"_emitSelectAllBooleanToParent($event.checked)\"\n  ></mat-checkbox>\n\n  <input class=\"mat-select-search-input mat-input-element\"\n         autocomplete=\"off\"\n         [type]=\"type\"\n         [formControl]=\"_formControl\"\n         #searchSelectInput\n         (keydown)=\"_handleKeydown($event)\"\n         (keyup)=\"_handleKeyup($event)\"\n         (blur)=\"onBlur()\"\n         [placeholder]=\"placeholderLabel\"\n         [attr.aria-label]=\"ariaLabel\"\n  />\n  <mat-spinner *ngIf=\"searching\"\n          class=\"mat-select-search-spinner\"\n          diameter=\"16\"></mat-spinner>\n\n  <button mat-button\n          *ngIf=\"!hideClearSearchButton && value && !searching\"\n          mat-icon-button\n          aria-label=\"Clear\"\n          (click)=\"_reset(true)\"\n          class=\"mat-select-search-clear\">\n    <ng-content *ngIf=\"clearIcon; else defaultIcon\" select=\"[ngxMatSelectSearchClear]\"></ng-content>\n    <ng-template #defaultIcon>\n      <mat-icon>close</mat-icon>\n    </ng-template>\n  </button>\n\n  <ng-content select=\".mat-select-search-custom-header-content\"></ng-content>\n\n</div>\n\n<div *ngIf=\"_showNoEntriesFound$ | async\"\n     class=\"mat-select-search-no-entries-found\">\n  {{noEntriesFoundLabel}}\n</div>\n<!--\nCopyright (c) 2018 Bithost GmbH All Rights Reserved.\n\nUse of this source code is governed by an MIT-style license that can be\nfound in the LICENSE file at https://angular.io/license\n-->\n", styles: [".mat-select-search-hidden{visibility:hidden}.mat-select-search-inner{position:absolute;top:0;width:100%;border-bottom-width:1px;border-bottom-style:solid;z-index:100;font-size:inherit;box-shadow:none;border-radius:4px 4px 0 0;-webkit-transform:translate3d(0,0,0)}.mat-select-search-inner.mat-select-search-inner-multiple{width:100%}.mat-select-search-inner.mat-select-search-inner-multiple.mat-select-search-inner-toggle-all{display:flex;align-items:center}.mat-select-search-inner .mat-input-element{flex-basis:auto}.mat-select-search-inner .mat-input-element:-ms-input-placeholder{-ms-user-select:text}::ng-deep .mat-select-search-panel{transform:none!important;overflow-x:hidden}.mat-select-search-input{padding:16px 44px 16px 16px;box-sizing:border-box;width:100%}:host-context([dir=rtl]) .mat-select-search-input{padding-right:16px;padding-left:44px}.mat-select-search-no-entries-found{padding:16px}.mat-select-search-clear{position:absolute;right:4px;top:5px}:host-context([dir=rtl]) .mat-select-search-clear{right:auto;left:4px}.mat-select-search-spinner{position:absolute;right:16px;top:calc(50% - 8px)}:host-context([dir=rtl]) .mat-select-search-spinner{right:auto;left:16px}:host.mat-select-search-inside-mat-option .mat-select-search-input{padding-top:0;padding-bottom:0;height:3em;line-height:3em}:host.mat-select-search-inside-mat-option .mat-select-search-clear{top:3px}::ng-deep .mat-option[aria-disabled=true].contains-mat-select-search{position:static;padding:0}::ng-deep .mat-option[aria-disabled=true].contains-mat-select-search .mat-icon{margin-right:0;margin-left:0}::ng-deep .mat-option[aria-disabled=true].contains-mat-select-search .mat-option-pseudo-checkbox{display:none}::ng-deep .mat-option[aria-disabled=true].contains-mat-select-search.mat-select-search-no-entries-found{height:6em}.mat-select-search-toggle-all-checkbox{padding-left:16px;padding-bottom:2px}:host-context([dir=rtl]) .mat-select-search-toggle-all-checkbox{padding-left:0;padding-right:16px}\n"] }]
        }], ctorParameters: function () { return [{ type: i10.MatSelect, decorators: [{
                    type: Inject,
                    args: [MatSelect]
                }] }, { type: i0.ChangeDetectorRef }, { type: i1.ViewportRuler }, { type: i11.MatOption, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MatOption]
                }] }, { type: i2.LiveAnnouncer }, { type: i12.MatFormField, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MatFormField]
                }] }]; }, propDecorators: { placeholderLabel: [{
                type: Input
            }], type: [{
                type: Input
            }], noEntriesFoundLabel: [{
                type: Input
            }], indexAndLengthScreenReaderText: [{
                type: Input
            }], clearSearchInput: [{
                type: Input
            }], searching: [{
                type: Input
            }], disableInitialFocus: [{
                type: Input
            }], enableClearOnEscapePressed: [{
                type: Input
            }], preventHomeEndKeyPropagation: [{
                type: Input
            }], disableScrollToActiveOnOptionsChanged: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], showToggleAllCheckbox: [{
                type: Input
            }], toggleAllCheckboxChecked: [{
                type: Input
            }], toggleAllCheckboxIndeterminate: [{
                type: Input
            }], toggleAllCheckboxTooltipMessage: [{
                type: Input
            }], toogleAllCheckboxTooltipPosition: [{
                type: Input
            }], hideClearSearchButton: [{
                type: Input
            }], alwaysRestoreSelectedOptionsMulti: [{
                type: Input
            }], toggleAll: [{
                type: Output
            }], searchSelectInput: [{
                type: ViewChild,
                args: ['searchSelectInput', { read: ElementRef, static: true }]
            }], innerSelectSearch: [{
                type: ViewChild,
                args: ['innerSelectSearch', { read: ElementRef, static: true }]
            }], clearIcon: [{
                type: ContentChild,
                args: [MatSelectSearchClearDirective]
            }], isInsideMatOption: [{
                type: HostBinding,
                args: ['class.mat-select-search-inside-mat-option']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0LXNlbGVjdC1zZWFyY2guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC9tYXQtc2VsZWN0LXNlYXJjaC9tYXQtc2VsZWN0LXNlYXJjaC5jb21wb25lbnQudHMiLCIuLi8uLi9zcmMvYXBwL21hdC1zZWxlY3Qtc2VhcmNoL21hdC1zZWxlY3Qtc2VhcmNoLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUV2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLFdBQVcsRUFDWCxNQUFNLEVBQ04sS0FBSyxFQUdMLFFBQVEsRUFDUixNQUFNLEVBRU4sU0FBUyxFQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBd0IsV0FBVyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDdEYsT0FBTyxFQUFFLDZCQUE2QixFQUFFLFNBQVMsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2xGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDNUQsT0FBTyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxJQUFJLEdBQUcsTUFBTSx1QkFBdUIsQ0FBQztBQUdqSCxPQUFPLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBYyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9FLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUs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U0FBUztzQkFBakIsS0FBSztnQkFHRyxtQkFBbUI7c0JBQTNCLEtBQUs7Z0JBR0csMEJBQTBCO3NCQUFsQyxLQUFLO2dCQU1HLDRCQUE0QjtzQkFBcEMsS0FBSztnQkFHRyxxQ0FBcUM7c0JBQTdDLEtBQUs7Z0JBR0csU0FBUztzQkFBakIsS0FBSztnQkFHRyxxQkFBcUI7c0JBQTdCLEtBQUs7Z0JBR0csd0JBQXdCO3NCQUFoQyxLQUFLO2dCQUdHLDhCQUE4QjtzQkFBdEMsS0FBSztnQkFHRywrQkFBK0I7c0JBQXZDLEtBQUs7Z0JBR0csZ0NBQWdDO3NCQUF4QyxLQUFLO2dCQUdHLHFCQUFxQjtzQkFBN0IsS0FBSztnQkFNRyxpQ0FBaUM7c0JBQXpDLEtBQUs7Z0JBR0ksU0FBUztzQkFBbEIsTUFBTTtnQkFHNkQsaUJBQWlCO3NCQUFwRixTQUFTO3VCQUFDLG1CQUFtQixFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQUdFLGlCQUFpQjtzQkFBcEYsU0FBUzt1QkFBQyxtQkFBbUIsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFHckIsU0FBUztzQkFBckQsWUFBWTt1QkFBQyw2QkFBNkI7Z0JBR3ZDLGlCQUFpQjtzQkFEcEIsV0FBVzt1QkFBQywyQ0FBMkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxOCBCaXRob3N0IEdtYkggQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBGb3JtQ29udHJvbCwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBfY291bnRHcm91cExhYmVsc0JlZm9yZU9wdGlvbiwgTWF0T3B0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQgeyBNYXRTZWxlY3QgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zZWxlY3QnO1xuaW1wb3J0IHsgTWF0Rm9ybUZpZWxkIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQgeyBBLCBET1dOX0FSUk9XLCBFTkQsIEVOVEVSLCBFU0NBUEUsIEhPTUUsIE5JTkUsIFNQQUNFLCBVUF9BUlJPVywgWiwgWkVSTywgfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHsgVmlld3BvcnRSdWxlciB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHsgTGl2ZUFubm91bmNlciB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgb2YsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlbGF5LCBmaWx0ZXIsIG1hcCwgc3RhcnRXaXRoLCBzd2l0Y2hNYXAsIHRha2UsIHRha2VVbnRpbCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBNYXRTZWxlY3RTZWFyY2hDbGVhckRpcmVjdGl2ZSB9IGZyb20gJy4vbWF0LXNlbGVjdC1zZWFyY2gtY2xlYXIuZGlyZWN0aXZlJztcblxuLyoqIFRoZSBtYXggaGVpZ2h0IG9mIHRoZSBzZWxlY3QncyBvdmVybGF5IHBhbmVsLiAqL1xuY29uc3QgU0VMRUNUX1BBTkVMX01BWF9IRUlHSFQgPSAyNTY7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1lbWJlci1vcmRlcmluZyBjb21wb25lbnQtc2VsZWN0b3IgKi9cbi8qKlxuICogQ29tcG9uZW50IHByb3ZpZGluZyBhbiBpbnB1dCBmaWVsZCBmb3Igc2VhcmNoaW5nIE1hdFNlbGVjdCBvcHRpb25zLlxuICpcbiAqIEV4YW1wbGUgdXNhZ2U6XG4gKlxuICogaW50ZXJmYWNlIEJhbmsge1xuICogIGlkOiBzdHJpbmc7XG4gKiAgbmFtZTogc3RyaW5nO1xuICogfVxuICpcbiAqIEBDb21wb25lbnQoe1xuICogICBzZWxlY3RvcjogJ215LWFwcC1kYXRhLXNlbGVjdGlvbicsXG4gKiAgIHRlbXBsYXRlOiBgXG4gKiAgICAgPG1hdC1mb3JtLWZpZWxkPlxuICogICAgICAgPG1hdC1zZWxlY3QgW2Zvcm1Db250cm9sXT1cImJhbmtDdHJsXCIgcGxhY2Vob2xkZXI9XCJCYW5rXCI+XG4gKiAgICAgICAgIDxtYXQtb3B0aW9uPlxuICogICAgICAgICAgIDxuZ3gtbWF0LXNlbGVjdC1zZWFyY2ggW2Zvcm1Db250cm9sXT1cImJhbmtGaWx0ZXJDdHJsXCI+PC9uZ3gtbWF0LXNlbGVjdC1zZWFyY2g+XG4gKiAgICAgICAgIDwvbWF0LW9wdGlvbj5cbiAqICAgICAgICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IGJhbmsgb2YgZmlsdGVyZWRCYW5rcyB8IGFzeW5jXCIgW3ZhbHVlXT1cImJhbmsuaWRcIj5cbiAqICAgICAgICAgICB7e2JhbmsubmFtZX19XG4gKiAgICAgICAgIDwvbWF0LW9wdGlvbj5cbiAqICAgICAgIDwvbWF0LXNlbGVjdD5cbiAqICAgICA8L21hdC1mb3JtLWZpZWxkPlxuICogICBgXG4gKiB9KVxuICogZXhwb3J0IGNsYXNzIERhdGFTZWxlY3Rpb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gKlxuICogICAvLyBjb250cm9sIGZvciB0aGUgc2VsZWN0ZWQgYmFua1xuICogICBwdWJsaWMgYmFua0N0cmw6IEZvcm1Db250cm9sID0gbmV3IEZvcm1Db250cm9sKCk7XG4gKiAgIC8vIGNvbnRyb2wgZm9yIHRoZSBNYXRTZWxlY3QgZmlsdGVyIGtleXdvcmRcbiAqICAgcHVibGljIGJhbmtGaWx0ZXJDdHJsOiBGb3JtQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgpO1xuICpcbiAqICAgLy8gbGlzdCBvZiBiYW5rc1xuICogICBwcml2YXRlIGJhbmtzOiBCYW5rW10gPSBbe25hbWU6ICdCYW5rIEEnLCBpZDogJ0EnfSwge25hbWU6ICdCYW5rIEInLCBpZDogJ0InfSwge25hbWU6ICdCYW5rIEMnLCBpZDogJ0MnfV07XG4gKiAgIC8vIGxpc3Qgb2YgYmFua3MgZmlsdGVyZWQgYnkgc2VhcmNoIGtleXdvcmRcbiAqICAgcHVibGljIGZpbHRlcmVkQmFua3M6IFJlcGxheVN1YmplY3Q8QmFua1tdPiA9IG5ldyBSZXBsYXlTdWJqZWN0PEJhbmtbXT4oMSk7XG4gKlxuICogICAvLyBTdWJqZWN0IHRoYXQgZW1pdHMgd2hlbiB0aGUgY29tcG9uZW50IGhhcyBiZWVuIGRlc3Ryb3llZC5cbiAqICAgcHJpdmF0ZSBfb25EZXN0cm95ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAqXG4gKlxuICogICBuZ09uSW5pdCgpIHtcbiAqICAgICAvLyBsb2FkIHRoZSBpbml0aWFsIGJhbmsgbGlzdFxuICogICAgIHRoaXMuZmlsdGVyZWRCYW5rcy5uZXh0KHRoaXMuYmFua3Muc2xpY2UoKSk7XG4gKiAgICAgLy8gbGlzdGVuIGZvciBzZWFyY2ggZmllbGQgdmFsdWUgY2hhbmdlc1xuICogICAgIHRoaXMuYmFua0ZpbHRlckN0cmwudmFsdWVDaGFuZ2VzXG4gKiAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fb25EZXN0cm95KSlcbiAqICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICogICAgICAgICB0aGlzLmZpbHRlckJhbmtzKCk7XG4gKiAgICAgICB9KTtcbiAqICAgfVxuICpcbiAqICAgbmdPbkRlc3Ryb3koKSB7XG4gKiAgICAgdGhpcy5fb25EZXN0cm95Lm5leHQoKTtcbiAqICAgICB0aGlzLl9vbkRlc3Ryb3kuY29tcGxldGUoKTtcbiAqICAgfVxuICpcbiAqICAgcHJpdmF0ZSBmaWx0ZXJCYW5rcygpIHtcbiAqICAgICBpZiAoIXRoaXMuYmFua3MpIHtcbiAqICAgICAgIHJldHVybjtcbiAqICAgICB9XG4gKlxuICogICAgIC8vIGdldCB0aGUgc2VhcmNoIGtleXdvcmRcbiAqICAgICBsZXQgc2VhcmNoID0gdGhpcy5iYW5rRmlsdGVyQ3RybC52YWx1ZTtcbiAqICAgICBpZiAoIXNlYXJjaCkge1xuICogICAgICAgdGhpcy5maWx0ZXJlZEJhbmtzLm5leHQodGhpcy5iYW5rcy5zbGljZSgpKTtcbiAqICAgICAgIHJldHVybjtcbiAqICAgICB9IGVsc2Uge1xuICogICAgICAgc2VhcmNoID0gc2VhcmNoLnRvTG93ZXJDYXNlKCk7XG4gKiAgICAgfVxuICpcbiAqICAgICAvLyBmaWx0ZXIgdGhlIGJhbmtzXG4gKiAgICAgdGhpcy5maWx0ZXJlZEJhbmtzLm5leHQoXG4gKiAgICAgICB0aGlzLmJhbmtzLmZpbHRlcihiYW5rID0+IGJhbmsubmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc2VhcmNoKSA+IC0xKVxuICogICAgICk7XG4gKiAgIH1cbiAqIH1cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LW1hdC1zZWxlY3Qtc2VhcmNoJyxcbiAgdGVtcGxhdGVVcmw6ICcuL21hdC1zZWxlY3Qtc2VhcmNoLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbWF0LXNlbGVjdC1zZWFyY2guY29tcG9uZW50LnNjc3MnXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRTZWxlY3RTZWFyY2hDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9XG4gIF0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNlbGVjdFNlYXJjaENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG5cbiAgLyoqIExhYmVsIG9mIHRoZSBzZWFyY2ggcGxhY2Vob2xkZXIgKi9cbiAgQElucHV0KCkgcGxhY2Vob2xkZXJMYWJlbCA9ICdTdWNoZSc7XG5cbiAgLyoqIFR5cGUgb2YgdGhlIHNlYXJjaCBpbnB1dCBmaWVsZCAqL1xuICBASW5wdXQoKSB0eXBlID0gJ3RleHQnO1xuXG4gIC8qKiBMYWJlbCB0byBiZSBzaG93biB3aGVuIG5vIGVudHJpZXMgYXJlIGZvdW5kLiBTZXQgdG8gbnVsbCBpZiBubyBtZXNzYWdlIHNob3VsZCBiZSBzaG93bi4gKi9cbiAgQElucHV0KCkgbm9FbnRyaWVzRm91bmRMYWJlbCA9ICdLZWluZSBPcHRpb25lbiBnZWZ1bmRlbic7XG5cbiAgLyoqXG4gICAqICBUZXh0IHRoYXQgaXMgYXBwZW5kZWQgdG8gdGhlIGN1cnJlbnRseSBhY3RpdmUgaXRlbSBsYWJlbCBhbm5vdW5jZWQgYnkgc2NyZWVuIHJlYWRlcnMsXG4gICAqICBpbmZvcm1pbmcgdGhlIHVzZXIgb2YgdGhlIGN1cnJlbnQgaW5kZXgsIHZhbHVlIGFuZCB0b3RhbCBvcHRpb25zLlxuICAgKiAgZWc6IEJhbmsgUiAoR2VybWFueSkgMSBvZiA2XG4gICovXG4gIEBJbnB1dCgpIGluZGV4QW5kTGVuZ3RoU2NyZWVuUmVhZGVyVGV4dCA9ICcgb2YgJztcblxuICAvKipcbiAgICAqIFdoZXRoZXIgb3Igbm90IHRoZSBzZWFyY2ggZmllbGQgc2hvdWxkIGJlIGNsZWFyZWQgYWZ0ZXIgdGhlIGRyb3Bkb3duIG1lbnUgaXMgY2xvc2VkLlxuICAgICogVXNlZnVsIGZvciBzZXJ2ZXItc2lkZSBmaWx0ZXJpbmcuIFNlZSBbIzNdKGh0dHBzOi8vZ2l0aHViLmNvbS9iaXRob3N0LWdtYmgvbmd4LW1hdC1zZWxlY3Qtc2VhcmNoL2lzc3Vlcy8zKVxuICAgICovXG4gIEBJbnB1dCgpIGNsZWFyU2VhcmNoSW5wdXQgPSB0cnVlO1xuXG4gIC8qKiBXaGV0aGVyIHRvIHNob3cgdGhlIHNlYXJjaC1pbi1wcm9ncmVzcyBpbmRpY2F0b3IgKi9cbiAgQElucHV0KCkgc2VhcmNoaW5nID0gZmFsc2U7XG5cbiAgLyoqIERpc2FibGVzIGluaXRpYWwgZm9jdXNpbmcgb2YgdGhlIGlucHV0IGZpZWxkICovXG4gIEBJbnB1dCgpIGRpc2FibGVJbml0aWFsRm9jdXMgPSBmYWxzZTtcblxuICAvKiogRW5hYmxlIGNsZWFyIGlucHV0IG9uIGVzY2FwZSBwcmVzc2VkICovXG4gIEBJbnB1dCgpIGVuYWJsZUNsZWFyT25Fc2NhcGVQcmVzc2VkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFByZXZlbnRzIGhvbWUgLyBlbmQga2V5IGJlaW5nIHByb3BhZ2F0ZWQgdG8gbWF0LXNlbGVjdCxcbiAgICogYWxsb3dpbmcgdG8gbW92ZSB0aGUgY3Vyc29yIHdpdGhpbiB0aGUgc2VhcmNoIGlucHV0IGluc3RlYWQgb2YgbmF2aWdhdGluZyB0aGUgb3B0aW9uc1xuICAgKi9cbiAgQElucHV0KCkgcHJldmVudEhvbWVFbmRLZXlQcm9wYWdhdGlvbiA9IGZhbHNlO1xuXG4gIC8qKiBEaXNhYmxlcyBzY3JvbGxpbmcgdG8gYWN0aXZlIG9wdGlvbnMgd2hlbiBvcHRpb24gbGlzdCBjaGFuZ2VzLiBVc2VmdWwgZm9yIHNlcnZlci1zaWRlIHNlYXJjaCAqL1xuICBASW5wdXQoKSBkaXNhYmxlU2Nyb2xsVG9BY3RpdmVPbk9wdGlvbnNDaGFuZ2VkID0gZmFsc2U7XG5cbiAgLyoqIEFkZHMgNTA4IHNjcmVlbiByZWFkZXIgc3VwcG9ydCBmb3Igc2VhcmNoIGJveCAqL1xuICBASW5wdXQoKSBhcmlhTGFiZWwgPSAnZHJvcGRvd24gc2VhcmNoJztcblxuICAvKiogV2hldGhlciB0byBzaG93IFNlbGVjdCBBbGwgQ2hlY2tib3ggKGZvciBtYXQtc2VsZWN0W211bHRpPXRydWVdKSAqL1xuICBASW5wdXQoKSBzaG93VG9nZ2xlQWxsQ2hlY2tib3ggPSBmYWxzZTtcblxuICAvKiogc2VsZWN0IGFsbCBjaGVja2JveCBjaGVja2VkIHN0YXRlICovXG4gIEBJbnB1dCgpIHRvZ2dsZUFsbENoZWNrYm94Q2hlY2tlZCA9IGZhbHNlO1xuXG4gIC8qKiBzZWxlY3QgYWxsIGNoZWNrYm94IGluZGV0ZXJtaW5hdGUgc3RhdGUgKi9cbiAgQElucHV0KCkgdG9nZ2xlQWxsQ2hlY2tib3hJbmRldGVybWluYXRlID0gZmFsc2U7XG5cbiAgLyoqIERpc3BsYXkgYSBtZXNzYWdlIGluIGEgdG9vbHRpcCBvbiB0aGUgdG9nZ2xlLWFsbCBjaGVja2JveCAqL1xuICBASW5wdXQoKSB0b2dnbGVBbGxDaGVja2JveFRvb2x0aXBNZXNzYWdlID0gJyc7XG5cbiAgLyoqIERlZmluZSB0aGUgcG9zaXRpb24gb2YgdGhlIHRvb2x0aXAgb24gdGhlIHRvZ2dsZS1hbGwgY2hlY2tib3guICovXG4gIEBJbnB1dCgpIHRvb2dsZUFsbENoZWNrYm94VG9vbHRpcFBvc2l0aW9uOiAnbGVmdCcgfCAncmlnaHQnIHwgJ2Fib3ZlJyB8ICdiZWxvdycgfCAnYmVmb3JlJyB8ICdhZnRlcicgPSAnYmVsb3cnO1xuXG4gIC8qKiBTaG93L0hpZGUgdGhlIHNlYXJjaCBjbGVhciBidXR0b24gb2YgdGhlIHNlYXJjaCBpbnB1dCAqL1xuICBASW5wdXQoKSBoaWRlQ2xlYXJTZWFyY2hCdXR0b24gPSBmYWxzZTtcblxuICAvKipcbiAgICogQWx3YXlzIHJlc3RvcmUgc2VsZWN0ZWQgb3B0aW9ucyBvbiBzZWxlY3Rpb25DaGFuZ2UgZm9yIG1vZGUgbXVsdGkgKGUuZy4gZm9yIGxhenkgbG9hZGluZy9pbmZpbml0eSBzY3JvbGxpbmcpLlxuICAgKiBEZWZhdWx0cyB0byBmYWxzZSwgc28gc2VsZWN0ZWQgb3B0aW9ucyBhcmUgb25seSByZXN0b3JlZCB3aGlsZSBmaWx0ZXJpbmcgaXMgYWN0aXZlLlxuICAgKi9cbiAgQElucHV0KCkgYWx3YXlzUmVzdG9yZVNlbGVjdGVkT3B0aW9uc011bHRpID0gZmFsc2U7XG5cbiAgLyoqIE91dHB1dCBlbWl0dGVyIHRvIHNlbmQgdG8gcGFyZW50IGNvbXBvbmVudCB3aXRoIHRoZSB0b2dnbGUgYWxsIGJvb2xlYW4gKi9cbiAgQE91dHB1dCgpIHRvZ2dsZUFsbCA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBzZWFyY2ggaW5wdXQgZmllbGQgKi9cbiAgQFZpZXdDaGlsZCgnc2VhcmNoU2VsZWN0SW5wdXQnLCB7IHJlYWQ6IEVsZW1lbnRSZWYsIHN0YXRpYzogdHJ1ZSB9KSBzZWFyY2hTZWxlY3RJbnB1dDogRWxlbWVudFJlZjtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBzZWFyY2ggaW5wdXQgZmllbGQgKi9cbiAgQFZpZXdDaGlsZCgnaW5uZXJTZWxlY3RTZWFyY2gnLCB7IHJlYWQ6IEVsZW1lbnRSZWYsIHN0YXRpYzogdHJ1ZSB9KSBpbm5lclNlbGVjdFNlYXJjaDogRWxlbWVudFJlZjtcblxuICAvKiogUmVmZXJlbmNlIHRvIGN1c3RvbSBzZWFyY2ggaW5wdXQgY2xlYXIgaWNvbiAqL1xuICBAQ29udGVudENoaWxkKE1hdFNlbGVjdFNlYXJjaENsZWFyRGlyZWN0aXZlKSBjbGVhckljb246IE1hdFNlbGVjdFNlYXJjaENsZWFyRGlyZWN0aXZlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MubWF0LXNlbGVjdC1zZWFyY2gtaW5zaWRlLW1hdC1vcHRpb24nKVxuICBnZXQgaXNJbnNpZGVNYXRPcHRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5tYXRPcHRpb247XG4gIH1cblxuICAvKiogQ3VycmVudCBzZWFyY2ggdmFsdWUgKi9cbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1Db250cm9sLnZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2xhc3RFeHRlcm5hbElucHV0VmFsdWU6IHN0cmluZztcblxuICBvblRvdWNoZWQ6IEZ1bmN0aW9uID0gKF86IGFueSkgPT4geyB9O1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIE1hdFNlbGVjdCBvcHRpb25zICovXG4gIHB1YmxpYyBzZXQgX29wdGlvbnMoX29wdGlvbnM6IFF1ZXJ5TGlzdDxNYXRPcHRpb24+KSB7XG4gICAgdGhpcy5fb3B0aW9ucyQubmV4dChfb3B0aW9ucyk7XG4gIH1cbiAgcHVibGljIGdldCBfb3B0aW9ucygpOiBRdWVyeUxpc3Q8TWF0T3B0aW9uPiB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnMkLmdldFZhbHVlKCk7XG4gIH1cbiAgcHVibGljIF9vcHRpb25zJDogQmVoYXZpb3JTdWJqZWN0PFF1ZXJ5TGlzdDxNYXRPcHRpb24+PiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UXVlcnlMaXN0PE1hdE9wdGlvbj4+KG51bGwpO1xuXG4gIHByaXZhdGUgb3B0aW9uc0xpc3QkOiBPYnNlcnZhYmxlPE1hdE9wdGlvbltdPiA9IHRoaXMuX29wdGlvbnMkLnBpcGUoXG4gICAgc3dpdGNoTWFwKF9vcHRpb25zID0+IF9vcHRpb25zID9cbiAgICAgIF9vcHRpb25zLmNoYW5nZXMucGlwZShcbiAgICAgICAgbWFwKG9wdGlvbnMgPT4gb3B0aW9ucy50b0FycmF5KCkpLFxuICAgICAgICBzdGFydFdpdGg8TWF0T3B0aW9uW10+KF9vcHRpb25zLnRvQXJyYXkoKSksXG4gICAgICApIDogb2YobnVsbClcbiAgICApXG4gICk7XG5cbiAgcHJpdmF0ZSBvcHRpb25zTGVuZ3RoJDogT2JzZXJ2YWJsZTxudW1iZXI+ID0gdGhpcy5vcHRpb25zTGlzdCQucGlwZShcbiAgICBtYXAob3B0aW9ucyA9PiBvcHRpb25zID8gb3B0aW9ucy5sZW5ndGggOiAwKVxuICApO1xuXG4gIC8qKiBQcmV2aW91c2x5IHNlbGVjdGVkIHZhbHVlcyB3aGVuIHVzaW5nIDxtYXQtc2VsZWN0IFttdWx0aXBsZV09XCJ0cnVlXCI+Ki9cbiAgcHJpdmF0ZSBwcmV2aW91c1NlbGVjdGVkVmFsdWVzOiBhbnlbXTtcblxuICBwdWJsaWMgX2Zvcm1Db250cm9sOiBGb3JtQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnJyk7XG5cbiAgLyoqIHdoZXRoZXIgdG8gc2hvdyB0aGUgbm8gZW50cmllcyBmb3VuZCBtZXNzYWdlICovXG4gIHB1YmxpYyBfc2hvd05vRW50cmllc0ZvdW5kJDogT2JzZXJ2YWJsZTxib29sZWFuPiA9IGNvbWJpbmVMYXRlc3QoW1xuICAgIHRoaXMuX2Zvcm1Db250cm9sLnZhbHVlQ2hhbmdlcyxcbiAgICB0aGlzLm9wdGlvbnNMZW5ndGgkXG4gIF0pLnBpcGUoXG4gICAgbWFwKChbdmFsdWUsIG9wdGlvbnNMZW5ndGhdKSA9PiB0aGlzLm5vRW50cmllc0ZvdW5kTGFiZWwgJiYgdmFsdWVcbiAgICAgICYmIG9wdGlvbnNMZW5ndGggPT09IHRoaXMuZ2V0T3B0aW9uc0xlbmd0aE9mZnNldCgpKVxuICApO1xuXG4gIC8qKiBTdWJqZWN0IHRoYXQgZW1pdHMgd2hlbiB0aGUgY29tcG9uZW50IGhhcyBiZWVuIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSBfb25EZXN0cm95ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoTWF0U2VsZWN0KSBwdWJsaWMgbWF0U2VsZWN0OiBNYXRTZWxlY3QsXG4gICAgcHVibGljIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF92aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTWF0T3B0aW9uKSBwdWJsaWMgbWF0T3B0aW9uOiBNYXRPcHRpb24gPSBudWxsLFxuICAgIHByaXZhdGUgbGl2ZUFubm91bmNlcjogTGl2ZUFubm91bmNlcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1hdEZvcm1GaWVsZCkgcHVibGljIG1hdEZvcm1GaWVsZDogTWF0Rm9ybUZpZWxkID0gbnVsbFxuICApIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIHNldCBjdXN0b20gcGFuZWwgY2xhc3NcbiAgICBjb25zdCBwYW5lbENsYXNzID0gJ21hdC1zZWxlY3Qtc2VhcmNoLXBhbmVsJztcbiAgICBpZiAodGhpcy5tYXRTZWxlY3QucGFuZWxDbGFzcykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5tYXRTZWxlY3QucGFuZWxDbGFzcykpIHtcbiAgICAgICAgKDxzdHJpbmdbXT50aGlzLm1hdFNlbGVjdC5wYW5lbENsYXNzKS5wdXNoKHBhbmVsQ2xhc3MpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5tYXRTZWxlY3QucGFuZWxDbGFzcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5tYXRTZWxlY3QucGFuZWxDbGFzcyA9IFt0aGlzLm1hdFNlbGVjdC5wYW5lbENsYXNzLCBwYW5lbENsYXNzXTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMubWF0U2VsZWN0LnBhbmVsQ2xhc3MgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRoaXMubWF0U2VsZWN0LnBhbmVsQ2xhc3NbcGFuZWxDbGFzc10gPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1hdFNlbGVjdC5wYW5lbENsYXNzID0gcGFuZWxDbGFzcztcbiAgICB9XG5cbiAgICAvLyBzZXQgY3VzdG9tIG1hdC1vcHRpb24gY2xhc3MgaWYgdGhlIGNvbXBvbmVudCB3YXMgcGxhY2VkIGluc2lkZSBhIG1hdC1vcHRpb25cbiAgICBpZiAodGhpcy5tYXRPcHRpb24pIHtcbiAgICAgIHRoaXMubWF0T3B0aW9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMubWF0T3B0aW9uLl9nZXRIb3N0RWxlbWVudCgpLmNsYXNzTGlzdC5hZGQoJ2NvbnRhaW5zLW1hdC1zZWxlY3Qtc2VhcmNoJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJzxuZ3gtbWF0LXNlbGVjdC1zZWFyY2g+IG11c3QgYmUgcGxhY2VkIGluc2lkZSBhIDxtYXQtb3B0aW9uPiBlbGVtZW50Jyk7XG4gICAgfVxuXG4gICAgLy8gd2hlbiB0aGUgc2VsZWN0IGRyb3Bkb3duIHBhbmVsIGlzIG9wZW5lZCBvciBjbG9zZWRcbiAgICB0aGlzLm1hdFNlbGVjdC5vcGVuZWRDaGFuZ2VcbiAgICAgIC5waXBlKFxuICAgICAgICBkZWxheSgxKSxcbiAgICAgICAgdGFrZVVudGlsKHRoaXMuX29uRGVzdHJveSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKG9wZW5lZCkgPT4ge1xuICAgICAgICBpZiAob3BlbmVkKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVJbnB1dFdpZHRoKCk7XG4gICAgICAgICAgLy8gZm9jdXMgdGhlIHNlYXJjaCBmaWVsZCB3aGVuIG9wZW5pbmdcbiAgICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZUluaXRpYWxGb2N1cykge1xuICAgICAgICAgICAgdGhpcy5fZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gY2xlYXIgaXQgd2hlbiBjbG9zaW5nXG4gICAgICAgICAgaWYgKHRoaXMuY2xlYXJTZWFyY2hJbnB1dCkge1xuICAgICAgICAgICAgdGhpcy5fcmVzZXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG5cblxuICAgIC8vIHNldCB0aGUgZmlyc3QgaXRlbSBhY3RpdmUgYWZ0ZXIgdGhlIG9wdGlvbnMgY2hhbmdlZFxuICAgIHRoaXMubWF0U2VsZWN0Lm9wZW5lZENoYW5nZVxuICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9vbkRlc3Ryb3kpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm1hdFNlbGVjdC5fa2V5TWFuYWdlcikge1xuICAgICAgICAgIHRoaXMubWF0U2VsZWN0Ll9rZXlNYW5hZ2VyLmNoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLl9vbkRlc3Ryb3kpKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLmFkanVzdFNjcm9sbFRvcFRvRml0QWN0aXZlT3B0aW9uSW50b1ZpZXcoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ19rZXlNYW5hZ2VyIHdhcyBub3QgaW5pdGlhbGl6ZWQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9vcHRpb25zID0gdGhpcy5tYXRTZWxlY3Qub3B0aW9ucztcblxuICAgICAgICAvLyBDbG9zdXJlIHZhcmlhYmxlIGZvciB0cmFja2luZyB0aGUgbW9zdCByZWNlbnQgZmlyc3Qgb3B0aW9uLlxuICAgICAgICAvLyBJbiBvcmRlciB0byBhdm9pZCBhdm9pZCBjYXVzaW5nIHRoZSBsaXN0IHRvXG4gICAgICAgIC8vIHNjcm9sbCB0byB0aGUgdG9wIHdoZW4gb3B0aW9ucyBhcmUgYWRkZWQgdG8gdGhlIGJvdHRvbSBvZlxuICAgICAgICAvLyB0aGUgbGlzdCAoZWc6IGluZmluaXRlIHNjcm9sbCksIHdlIGNvbXBhcmUgb25seVxuICAgICAgICAvLyB0aGUgY2hhbmdlcyB0byB0aGUgZmlyc3Qgb3B0aW9ucyB0byBkZXRlcm1pbmUgaWYgd2VcbiAgICAgICAgLy8gc2hvdWxkIHNldCB0aGUgZmlyc3QgaXRlbSBhcyBhY3RpdmUuXG4gICAgICAgIC8vIFRoaXMgcHJldmVudHMgdW5uZWNlc3Nhcnkgc2Nyb2xsaW5nIHRvIHRoZSB0b3Agb2YgdGhlIGxpc3RcbiAgICAgICAgLy8gd2hlbiBvcHRpb25zIGFyZSBhcHBlbmRlZCwgYnV0IGFsbG93cyB0aGUgZmlyc3QgaXRlbVxuICAgICAgICAvLyBpbiB0aGUgbGlzdCB0byBiZSBzZXQgYXMgYWN0aXZlIGJ5IGRlZmF1bHQgd2hlbiB0aGVyZVxuICAgICAgICAvLyBpcyBubyBhY3RpdmUgc2VsZWN0aW9uXG4gICAgICAgIGxldCBwcmV2aW91c0ZpcnN0T3B0aW9uID0gdGhpcy5fb3B0aW9ucy50b0FycmF5KClbdGhpcy5nZXRPcHRpb25zTGVuZ3RoT2Zmc2V0KCldO1xuXG4gICAgICAgIHRoaXMuX29wdGlvbnMuY2hhbmdlc1xuICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuX29uRGVzdHJveSlcbiAgICAgICAgICApXG4gICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAvLyBhdm9pZCBcImV4cHJlc3Npb24gaGFzIGJlZW4gY2hhbmdlZFwiIGVycm9yXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgLy8gQ29udmVydCB0aGUgUXVlcnlMaXN0IHRvIGFuIGFycmF5XG4gICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zLnRvQXJyYXkoKTtcblxuICAgICAgICAgICAgICAvLyBUaGUgdHJ1ZSBmaXJzdCBpdGVtIGlzIG9mZnNldCBieSAxXG4gICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRGaXJzdE9wdGlvbiA9IG9wdGlvbnNbdGhpcy5nZXRPcHRpb25zTGVuZ3RoT2Zmc2V0KCldO1xuXG4gICAgICAgICAgICAgIGNvbnN0IGtleU1hbmFnZXIgPSB0aGlzLm1hdFNlbGVjdC5fa2V5TWFuYWdlcjtcbiAgICAgICAgICAgICAgaWYgKGtleU1hbmFnZXIgJiYgdGhpcy5tYXRTZWxlY3QucGFuZWxPcGVuKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBzZXQgZmlyc3QgaXRlbSBhY3RpdmUgYW5kIGlucHV0IHdpZHRoXG5cbiAgICAgICAgICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGZpcnN0IG9wdGlvbiBpbiB0aGVzZSBjaGFuZ2VzIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBwcmV2aW91cy5cbiAgICAgICAgICAgICAgICBjb25zdCBmaXJzdE9wdGlvbklzQ2hhbmdlZCA9ICF0aGlzLm1hdFNlbGVjdC5jb21wYXJlV2l0aChwcmV2aW91c0ZpcnN0T3B0aW9uLCBjdXJyZW50Rmlyc3RPcHRpb24pO1xuXG4gICAgICAgICAgICAgICAgLy8gQ0FTRTogVGhlIGZpcnN0IG9wdGlvbiBpcyBkaWZmZXJlbnQgbm93LlxuICAgICAgICAgICAgICAgIC8vIEluZGljaWF0ZXMgd2Ugc2hvdWxkIHNldCBpdCBhcyBhY3RpdmUgYW5kIHNjcm9sbCB0byB0aGUgdG9wLlxuICAgICAgICAgICAgICAgIGlmIChmaXJzdE9wdGlvbklzQ2hhbmdlZFxuICAgICAgICAgICAgICAgICAgfHwgIWtleU1hbmFnZXIuYWN0aXZlSXRlbVxuICAgICAgICAgICAgICAgICAgfHwgIW9wdGlvbnMuZmluZChvcHRpb24gPT4gdGhpcy5tYXRTZWxlY3QuY29tcGFyZVdpdGgob3B0aW9uLCBrZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0pKSkge1xuICAgICAgICAgICAgICAgICAga2V5TWFuYWdlci5zZXRGaXJzdEl0ZW1BY3RpdmUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyB3YWl0IGZvciBwYW5lbCB3aWR0aCBjaGFuZ2VzXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUlucHV0V2lkdGgoKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5kaXNhYmxlU2Nyb2xsVG9BY3RpdmVPbk9wdGlvbnNDaGFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmFkanVzdFNjcm9sbFRvcFRvRml0QWN0aXZlT3B0aW9uSW50b1ZpZXcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAvLyBVcGRhdGUgb3VyIHJlZmVyZW5jZVxuICAgICAgICAgICAgICBwcmV2aW91c0ZpcnN0T3B0aW9uID0gY3VycmVudEZpcnN0T3B0aW9uO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIC8vIGFkZCBvciByZW1vdmUgY3NzIGNsYXNzIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRvIHNob3cgdGhlIG5vIGVudHJpZXMgZm91bmQgbWVzc2FnZVxuICAgIC8vIG5vdGU6IHRoaXMgaXMgaGFja3lcbiAgICB0aGlzLl9zaG93Tm9FbnRyaWVzRm91bmQkLnBpcGUoXG4gICAgICB0YWtlVW50aWwodGhpcy5fb25EZXN0cm95KVxuICAgICkuc3Vic2NyaWJlKHNob3dOb0VudHJpZXNGb3VuZCA9PiB7XG4gICAgICAvLyBzZXQgbm8gZW50cmllcyBmb3VuZCBjbGFzcyBvbiBtYXQgb3B0aW9uXG4gICAgICBpZiAodGhpcy5tYXRPcHRpb24pIHtcbiAgICAgICAgaWYgKHNob3dOb0VudHJpZXNGb3VuZCkge1xuICAgICAgICAgIHRoaXMubWF0T3B0aW9uLl9nZXRIb3N0RWxlbWVudCgpLmNsYXNzTGlzdC5hZGQoJ21hdC1zZWxlY3Qtc2VhcmNoLW5vLWVudHJpZXMtZm91bmQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm1hdE9wdGlvbi5fZ2V0SG9zdEVsZW1lbnQoKS5jbGFzc0xpc3QucmVtb3ZlKCdtYXQtc2VsZWN0LXNlYXJjaC1uby1lbnRyaWVzLWZvdW5kJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIHJlc2l6ZSB0aGUgaW5wdXQgd2lkdGggd2hlbiB0aGUgdmlld3BvcnQgaXMgcmVzaXplZCwgaS5lLiB0aGUgdHJpZ2dlciB3aWR0aCBjb3VsZCBwb3RlbnRpYWxseSBiZSByZXNpemVkXG4gICAgdGhpcy5fdmlld3BvcnRSdWxlci5jaGFuZ2UoKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX29uRGVzdHJveSkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMubWF0U2VsZWN0LnBhbmVsT3Blbikge1xuICAgICAgICAgIHRoaXMudXBkYXRlSW5wdXRXaWR0aCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRoaXMuaW5pdE11bHRpcGxlSGFuZGxpbmcoKTtcblxuICAgIHRoaXMub3B0aW9uc0xpc3QkLnBpcGUoXG4gICAgICB0YWtlVW50aWwodGhpcy5fb25EZXN0cm95KVxuICAgICkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIC8vIHVwZGF0ZSB2aWV3IHdoZW4gYXZhaWxhYmxlIG9wdGlvbnMgY2hhbmdlXG4gICAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuICB9XG5cbiAgX2VtaXRTZWxlY3RBbGxCb29sZWFuVG9QYXJlbnQoc3RhdGU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnRvZ2dsZUFsbC5lbWl0KHN0YXRlKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX29uRGVzdHJveS5uZXh0KCk7XG4gICAgdGhpcy5fb25EZXN0cm95LmNvbXBsZXRlKCk7XG4gIH1cblxuICBfaXNUb2dnbGVBbGxDaGVja2JveFZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubWF0U2VsZWN0Lm11bHRpcGxlICYmIHRoaXMuc2hvd1RvZ2dsZUFsbENoZWNrYm94O1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgdGhlIGtleSBkb3duIGV2ZW50IHdpdGggTWF0U2VsZWN0LlxuICAgKiBBbGxvd3MgZS5nLiBzZWxlY3Rpbmcgd2l0aCBlbnRlciBrZXksIG5hdmlnYXRpb24gd2l0aCBhcnJvdyBrZXlzLCBldGMuXG4gICAqIEBwYXJhbSBldmVudFxuICAgKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAvLyBQcmV2ZW50IHByb3BhZ2F0aW9uIGZvciBhbGwgYWxwaGFudW1lcmljIGNoYXJhY3RlcnMgaW4gb3JkZXIgdG8gYXZvaWQgc2VsZWN0aW9uIGlzc3Vlc1xuICAgIGlmICgoZXZlbnQua2V5ICYmIGV2ZW50LmtleS5sZW5ndGggPT09IDEpIHx8XG4gICAgICAoZXZlbnQua2V5Q29kZSA+PSBBICYmIGV2ZW50LmtleUNvZGUgPD0gWikgfHxcbiAgICAgIChldmVudC5rZXlDb2RlID49IFpFUk8gJiYgZXZlbnQua2V5Q29kZSA8PSBOSU5FKSB8fFxuICAgICAgKGV2ZW50LmtleUNvZGUgPT09IFNQQUNFKVxuICAgICAgfHwgKHRoaXMucHJldmVudEhvbWVFbmRLZXlQcm9wYWdhdGlvbiAmJiAoZXZlbnQua2V5Q29kZSA9PT0gSE9NRSB8fCBldmVudC5rZXlDb2RlID09PSBFTkQpKVxuICAgICkge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWF0U2VsZWN0Lm11bHRpcGxlICYmIGV2ZW50LmtleSAmJiBldmVudC5rZXlDb2RlID09PSBFTlRFUikge1xuICAgICAgLy8gUmVnYWluIGZvY3VzIGFmdGVyIG11bHRpc2VsZWN0LCBzbyB3ZSBjYW4gZnVydGhlciB0eXBlXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuX2ZvY3VzKCkpO1xuICAgIH1cblxuICAgIC8vIFNwZWNpYWwgY2FzZSBpZiBjbGljayBFc2NhcGUsIGlmIGlucHV0IGlzIGVtcHR5LCBjbG9zZSB0aGUgZHJvcGRvd24sIGlmIG5vdCwgZW1wdHkgb3V0IHRoZSBzZWFyY2ggZmllbGRcbiAgICBpZiAodGhpcy5lbmFibGVDbGVhck9uRXNjYXBlUHJlc3NlZCA9PT0gdHJ1ZSAmJiBldmVudC5rZXlDb2RlID09PSBFU0NBUEUgJiYgdGhpcy52YWx1ZSkge1xuICAgICAgdGhpcy5fcmVzZXQodHJ1ZSk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyB0aGUga2V5IHVwIGV2ZW50IHdpdGggTWF0U2VsZWN0LlxuICAgKiBBbGxvd3MgZS5nLiB0aGUgYW5ub3VuY2luZyBvZiB0aGUgY3VycmVudGx5IGFjdGl2ZURlc2NlbmRhbnQgYnkgc2NyZWVuIHJlYWRlcnMuXG4gICAqL1xuICBfaGFuZGxlS2V5dXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gVVBfQVJST1cgfHwgZXZlbnQua2V5Q29kZSA9PT0gRE9XTl9BUlJPVykge1xuICAgICAgY29uc3QgYXJpYUFjdGl2ZURlc2NlbmRhbnRJZCA9IHRoaXMubWF0U2VsZWN0Ll9nZXRBcmlhQWN0aXZlRGVzY2VuZGFudCgpO1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9vcHRpb25zLnRvQXJyYXkoKS5maW5kSW5kZXgoaXRlbSA9PiBpdGVtLmlkID09PSBhcmlhQWN0aXZlRGVzY2VuZGFudElkKTtcbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgY29uc3QgYWN0aXZlRGVzY2VuZGFudCA9IHRoaXMuX29wdGlvbnMudG9BcnJheSgpW2luZGV4XTtcbiAgICAgICAgdGhpcy5saXZlQW5ub3VuY2VyLmFubm91bmNlKFxuICAgICAgICAgIGFjdGl2ZURlc2NlbmRhbnQudmlld1ZhbHVlICsgJyAnXG4gICAgICAgICAgKyB0aGlzLmdldEFyaWFJbmRleChpbmRleClcbiAgICAgICAgICArIHRoaXMuaW5kZXhBbmRMZW5ndGhTY3JlZW5SZWFkZXJUZXh0XG4gICAgICAgICAgKyB0aGlzLmdldEFyaWFMZW5ndGgoKVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgdGhlIGluZGV4IG9mIHRoZSBjdXJyZW50IG9wdGlvbiwgdGFraW5nIHRoZSBvZmZzZXQgdG8gbGVuZ3RoIGludG8gYWNjb3VudC5cbiAgICogZXhhbXBsZXM6XG4gICAqICAgIENhc2UgMSBbU2VhcmNoLCAxLCAyLCAzXSB3aWxsIGhhdmUgb2Zmc2V0IG9mIDEsIGR1ZSB0byBzZWFyY2ggYW5kIHdpbGwgcmVhZCBpbmRleCBvZiB0b3RhbC5cbiAgICogICAgQ2FzZSAyIFsxLCAyLCAzXSB3aWxsIGhhdmUgb2Zmc2V0IG9mIDAgYW5kIHdpbGwgcmVhZCBpbmRleCArMSBvZiB0b3RhbC5cbiAgICovXG4gIGdldEFyaWFJbmRleChvcHRpb25JbmRleDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5nZXRPcHRpb25zTGVuZ3RoT2Zmc2V0KCkgPT09IDApIHtcbiAgICAgIHJldHVybiBvcHRpb25JbmRleCArIDE7XG4gICAgfVxuICAgIHJldHVybiBvcHRpb25JbmRleDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgdGhlIGxlbmd0aCBvZiB0aGUgb3B0aW9ucywgdGFraW5nIHRoZSBvZmZzZXQgdG8gbGVuZ3RoIGludG8gYWNjb3VudC5cbiAgICogZXhhbXBsZXM6XG4gICAqICAgIENhc2UgMSBbU2VhcmNoLCAxLCAyLCAzXSB3aWxsIGhhdmUgbGVuZ3RoIG9mIG9wdGlvbnMubGVuZ3RoIC0xLCBkdWUgdG8gc2VhcmNoLlxuICAgKiAgICBDYXNlIDIgWzEsIDIsIDNdIHdpbGwgaGF2ZSBsZW5ndGggb2Ygb3B0aW9ucy5sZW5ndGguXG4gICAqL1xuICBnZXRBcmlhTGVuZ3RoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnMudG9BcnJheSgpLmxlbmd0aCAtIHRoaXMuZ2V0T3B0aW9uc0xlbmd0aE9mZnNldCgpO1xuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fbGFzdEV4dGVybmFsSW5wdXRWYWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuX2Zvcm1Db250cm9sLnNldFZhbHVlKHZhbHVlKTtcbiAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgb25CbHVyKCkge1xuICAgIHRoaXMub25Ub3VjaGVkKCk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZCkge1xuICAgIHRoaXMuX2Zvcm1Db250cm9sLnZhbHVlQ2hhbmdlcy5waXBlKFxuICAgICAgZmlsdGVyKHZhbHVlID0+IHZhbHVlICE9PSB0aGlzLl9sYXN0RXh0ZXJuYWxJbnB1dFZhbHVlKSxcbiAgICAgIHRhcCgoKSA9PiB0aGlzLl9sYXN0RXh0ZXJuYWxJbnB1dFZhbHVlID0gdW5kZWZpbmVkKSxcbiAgICAgIHRha2VVbnRpbCh0aGlzLl9vbkRlc3Ryb3kpXG4gICAgKS5zdWJzY3JpYmUoZm4pO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IEZ1bmN0aW9uKSB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBzZWFyY2ggaW5wdXQgZmllbGRcbiAgICovXG4gIHB1YmxpYyBfZm9jdXMoKSB7XG4gICAgaWYgKCF0aGlzLnNlYXJjaFNlbGVjdElucHV0IHx8ICF0aGlzLm1hdFNlbGVjdC5wYW5lbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBzYXZlIGFuZCByZXN0b3JlIHNjcm9sbFRvcCBvZiBwYW5lbCwgc2luY2UgaXQgd2lsbCBiZSByZXNldCBieSBmb2N1cygpXG4gICAgLy8gbm90ZTogdGhpcyBpcyBoYWNreVxuICAgIGNvbnN0IHBhbmVsID0gdGhpcy5tYXRTZWxlY3QucGFuZWwubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBzY3JvbGxUb3AgPSBwYW5lbC5zY3JvbGxUb3A7XG5cbiAgICAvLyBmb2N1c1xuICAgIHRoaXMuc2VhcmNoU2VsZWN0SW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuXG4gICAgcGFuZWwuc2Nyb2xsVG9wID0gc2Nyb2xsVG9wO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgY3VycmVudCBzZWFyY2ggdmFsdWVcbiAgICogQHBhcmFtIGZvY3VzIHdoZXRoZXIgdG8gZm9jdXMgYWZ0ZXIgcmVzZXR0aW5nXG4gICAqL1xuICBwdWJsaWMgX3Jlc2V0KGZvY3VzPzogYm9vbGVhbikge1xuICAgIHRoaXMuX2Zvcm1Db250cm9sLnNldFZhbHVlKCcnKTtcbiAgICBpZiAoZm9jdXMpIHtcbiAgICAgIHRoaXMuX2ZvY3VzKCk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgaGFuZGxpbmcgPG1hdC1zZWxlY3QgW211bHRpcGxlXT1cInRydWVcIj5cbiAgICogTm90ZTogdG8gaW1wcm92ZSB0aGlzIGNvZGUsIG1hdC1zZWxlY3Qgc2hvdWxkIGJlIGV4dGVuZGVkIHRvIGFsbG93IGRpc2FibGluZyByZXNldHRpbmcgdGhlIHNlbGVjdGlvbiB3aGlsZSBmaWx0ZXJpbmcuXG4gICAqL1xuICBwcml2YXRlIGluaXRNdWx0aXBsZUhhbmRsaW5nKCkge1xuICAgIGlmICghdGhpcy5tYXRTZWxlY3QubmdDb250cm9sKSB7XG4gICAgICBpZiAodGhpcy5tYXRTZWxlY3QubXVsdGlwbGUpIHtcbiAgICAgICAgLy8gbm90ZTogdGhlIGFjY2VzcyB0byBtYXRTZWxlY3QubmdDb250cm9sIChpbnN0ZWFkIG9mIG1hdFNlbGVjdC52YWx1ZSAvIG1hdFNlbGVjdC52YWx1ZUNoYW5nZXMpXG4gICAgICAgIC8vIGlzIG5lY2Vzc2FyeSB0byBwcm9wZXJseSB3b3JrIGluIG11bHRpLXNlbGVjdGlvbiBtb2RlLlxuICAgICAgICBjb25zb2xlLmVycm9yKCd0aGUgbWF0LXNlbGVjdCBjb250YWluaW5nIG5neC1tYXQtc2VsZWN0LXNlYXJjaCBtdXN0IGhhdmUgYSBuZ01vZGVsIG9yIGZvcm1Db250cm9sIGRpcmVjdGl2ZSB3aGVuIG11bHRpcGxlPXRydWUnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gaWYgPG1hdC1zZWxlY3QgW211bHRpcGxlXT1cInRydWVcIj5cbiAgICAvLyBzdG9yZSBwcmV2aW91c2x5IHNlbGVjdGVkIHZhbHVlcyBhbmQgcmVzdG9yZSB0aGVtIHdoZW4gdGhleSBhcmUgZGVzZWxlY3RlZFxuICAgIC8vIGJlY2F1c2UgdGhlIG9wdGlvbiBpcyBub3QgYXZhaWxhYmxlIHdoaWxlIHdlIGFyZSBjdXJyZW50bHkgZmlsdGVyaW5nXG4gICAgdGhpcy5wcmV2aW91c1NlbGVjdGVkVmFsdWVzID0gdGhpcy5tYXRTZWxlY3QubmdDb250cm9sLnZhbHVlO1xuXG4gICAgdGhpcy5tYXRTZWxlY3QubmdDb250cm9sLnZhbHVlQ2hhbmdlc1xuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX29uRGVzdHJveSkpXG4gICAgICAuc3Vic2NyaWJlKChjdXJyZW50U2VsZWN0ZWRWYWx1ZXMpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLm1hdFNlbGVjdC5tdWx0aXBsZSkge1xuICAgICAgICAgIHRoaXMucHJldmlvdXNTZWxlY3RlZFZhbHVlcyA9IGN1cnJlbnRTZWxlY3RlZFZhbHVlcztcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuYWx3YXlzUmVzdG9yZVNlbGVjdGVkT3B0aW9uc011bHRpKSB7XG4gICAgICAgICAgdGhpcy5wcmV2aW91c1NlbGVjdGVkVmFsdWVzID0gY3VycmVudFNlbGVjdGVkVmFsdWVzO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbHRlcmluZ0luUHJvZ3Jlc3MgPSAodGhpcy5fZm9ybUNvbnRyb2wudmFsdWUgJiYgdGhpcy5fZm9ybUNvbnRyb2wudmFsdWUubGVuZ3RoKTtcblxuICAgICAgICBsZXQgcmVzdG9yZVNlbGVjdGVkVmFsdWVzID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKGZpbHRlcmluZ0luUHJvZ3Jlc3MgJiYgdGhpcy5wcmV2aW91c1NlbGVjdGVkVmFsdWVzICYmIEFycmF5LmlzQXJyYXkodGhpcy5wcmV2aW91c1NlbGVjdGVkVmFsdWVzKSkge1xuICAgICAgICAgIGlmICghY3VycmVudFNlbGVjdGVkVmFsdWVzIHx8ICFBcnJheS5pc0FycmF5KGN1cnJlbnRTZWxlY3RlZFZhbHVlcykpIHtcbiAgICAgICAgICAgIGN1cnJlbnRTZWxlY3RlZFZhbHVlcyA9IFtdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IG9wdGlvblZhbHVlcyA9IHRoaXMubWF0U2VsZWN0Lm9wdGlvbnMubWFwKG9wdGlvbiA9PiBvcHRpb24udmFsdWUpO1xuXG4gICAgICAgICAgdGhpcy5wcmV2aW91c1NlbGVjdGVkVmFsdWVzLmZvckVhY2gocHJldmlvdXNWYWx1ZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwcmV2aW91c1ZhbHVlRGVzZWxlY3RlZER1cmluZ0ZpbHRlcmluZyA9ICFjdXJyZW50U2VsZWN0ZWRWYWx1ZXMuc29tZSh2ID0+IHRoaXMubWF0U2VsZWN0LmNvbXBhcmVXaXRoKHYsIHByZXZpb3VzVmFsdWUpKSAmJiAhb3B0aW9uVmFsdWVzLnNvbWUodiA9PiB0aGlzLm1hdFNlbGVjdC5jb21wYXJlV2l0aCh2LCBwcmV2aW91c1ZhbHVlKSk7XG5cbiAgICAgICAgICAgIGlmIChwcmV2aW91c1ZhbHVlRGVzZWxlY3RlZER1cmluZ0ZpbHRlcmluZykge1xuICAgICAgICAgICAgICBjdXJyZW50U2VsZWN0ZWRWYWx1ZXMucHVzaChwcmV2aW91c1ZhbHVlKTtcbiAgICAgICAgICAgICAgcmVzdG9yZVNlbGVjdGVkVmFsdWVzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJldmlvdXNTZWxlY3RlZFZhbHVlcyA9IGN1cnJlbnRTZWxlY3RlZFZhbHVlcztcblxuICAgICAgICBpZiAocmVzdG9yZVNlbGVjdGVkVmFsdWVzKSB7XG4gICAgICAgICAgdGhpcy5tYXRTZWxlY3QuX29uQ2hhbmdlKGN1cnJlbnRTZWxlY3RlZFZhbHVlcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjcm9sbHMgdGhlIGN1cnJlbnRseSBhY3RpdmUgb3B0aW9uIGludG8gdGhlIHZpZXcgaWYgaXQgaXMgbm90IHlldCB2aXNpYmxlLlxuICAgKi9cbiAgcHJpdmF0ZSBhZGp1c3RTY3JvbGxUb3BUb0ZpdEFjdGl2ZU9wdGlvbkludG9WaWV3KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm1hdFNlbGVjdC5wYW5lbCAmJiB0aGlzLm1hdFNlbGVjdC5vcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IG1hdE9wdGlvbkhlaWdodCA9IHRoaXMuZ2V0TWF0T3B0aW9uSGVpZ2h0KCk7XG4gICAgICBjb25zdCBhY3RpdmVPcHRpb25JbmRleCA9IHRoaXMubWF0U2VsZWN0Ll9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCB8fCAwO1xuICAgICAgY29uc3QgbGFiZWxDb3VudCA9IF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uKGFjdGl2ZU9wdGlvbkluZGV4LCB0aGlzLm1hdFNlbGVjdC5vcHRpb25zLCB0aGlzLm1hdFNlbGVjdC5vcHRpb25Hcm91cHMpO1xuICAgICAgLy8gSWYgdGhlIGNvbXBvbmVudCBpcyBpbiBhIE1hdE9wdGlvbiwgdGhlIGFjdGl2ZUl0ZW1JbmRleCB3aWxsIGJlIG9mZnNldCBieSBvbmUuXG4gICAgICBjb25zdCBpbmRleE9mT3B0aW9uVG9GaXRJbnRvVmlldyA9ICh0aGlzLm1hdE9wdGlvbiA/IC0xIDogMCkgKyBsYWJlbENvdW50ICsgYWN0aXZlT3B0aW9uSW5kZXg7XG4gICAgICBjb25zdCBjdXJyZW50U2Nyb2xsVG9wID0gdGhpcy5tYXRTZWxlY3QucGFuZWwubmF0aXZlRWxlbWVudC5zY3JvbGxUb3A7XG5cbiAgICAgIGNvbnN0IHNlYXJjaElucHV0SGVpZ2h0ID0gdGhpcy5pbm5lclNlbGVjdFNlYXJjaC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICAgIGNvbnN0IGFtb3VudE9mVmlzaWJsZU9wdGlvbnMgPSBNYXRoLmZsb29yKChTRUxFQ1RfUEFORUxfTUFYX0hFSUdIVCAtIHNlYXJjaElucHV0SGVpZ2h0KSAvIG1hdE9wdGlvbkhlaWdodCk7XG5cbiAgICAgIGNvbnN0IGluZGV4T2ZGaXJzdFZpc2libGVPcHRpb24gPSBNYXRoLnJvdW5kKChjdXJyZW50U2Nyb2xsVG9wICsgc2VhcmNoSW5wdXRIZWlnaHQpIC8gbWF0T3B0aW9uSGVpZ2h0KSAtIDE7XG5cbiAgICAgIGlmIChpbmRleE9mRmlyc3RWaXNpYmxlT3B0aW9uID49IGluZGV4T2ZPcHRpb25Ub0ZpdEludG9WaWV3KSB7XG4gICAgICAgIHRoaXMubWF0U2VsZWN0LnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gaW5kZXhPZk9wdGlvblRvRml0SW50b1ZpZXcgKiBtYXRPcHRpb25IZWlnaHQ7XG4gICAgICB9IGVsc2UgaWYgKGluZGV4T2ZGaXJzdFZpc2libGVPcHRpb24gKyBhbW91bnRPZlZpc2libGVPcHRpb25zIDw9IGluZGV4T2ZPcHRpb25Ub0ZpdEludG9WaWV3KSB7XG4gICAgICAgIHRoaXMubWF0U2VsZWN0LnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gKGluZGV4T2ZPcHRpb25Ub0ZpdEludG9WaWV3ICsgMSkgKiBtYXRPcHRpb25IZWlnaHRcbiAgICAgICAgICAtIChTRUxFQ1RfUEFORUxfTUFYX0hFSUdIVCAtIHNlYXJjaElucHV0SGVpZ2h0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldCB0aGUgd2lkdGggb2YgdGhlIGlubmVyU2VsZWN0U2VhcmNoIHRvIGZpdCBldmVuIGN1c3RvbSBzY3JvbGxiYXJzXG4gICAqICBBbmQgc3VwcG9ydCBhbGwgT3BlcmF0aW9uIFN5c3RlbXNcbiAgICovXG4gIHB1YmxpYyB1cGRhdGVJbnB1dFdpZHRoKCkge1xuICAgIGlmICghdGhpcy5pbm5lclNlbGVjdFNlYXJjaCB8fCAhdGhpcy5pbm5lclNlbGVjdFNlYXJjaC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuaW5uZXJTZWxlY3RTZWFyY2gubmF0aXZlRWxlbWVudDtcbiAgICBsZXQgcGFuZWxFbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgICB3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudCkge1xuICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXQtc2VsZWN0LXBhbmVsJykpIHtcbiAgICAgICAgcGFuZWxFbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwYW5lbEVsZW1lbnQpIHtcbiAgICAgIHRoaXMuaW5uZXJTZWxlY3RTZWFyY2gubmF0aXZlRWxlbWVudC5zdHlsZS53aWR0aCA9IHBhbmVsRWxlbWVudC5jbGllbnRXaWR0aCArICdweCc7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRNYXRPcHRpb25IZWlnaHQoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5tYXRTZWxlY3Qub3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXRTZWxlY3Qub3B0aW9ucy5maXJzdC5fZ2V0SG9zdEVsZW1lbnQoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRoZSBvZmZzZXQgdG8gbGVuZ3RoIHRoYXQgY2FuIGJlIGNhdXNlZCBieSB0aGUgb3B0aW9uYWwgbWF0T3B0aW9uIHVzZWQgYXMgYSBzZWFyY2ggaW5wdXQuXG4gICAqL1xuICBwcml2YXRlIGdldE9wdGlvbnNMZW5ndGhPZmZzZXQoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5tYXRPcHRpb24pIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxufVxuIiwiPCEtLSBQbGFjZWhvbGRlciB0byBhZGp1c3QgdmVydGljYWwgb2Zmc2V0IG9mIHRoZSBtYXQtb3B0aW9uIGVsZW1lbnRzIC0tPlxuPGlucHV0IG1hdElucHV0IGNsYXNzPVwibWF0LXNlbGVjdC1zZWFyY2gtaW5wdXQgbWF0LXNlbGVjdC1zZWFyY2gtaGlkZGVuXCIvPlxuXG48IS0tIE5vdGU6IHRoZSAgbWF0LWRhdGVwaWNrZXItY29udGVudCBtYXQtdGFiLWhlYWRlciBhcmUgbmVlZGVkIHRvIGluaGVyaXQgdGhlIG1hdGVyaWFsIHRoZW1lIGNvbG9ycywgc2VlIFBSICMyMiAtLT5cbjxkaXZcbiAgICAgICNpbm5lclNlbGVjdFNlYXJjaFxuICAgICAgY2xhc3M9XCJtYXQtc2VsZWN0LXNlYXJjaC1pbm5lciBtYXQtdHlwb2dyYXBoeSBtYXQtZGF0ZXBpY2tlci1jb250ZW50IG1hdC10YWItaGVhZGVyXCJcbiAgICAgIFtuZ0NsYXNzXT1cInsnbWF0LXNlbGVjdC1zZWFyY2gtaW5uZXItbXVsdGlwbGUnOiBtYXRTZWxlY3QubXVsdGlwbGUsICdtYXQtc2VsZWN0LXNlYXJjaC1pbm5lci10b2dnbGUtYWxsJzogX2lzVG9nZ2xlQWxsQ2hlY2tib3hWaXNpYmxlKCkgfVwiPlxuXG4gIDxtYXQtY2hlY2tib3ggKm5nSWY9XCJfaXNUb2dnbGVBbGxDaGVja2JveFZpc2libGUoKVwiXG4gICAgICAgICAgICAgICAgW2NvbG9yXT1cIm1hdEZvcm1GaWVsZD8uY29sb3JcIlxuICAgICAgICAgICAgICAgIGNsYXNzPVwibWF0LXNlbGVjdC1zZWFyY2gtdG9nZ2xlLWFsbC1jaGVja2JveFwiXG4gICAgICAgICAgICAgICAgW2NoZWNrZWRdPVwidG9nZ2xlQWxsQ2hlY2tib3hDaGVja2VkXCJcbiAgICAgICAgICAgICAgICBbaW5kZXRlcm1pbmF0ZV09XCJ0b2dnbGVBbGxDaGVja2JveEluZGV0ZXJtaW5hdGVcIlxuICAgICAgICAgICAgICAgIFttYXRUb29sdGlwXT1cInRvZ2dsZUFsbENoZWNrYm94VG9vbHRpcE1lc3NhZ2VcIlxuICAgICAgICAgICAgICAgIG1hdFRvb2x0aXBDbGFzcz1cIm5neC1tYXQtc2VsZWN0LXNlYXJjaC10b2dnbGUtYWxsLXRvb2x0aXBcIlxuICAgICAgICAgICAgICAgIFttYXRUb29sdGlwUG9zaXRpb25dPVwidG9vZ2xlQWxsQ2hlY2tib3hUb29sdGlwUG9zaXRpb25cIlxuICAgICAgICAgICAgICAgIChjaGFuZ2UpPVwiX2VtaXRTZWxlY3RBbGxCb29sZWFuVG9QYXJlbnQoJGV2ZW50LmNoZWNrZWQpXCJcbiAgPjwvbWF0LWNoZWNrYm94PlxuXG4gIDxpbnB1dCBjbGFzcz1cIm1hdC1zZWxlY3Qtc2VhcmNoLWlucHV0IG1hdC1pbnB1dC1lbGVtZW50XCJcbiAgICAgICAgIGF1dG9jb21wbGV0ZT1cIm9mZlwiXG4gICAgICAgICBbdHlwZV09XCJ0eXBlXCJcbiAgICAgICAgIFtmb3JtQ29udHJvbF09XCJfZm9ybUNvbnRyb2xcIlxuICAgICAgICAgI3NlYXJjaFNlbGVjdElucHV0XG4gICAgICAgICAoa2V5ZG93bik9XCJfaGFuZGxlS2V5ZG93bigkZXZlbnQpXCJcbiAgICAgICAgIChrZXl1cCk9XCJfaGFuZGxlS2V5dXAoJGV2ZW50KVwiXG4gICAgICAgICAoYmx1cik9XCJvbkJsdXIoKVwiXG4gICAgICAgICBbcGxhY2Vob2xkZXJdPVwicGxhY2Vob2xkZXJMYWJlbFwiXG4gICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbFwiXG4gIC8+XG4gIDxtYXQtc3Bpbm5lciAqbmdJZj1cInNlYXJjaGluZ1wiXG4gICAgICAgICAgY2xhc3M9XCJtYXQtc2VsZWN0LXNlYXJjaC1zcGlubmVyXCJcbiAgICAgICAgICBkaWFtZXRlcj1cIjE2XCI+PC9tYXQtc3Bpbm5lcj5cblxuICA8YnV0dG9uIG1hdC1idXR0b25cbiAgICAgICAgICAqbmdJZj1cIiFoaWRlQ2xlYXJTZWFyY2hCdXR0b24gJiYgdmFsdWUgJiYgIXNlYXJjaGluZ1wiXG4gICAgICAgICAgbWF0LWljb24tYnV0dG9uXG4gICAgICAgICAgYXJpYS1sYWJlbD1cIkNsZWFyXCJcbiAgICAgICAgICAoY2xpY2spPVwiX3Jlc2V0KHRydWUpXCJcbiAgICAgICAgICBjbGFzcz1cIm1hdC1zZWxlY3Qtc2VhcmNoLWNsZWFyXCI+XG4gICAgPG5nLWNvbnRlbnQgKm5nSWY9XCJjbGVhckljb247IGVsc2UgZGVmYXVsdEljb25cIiBzZWxlY3Q9XCJbbmd4TWF0U2VsZWN0U2VhcmNoQ2xlYXJdXCI+PC9uZy1jb250ZW50PlxuICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdEljb24+XG4gICAgICA8bWF0LWljb24+Y2xvc2U8L21hdC1pY29uPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIDwvYnV0dG9uPlxuXG4gIDxuZy1jb250ZW50IHNlbGVjdD1cIi5tYXQtc2VsZWN0LXNlYXJjaC1jdXN0b20taGVhZGVyLWNvbnRlbnRcIj48L25nLWNvbnRlbnQ+XG5cbjwvZGl2PlxuXG48ZGl2ICpuZ0lmPVwiX3Nob3dOb0VudHJpZXNGb3VuZCQgfCBhc3luY1wiXG4gICAgIGNsYXNzPVwibWF0LXNlbGVjdC1zZWFyY2gtbm8tZW50cmllcy1mb3VuZFwiPlxuICB7e25vRW50cmllc0ZvdW5kTGFiZWx9fVxuPC9kaXY+XG48IS0tXG5Db3B5cmlnaHQgKGMpIDIwMTggQml0aG9zdCBHbWJIIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cblVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG5mb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4tLT5cbiJdfQ==