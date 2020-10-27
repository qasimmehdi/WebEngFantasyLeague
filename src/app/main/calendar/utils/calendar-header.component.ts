import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
    selector: 'mwl-demo-utils-calendar-header',
    templateUrl: './calendar-header.component.html',
    styleUrls: [
        './calendar-header.component.scss',
        '../../../../../node_modules/bootstrap-css-only/css/bootstrap.min.css'
    ]
})
export class CalendarHeaderComponent {
    @Input() view: CalendarView;

    @Input() viewDate: Date;

    @Input() locale: string = 'en';

    @Output() viewChange = new EventEmitter<CalendarView>();

    @Output() viewDateChange = new EventEmitter<Date>();

    CalendarView = CalendarView;
}
