import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserNameService {
  private apiUrlpostname = 'http://localhost:5000/api/chat/connect';
  private apiUrlgetname = 'http://localhost:5000/api/chat/list';

  private userNameSubject = new BehaviorSubject<string>('');
  userNameObservable = this.userNameSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Enviar nome para o servidor
  setUserName(name: string): Observable<any> {
    return this.http.post(this.apiUrlpostname, { name }).pipe(
      // Após enviar o nome, atualiza o BehaviorSubject com o nome enviado
      tap(() => {
        this.userNameSubject.next(name);
      })
    );
  }

  // Recuperar nome do servidor
  getUserName(): Observable<string> {
    return this.http.get<string>(this.apiUrlgetname).pipe(
      // Atualiza o BehaviorSubject com o nome recuperado
      tap((name: string) => {
        this.userNameSubject.next(name);
      })
    );
  }
}