import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService, Contact } from '../user.service';
import { FormsModule, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageList } from '../user.service';

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
  activeMessages$!: Observable<MessageList | null>;
  mensagemConteudo: string = '';
  listMessages: MessageList = {message_list: []};
 
  
  constructor(public userService: UserService) {}

  ngOnInit() {
    this.activeContact$ = this.userService.activeContact$;
    
    this.userService.startPollingMessages(2000);
    
  }

  get isNameInvalid() {
    return this.nameControl.invalid && this.nameControl.touched;
  }

  get filteredMessages() {
    return this.userService.messagesList.message_list;
  }
  
  sendMessage() {
    console.log(this.userService.messagesList);
    this.userService.currentClientId$.subscribe(senderId => {
      this.activeContact$.subscribe(contact => {
        if (contact && this.mensagemConteudo.trim()) {
          // Envia a mensagem com os valores corretos de senderId e contact.clientId como receiverId
          this.userService.sendMessage(contact.clientId, this.mensagemConteudo).subscribe(() => {
            // Limpa o campo de entrada
            this.mensagemConteudo = '';
          });
        }
      });
    });
  } 

}