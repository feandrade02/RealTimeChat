import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserNameService {
  private userNameSubject = new BehaviorSubject<string>('');
  userNameObservable = this.userNameSubject.asObservable();

  setUserName(name: string) {
    this.userNameSubject.next(name);
  }
}