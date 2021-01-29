import {Component, ViewChild} from '@angular/core';
import {ListTaskComponent} from '../components/list-task/list-task.component';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    tasks;
    @ViewChild(ListTaskComponent) listTask: ListTaskComponent;

    constructor() {
    }

    filterTask() {
        this.listTask.filterTask();
    }
}
