import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface ConnectResponse {
  clientId: number;
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

  private userNameSubject = new BehaviorSubject<string>('');
  userNameObservable = this.userNameSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Conectar usuário (POST /connect)
  setUserName(name: string): Observable<ConnectResponse> {
    // Adiciona o nome como parâmetro da URL
    const params = new HttpParams().set('nome', name);
    
    return this.http.post<ConnectResponse>(`${this.baseUrl}/connect`, null, { params }).pipe(
      tap(response => {
        this.currentClientId = response.clientId;
        this.userNameSubject.next(name);
      })
    );
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

  // Getter para o ID do cliente atual
  getCurrentClientId(): number | null {
    return this.currentClientId;
  }

}