import {Component, OnInit} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material';

@Component({
  selector: 'app-new-todo',
  templateUrl: './new-todo.component.html',
  styleUrls: ['./new-todo.component.css']
})
export class NewTodoComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  onDateChanged(event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
  }

}
