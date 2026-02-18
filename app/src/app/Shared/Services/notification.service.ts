import { Injectable } from '@angular/core';
import { Notify } from 'notiflix';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  success(message: string) {
    Notify.success(message);
  }

  failure(message: string) {
    Notify.failure(message);
  }

  warning(message: string) {
    Notify.warning(message);
  }

  info(message: string) {
    Notify.info(message);
  }
}
