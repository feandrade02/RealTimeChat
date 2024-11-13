import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from '../user.service';
import { Observable } from 'rxjs';
import { Contact } from '../user.service';

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
  @Output() contactSelected = new EventEmitter<Contact>();

  clientId$!: Observable<number>;
  userName$!: Observable<string>;
  activeContact$!: Observable<Contact | null>;
  currentUserId!: number;
  contacts: ClientList = { client_list: [] };

  constructor(private userService: UserService) {
    this.activeContact$ = this.userService.activeContact$;
  }

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

  selectContact(contact: Contact) {
    this.contactSelected.emit(contact);
  }

  onContactClick(contact: Contact) {
    // Primeiro emitimos o evento
    this.contactSelected.emit(contact);
    
    // Depois iniciamos a conversação
    this.userService.startConversation(this.currentUserId, contact.clientId).subscribe(() => {
      this.userService.setActiveContact(contact);
    })
  }
}
