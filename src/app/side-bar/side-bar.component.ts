import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  contatos = [
    { nome: 'Colega de trabalho', status: 'online' },
    { nome: 'Nome', status: 'online' },
    { nome: 'Nome', status: 'offline' },
    { nome: 'Nome', status: 'offline' },
    { nome: 'Nome', status: 'offline' }
  ];
}
