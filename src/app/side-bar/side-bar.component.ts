import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Observable } from 'rxjs';

interface Contact {
  clientId: number;
  name: string;
  status: 'online' | 'offline';
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
  contacts: Contact[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.clientId$ = this.userService.currentClientId$;
    this.userName$ = this.userService.userName$;

    // Busca a lista de contatos do servidor
    this.loadContacts();
  }

  private loadContacts() {
    this.userService.getContactList().subscribe(
      (contactList: Contact[]) => {
        this.contacts = contactList;
      },
      (error) => {
        console.error('Erro ao carregar contatos:', error);
      }
    );
  }
}
