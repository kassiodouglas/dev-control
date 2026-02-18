import { Injectable } from '@angular/core';
import { Block } from 'notiflix';

@Injectable({
  providedIn: 'root'
})
export class BlockService {

  show(element: string | HTMLElement, message?: string) {
    if (typeof element === 'string') {
      Block.standard(element, message);
    } else {
      Block.standard([element], message);
    }
  }

  hide(element: string | HTMLElement) {
    if (typeof element === 'string') {
      Block.remove(element);
    } else {
      Block.remove([element]);
    }
  }
}
