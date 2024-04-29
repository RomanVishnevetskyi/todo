import { Injectable } from '@angular/core';
import { Todo } from '../models/Todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor() { }

  fav:Array<Todo> = [];
  todoList: Array<Todo> = [
    {
      id: 1,
      title: 'Todo One',
      isCompleted: false,
      isFavorite: false,
      createdAt: new Date(Date.now()),
      expiration:new Date('2024-04-30T11:00:00' ),
    },
    {
      id: 2,
      title: 'Todo Two',
      isCompleted: false,
      isFavorite: false,
      createdAt: new Date(Date.now()),
      expiration:new Date('2024-04-29T15:00:00' ),
    },
    {
      id: 3,
      title: 'Todo Three',
      isCompleted: false,
      isFavorite: false,
      createdAt: new Date(Date.now()),
      expiration:new Date('2024-04-30T12:00:00' ),
    },
    {
      id: 4,
      title: 'Todo Four',
      isCompleted: false,
      isFavorite: false,
      createdAt: new Date(Date.now()),
      expiration:new Date('2024-04-29T18:00:00' ),
    },
  ];
  today = this.todayTodos(this.todoList)


  deleteTodo(item: Todo, type:string) {

    if(type==='favorite') {
      const deletedFav = this.fav.filter((todo)=>todo.id !== item.id)
      this.fav = deletedFav;
      localStorage.setItem("favorite", JSON.stringify(this.fav));
      this.todoList.forEach(todo => {
        if (todo.id === item.id) {
          todo.isFavorite = false;
        }
      });
    }
    else if (type==='today') {
      const deletedTod = this.today.filter((todo)=>todo.id !== item.id)
      this.today = deletedTod;
    }
    else {
      const deletedTod = this.todoList.filter((todo)=>todo.id !== item.id)
      this.todoList = deletedTod;
      this.today = this.todayTodos(this.todoList)
    }
  }

  addTodo(todo:any) {
    let id = this.todoList.length + 2;
    const item: Todo = {
      id: id,
      isCompleted: false,
      isFavorite: false,
      createdAt: new Date(),
      title: todo.title,
      expiration:this.expirationValue(todo.expirationDate,todo.expirationTime),
    }
    this.todoList.unshift(item);
    this.today = this.todayTodos(this.todoList)
  }

  updateFav():void {
    const favoriteString = localStorage.getItem('favorite');
    if (favoriteString !== null) {
      this.fav = JSON.parse(favoriteString);
    }
  }

  expirationValue(date:Date,time:string):Date {
    const [hours, minutes] = time.split(':').map(Number);
    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(hours);
    combinedDateTime.setMinutes(minutes);
    return combinedDateTime;
  }

  todayTodos(todoList: any[]):Array<Todo>{
    const today = new Date();
    const todayTodos = todoList.filter(todo => {
      const expirationDate = new Date(todo?.expiration);
      return expirationDate.toDateString() === today.toDateString();
    });
    return todayTodos;
  }
}
