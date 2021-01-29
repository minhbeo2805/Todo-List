import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {PRORIT_LIST} from '../../constants/contanst';
import {DOCUMENT} from '@angular/common';
import {TaskService} from '../../services/task.service';
import {FormBuilder, Validators} from '@angular/forms';
import {futureDateValidator} from '../../directives/future-date-validator.directive';

@Component({
    selector: 'app-list-task',
    templateUrl: './list-task.component.html',
    styleUrls: ['./list-task.component.scss'],
})
export class ListTaskComponent implements OnInit {
    tasks: any;
    @Output() tasksChangeEvent: EventEmitter<any> = new EventEmitter();
    filterText = '';
    displayTasks: [];
    checkedIndex = [];
    priorityList = PRORIT_LIST;
    private updateForm = this.formBuilder.group(
        {
            title: ['', Validators.required],
            description: [''],
            dueDate: ['', futureDateValidator()],
            priority: ['normal']
        }
    );


    constructor(@Inject(DOCUMENT) document, private formBuilder: FormBuilder) {
    }

    filterTask() {
        this.checkedIndex = [];
        this.tasks = TaskService.loadTasks();
        if (this.tasks) {
            this.displayTasks = this.tasks.filter(
                task => {
                    return task.title.includes(this.filterText);
                }
            );
        } else {
            this.displayTasks = [];
        }
    }

    ngOnInit(): void {
        this.filterTask();
    }

    showDetail(index) {
        const targetDom = document.getElementById('task' + index);
        if (targetDom.classList.contains('active')) {
            targetDom.classList.remove('active');
        } else {
            const detailDoms = document.getElementsByClassName('task-detail');
            [].forEach.call(detailDoms, (el) => {
                el.classList.remove('active');
            });
            targetDom.classList.add('active');
        }

        this.updateForm.controls.title.setValue(this.tasks[index].title);
        this.updateForm.controls.description.setValue(this.tasks[index].description);
        this.updateForm.controls.dueDate.setValue(this.tasks[index].dueDate);
        this.updateForm.controls.priority.setValue(this.tasks[index].priority);
    }

    removeSingleTask(indexOrder) {
        TaskService.removeTasks([indexOrder]);
        this.tasksChangeEvent.emit(null);
    }

    removeMultiTask() {
        TaskService.removeTasks(this.checkedIndex);
        this.checkedIndex = [];
        this.tasksChangeEvent.emit(null);
    }

    checkboxChange(indexOrder) {
        if (!this.checkedIndex.includes(indexOrder)) {
            this.checkedIndex.push(indexOrder);
        } else {
            this.checkedIndex.splice(this.checkedIndex.indexOf(indexOrder), 1);
        }
    }

    updateTask(index) {
        this.tasks[index].title = this.updateForm.controls.title.value;
        this.tasks[index].description = this.updateForm.controls.description.value;
        this.tasks[index].dueDate = this.updateForm.controls.dueDate.value;
        this.tasks[index].priority = this.updateForm.controls.priority.value;

        TaskService.saveTasks(TaskService.sortByDate(this.tasks));
        this.tasksChangeEvent.emit(null);
    }
}
