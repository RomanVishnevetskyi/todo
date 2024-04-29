import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  Input,
  OnChanges,
  OnInit, SimpleChanges
} from '@angular/core';
import { Todo } from '../../models/Todo';
import { TodoService } from '../../services/todo.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ShortenTextPipe } from '../../pipes/short-text';
import { interval,Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule, NgClass, MatIcon, ShortenTextPipe
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class TodoComponent implements OnInit {
  @Input() todoInput!: Todo;
  @Input() typeList!: string;
  @Input() typeTodo!: string;
  private destroy$: Subject<void> = new Subject<void>();

  completed = false;
  redText = false;
  todo!: Todo;
  remainingTime: string = ''

  constructor(public todoService: TodoService, private toasterService: ToastrService,private cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.startTimer();
  }

  onChange() {
    this.completed = !this.completed;
    this.completed ? this.toasterService.success(`Todo succesfully completed`, 'completed') : '';
  }

  toggleClass() {
    if (this.completed) {
      return { 'list-group-item-success': this.completed, 'border-primary': this.completed };
    } else {
      return {'list-group-item-danger': !this.completed };
    }
  }

  deleteTodo(item:Todo) {
    this.todo = item;
    this.todoService.deleteTodo(item,this.typeTodo);
    this.toasterService.error(`Todo ${item.id} Deleted!`, 'Deleted Successfuly');
  }

  isFavorite() {
    this.todoInput.isFavorite = !this.todoInput.isFavorite;
    this.todoService.todoList.forEach(todo => {
      if (todo.id === this.todoInput.id) {
        todo.isFavorite = this.todoInput.isFavorite;
      }
    });
    this.todoService.fav.forEach(todo => {
      if (todo.id === this.todoInput.id) {
        todo.isFavorite = this.todoInput.isFavorite;
      }
    });
    if (this.todoInput.isFavorite) {
      this.toasterService.success('Todo Added to Favorite');
      this.todoService.fav.unshift(this.todoInput);
    }
    else {
      this.toasterService.error('Todo Removed from Favorite');
      const filteredFav:Array<Todo> = this.todoService.fav.filter((todo)=>todo.isFavorite);
      this.todoService.fav = filteredFav
    }
      localStorage.setItem("favorite", JSON.stringify(this.todoService.fav));
      this.cdr.detectChanges();
  }

  timeLeft(expirationTime: Date | undefined) {
    if (!expirationTime) {
      return '';
    }
    const now = new Date();
    const difference = expirationTime?.getTime() - now.getTime();

    if (difference <= 0) {
      return 'Expired';
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (difference < 1000 * 60 * 60) {
      this.redText = true;
    }
    this.cdr.markForCheck()
    return `${days}d${hours}h${minutes}m${seconds}s`;
  }

  private startTimer(): void {
    interval(1000)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if(this.typeTodo==='today')
        this.remainingTime =  this.timeLeft(this.todoInput?.expiration);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
