import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../name.service';
import { FormsModule, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-tela-inicio',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tela-inicio.component.html',
  styleUrl: './tela-inicio.component.css'
})
export class TelaInicioComponent {
  nameControl = new FormControl('', [Validators.required]);
  userName = '';

  get isNameInvalid() {
    return this.nameControl.invalid && this.nameControl.touched;
  }

  constructor(private router: Router, private userService: UserService) {}

  irParaChat() {
    this.userService.setUserName(this.userName);
    this.router.navigate(['/chat']);
  }
}