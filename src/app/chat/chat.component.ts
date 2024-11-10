import { Component } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { CabecalhoComponent } from '../cabecalho/cabecalho.component';
import { AreaChatComponent } from '../area-chat/area-chat.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [SideBarComponent, CabecalhoComponent, AreaChatComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

}
