import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserNameService } from '../name.service';
import { FormsModule, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tela-inicio',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './tela-inicio.component.html',
  styleUrl: './tela-inicio.component.css'
})
export class TelaInicioComponent {
  nameControl = new FormControl('', [Validators.required]);

  get isNameInvalid() {
    return this.nameControl.invalid && this.nameControl.touched;
  }

  constructor(private router: Router, private userNameService: UserNameService) {}

  irParaChat() {
    if (this.nameControl.valid) {
      this.userNameService.setUserName(this.nameControl.value ?? (''));
      this.router.navigate(['/chat']);
    }
  }
}