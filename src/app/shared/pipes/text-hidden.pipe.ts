import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'textHidden'
})
export class TextHiddenPipe implements PipeTransform {

  transform(value: string, textCollapse: boolean): string {
    let text = value.trim();
    let textMini = text.slice(0, 120);
    return textCollapse ? textMini : text;
  }
}
