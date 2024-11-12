import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface ConnectResponse {
  clientId: number;
  clientName: string;
  message: string;
}

interface Contact {
  clientId: number;
  name: string;
  status: 'online' | 'offline';
}

interface ClientList {
  client_list: Contact[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:5000/api/chat';
  private currentClientId: number | null = null;

  private currentClientIdSubject = new BehaviorSubject<number | null>(null);
  currentClientId$ = this.currentClientIdSubject.asObservable();

  private userNameSubject = new BehaviorSubject<string>('');
  userName$ = this.userNameSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedClientId = Number(localStorage.getItem('clientId'));
    const storedUserName = localStorage.getItem('userName') || '';
  
    if (!isNaN(storedClientId)) {
      this.currentClientIdSubject.next(storedClientId);
    }
  
    this.userNameSubject.next(storedUserName);
  }

  // Conectar usuário (POST /connect)
  setUserName(name: string): Observable<ConnectResponse> {
    const params = new HttpParams().set('nome', name);
    
    return this.http.post<ConnectResponse>(`${this.baseUrl}/connect`, null, { params }).pipe(
      tap(response => {
        this.currentClientIdSubject.next(response.clientId);
        this.userNameSubject.next(response.clientName);
        localStorage.setItem('clientId', response.clientId.toString());
        localStorage.setItem('userName', response.clientName);
      })
    );
  }

  getCurrentClientId(): number | null {
    return this.currentClientIdSubject.value;
  }

  getCurrentUserName(): string {
    return this.userNameSubject.value;
  }

  getContactList(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.baseUrl}/list`);
  }

  // Iniciar conversa com outro usuário
  startConversation(targetClientId: number): Observable<any> {
    const params = new HttpParams()
      .set('clientId', this.currentClientId!)
      .set('targetClientId', targetClientId);
    
    return this.http.post(`${this.baseUrl}/start-conversation`, null, { params });
  }

  // Enviar mensagem
  sendMessage(receiverId: number, content: string): Observable<any> {
    const message = {
      senderId: this.currentClientId,
      receiverId: receiverId,
      content: content
    };
    
    return this.http.post(`${this.baseUrl}/send`, message);
  }

  // Carregar mensagens anteriores
  loadMessages(targetClientId: number): Observable<any> {
    const params = new HttpParams()
      .set('clientId', this.currentClientId!)
      .set('targetClientId', targetClientId);
    
    return this.http.get(`${this.baseUrl}/load-messages`, { params });
  }

}