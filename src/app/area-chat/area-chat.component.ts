import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService, Contact } from '../user.service';
import { FormsModule, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-area-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './area-chat.component.html',
  styleUrl: './area-chat.component.css'
})
export class AreaChatComponent {
  nameControl = new FormControl('', [Validators.required]);
  activeContact$!: Observable<Contact | null>;
  mensagemConteudo: string = '';
  mensagens: { autor: string, texto: string }[] = []; 
  
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.activeContact$ = this.userService.activeContact$;
  }

  get isNameInvalid() {
    return this.nameControl.invalid && this.nameControl.touched;
  }
  
  sendMessage() {
    this.userService.currentClientId$.subscribe(senderId => {
      this.activeContact$.subscribe(contact => {
        if (contact && this.mensagemConteudo.trim()) {
          // Envia a mensagem com os valores corretos de senderId e contact.clientId como receiverId
          this.userService.sendMessage(contact.clientId, this.mensagemConteudo).subscribe(() => {
            // Adiciona a mensagem enviada à lista de mensagens
            this.mensagens.push({ autor: 'Você', texto: this.mensagemConteudo });
            // Limpa o campo de entrada
            this.mensagemConteudo = '';
          });
        }
      });
    });
  } 

}