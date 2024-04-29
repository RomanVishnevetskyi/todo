import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { ActivatedRoute } from '@angular/router';
import { TodoComponent } from '../todo/todo.component';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    TodoComponent,
    CommonModule,NgIf
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent implements OnInit {

  constructor(public todoService: TodoService, public route: ActivatedRoute) { }

  viewList: boolean = true;

  ngOnInit(): void {
    this.route.url.subscribe(data => {
      if (data[0].path == 'list') {
        this.viewList = true;
      }
      else {
        this.viewList = false;
        this.todoService.updateFav();
      }
    })
  }
}
