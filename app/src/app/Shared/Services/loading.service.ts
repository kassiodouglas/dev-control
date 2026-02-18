import { Injectable } from '@angular/core';
import { Loading } from 'notiflix';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  show(message?: string) {
    Loading.standard(message);
  }

  hide() {
    Loading.remove();
  }
}
