import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserNameService } from '../name.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit {
  contatos = [
    { nome: 'Colega de trabalho', status: 'online' },
    { nome: 'Nome', status: 'online' },
    { nome: 'Nome', status: 'offline' },
    { nome: 'Nome', status: 'offline' },
    { nome: 'Nome', status: 'offline' }
  ];

  userName = '';

  constructor(private userNameService: UserNameService) {}

  ngOnInit() {
    this.userNameService.userNameObservable.subscribe(name => {
      this.userName = name;
    });
  }
}
