import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

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
  userName: string = '';
  clientId: number | null = null;
  contacts: Contact[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    // Inscreve-se para receber atualizações do nome
    this.userService.userNameObservable.subscribe(name => {
      this.userName = name; // Atualiza a variável com o nome recebido
    });

    this.clientId = this.userService.getCurrentClientId();

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
