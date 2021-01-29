import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {futureDateValidator} from '../../directives/future-date-validator.directive';
import {TaskService} from '../../services/task.service';
import {PRORIT_LIST} from '../../constants/contanst';

@Component({
    selector: 'app-new-task',
    templateUrl: './new-task.component.html',
    styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent {
    @Output() addTaskEvent: EventEmitter<any> = new EventEmitter();
    private readonly taskForm: FormGroup;
    private currentDate = new Date();
    priorityList = PRORIT_LIST;

    constructor(private formBuilder: FormBuilder) {
        // remove hour
        this.currentDate.setHours(0, 0, 0, 0);
        this.taskForm = this.formBuilder.group(
            {
                title: ['', Validators.required],
                description: [''],
                dueDate: [this.currentDate.toISOString(), futureDateValidator()],
                priority: ['normal']
            }
        );
    }

    createTask() {
        const newTask = {
            title: this.taskForm.controls.title.value,
            description: this.taskForm.controls.description.value,
            dueDate: this.taskForm.controls.dueDate.value,
            priority: this.taskForm.controls.priority.value,
        };
        let tasks = TaskService.loadTasks();
        if (tasks) {
            tasks.push(newTask);
        } else {
            tasks = [newTask];
        }
        TaskService.saveTasks(TaskService.sortByDate(tasks));
        this.addTaskEvent.emit(null);
    }
}
