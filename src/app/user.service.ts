import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, Subscription } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

interface ConnectResponse {
  clientId: number;
  clientName: string;
  message: string;
}

export interface Contact {
  clientId: number;
  clientName: string;
  currentConversationWith: number;
  lastActivity: string;
}

export interface ClientList {
  client_list: Contact[];
}

export interface Message {
  SenderId: number;
  ReceiverId: number;
  Content: string;
  Timestamp: string;
  ConversationId: string;
}

export interface MessageList {
  message_list: Message[];
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:5000/api/chat';
  private currentClientId: number = 0;
  public contacts: ClientList = { client_list: [] }; 
  private subscription!: Subscription;
  private subscription2!: Subscription;
  public messagesList: MessageList = { message_list: [] }; 



  private activeContactSubject = new BehaviorSubject<Contact | null>(null);
  activeContact$ = this.activeContactSubject.asObservable();

  private currentClientIdSubject = new BehaviorSubject<number>(0);
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

  getContactList(): Observable<ClientList> {
    return this.http.get<ClientList>(`${this.baseUrl}/list`).pipe(
      tap((contactList: ClientList) => {
        this.contacts = contactList;
      })
    );
  }

  // Iniciar conversa com outro usuário
  startConversation(clientId: number, targetClientId: number): Observable<any> {
    const params = new HttpParams()
      .set('clientId', clientId.toString())
      .set('targetClientId', targetClientId.toString());

    return this.http.post(`${this.baseUrl}/start-conversation`, null, { params, responseType: 'text' }).pipe(
      tap(() => {
        const contact = this.contacts.client_list.find(c => c.clientId === targetClientId);
        if (contact) this.setActiveContact(contact);
      })
    );
  }

  setActiveContact(contact: Contact) {
    this.activeContactSubject.next(contact);
  }
  
  // Enviar mensagem
  sendMessage(receiverId: number, content: string): Observable<any> {
    const message = {
      senderId: this.currentClientIdSubject.value,
      receiverId: receiverId,
      content: content,
      timestamp: new Date().toISOString(),
      conversationId: 0
    };
    
    return this.http.post(`${this.baseUrl}/send`, message);
  }

  startPolling(intervalMs: number) {
    this.subscription = interval(intervalMs).pipe(
      switchMap(() => this.getContactList())
    ).subscribe(
      (contactList) => {
        console.log('Updated contacts:', contactList);
      },
      (error) => {
        console.error('Error fetching contact list:', error);
      }
    );
  }
  
  stopPolling() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Carregar mensagens anteriores
  loadMessages(targetClientId: number): Observable<any> {
    let params = new HttpParams()
      .set('clientId', this.currentClientIdSubject.value.toString())
      .set('targetClientId', targetClientId.toString());

    // Make the HTTP GET request with parameters
    return this.http.get(`${this.baseUrl}/load-messages`, { params });
  }

  startPollingMessages(intervalMs: number) {
    var id: number;
    this.activeContact$.subscribe(contact => {
      if(contact){
        id = contact.clientId;
      }
    })
    this.subscription2 = interval(intervalMs).pipe(
      switchMap(() => this.loadMessages(id))
    ).subscribe(
      (messagesList) => {
        console.log('Updated messages:', messagesList);
      },
      (error) => {
        console.error('Error fetching contact list:', error);
      }
    );
  }

}