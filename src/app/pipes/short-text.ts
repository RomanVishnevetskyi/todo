import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenText',
  standalone: true,
})
export class ShortenTextPipe implements PipeTransform {
  transform(value: string, length?: number): unknown {
    let _length: number = 0;

    if (!value) {
      return ;
    }

    _length = !!length ? (length > value.length ? value.length : length) : 20;

    return value.length > _length ? value.substr(0, _length) + '...' : value;
  }
}
