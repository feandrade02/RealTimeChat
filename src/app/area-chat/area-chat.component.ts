import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-area-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './area-chat.component.html',
  styleUrl: './area-chat.component.css'
})
export class AreaChatComponent {
  mensagens = [
    { autor: 'Colega de trabalho', texto: 'Olá, como vai?' },
    { autor: 'Você', texto: 'Olá, tudo bem, e você?' }
  ];
}
