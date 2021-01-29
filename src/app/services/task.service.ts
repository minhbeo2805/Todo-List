import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    constructor() {
    }

    static saveTasks(tasks) {
        for (let i = 0; i < tasks.length; i++) {
            tasks[i].indexOrder = i;
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    static loadTasks() {
        return JSON.parse(localStorage.getItem('tasks'));
    }

    static removeTasks(indexList?) {
        const tasks = TaskService.loadTasks();
        if (indexList && indexList.length !== tasks.length) {
            const remainTasks = [];
            tasks.forEach(
                (task) => {
                    console.log(task.indexOrder);
                    if (!indexList.includes(task.indexOrder)) {
                        remainTasks.push(task);
                    }
                }
            );

            TaskService.saveTasks(remainTasks);
        } else {
            localStorage.removeItem('tasks');
        }
    }

    static sortByDate(tasks) {
        return tasks.sort((a, b) => {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
    }
}
