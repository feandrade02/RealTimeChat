import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tela-inicio',
  standalone: true,
  imports: [],
  templateUrl: './tela-inicio.component.html',
  styleUrl: './tela-inicio.component.css'
})
export class TelaInicioComponent {
  constructor(private router: Router) {}

  irParaChat() {
    this.router.navigate(['/chat']);
  }
}