import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService, Contact } from '../user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-area-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './area-chat.component.html',
  styleUrl: './area-chat.component.css'
})
export class AreaChatComponent {
  activeContact$!: Observable<Contact | null>;
  mensagemConteudo: string = '';
  mensagens: object[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.activeContact$ = this.userService.activeContact$;
  }
  
  sendMessage() {
    this.activeContact$.subscribe(contact => {
      if (contact && this.mensagemConteudo.trim()) {
        this.userService.sendMessage(contact.clientId, this.mensagemConteudo).subscribe(() => {
          // Adiciona a mensagem à lista de mensagens
          this.mensagens.push({ autor: 'Você', texto: this.mensagemConteudo });
          // Limpa o campo de entrada
          this.mensagemConteudo = '';
        });
      }
    });
  }

}
