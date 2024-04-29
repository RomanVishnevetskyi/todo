import { Component } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepicker, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { dateTimeValidators } from '../../validators/date-time';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, NgxMaterialTimepickerModule, MatDatepickerToggle, MatDatepickerModule, MatNativeDateModule, MatButton
  ],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss'
})
export class TodoFormComponent {

  todos = this.fb.nonNullable.group({
    title: ['',[Validators.required,Validators.maxLength(100)]],
    expirationDate: ['', [Validators.required,dateTimeValidators()]],
    expirationTime: ['',[dateTimeValidators()]],
  })

  constructor(public todoService: TodoService, private fb:FormBuilder, private router:Router)
  {}

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.todos.valid){
      const todo  = {
        title: this.todos.value.title,
        expirationDate: this.todos.value.expirationDate,
        expirationTime: this.todos.value.expirationTime,
      }
      this.todoService.addTodo(todo);
      this.todos.reset();
      this.router.navigate(['list']);
    }
  }
}
