import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Observable } from 'rxjs';

interface Contact {
  clientId: number;
  clientName: string;
  currentConversationWith: number;
  lastActivity: string;
  // status: 'online' | 'offline';
}

interface ClientList {
  client_list: Contact[];
}

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit {
  clientId$!: Observable<number | null>;
  userName$!: Observable<string>;
  currentUserId!: number | null;
  contacts: ClientList = { client_list: [] };

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.clientId$ = this.userService.currentClientId$;
    this.userName$ = this.userService.userName$;

    this.clientId$.subscribe(id => (this.currentUserId = id));

    // Busca a lista de contatos do servidor
    this.loadContacts();
  }

  private loadContacts() {
    this.userService.getContactList().subscribe(
      (contactList: ClientList) => {
        console.log('Contatos carregados:', contactList);
        this.contacts = contactList;
      },
      (error) => {
        console.error('Erro ao carregar contatos:', error);
      }
    );
  }

  get filteredContacts() {
    return this.contacts.client_list.filter(contact => contact.clientId !== this.currentUserId);
  }
}
