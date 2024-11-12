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
    // Inscreve-se para receber atualizações do nome
    this.userNameService.userNameObservable.subscribe(name => {
      this.userName = name; // Atualiza a variável com o nome recebido
    });

    // Se necessário, faz uma requisição GET para inicializar o nome
    this.userNameService.getUserName().subscribe();
  }
}
