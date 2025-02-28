import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { last } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Angular Calculator';

  operators: string[] = ['%', '/', '*', '-', '+'];
  mainScreen: string = '0';
  subScreen: string = '';
  errScreen: string = '';

  getNumber(num: string) {
    this.errScreen = "";
    this.mainScreen += num;
    this.subScreen += num;
  }

  getOperator(operator: string) {
    let lastChar = this.subScreen.slice(-1);

    if (lastChar == operator) {
      console.log(lastChar);
      return;
    }

    this.subScreen += operator;
    this.mainScreen = '0';
  }

  clearScreen() {
    this.errScreen = '';
    this.mainScreen = '';
    this.subScreen = '';
  }

  calculate() {
    try {
      this.errScreen = "";
      let answer = eval(this.subScreen);
      this.mainScreen = answer;
    } catch (error) {
      // console.log(error);
      this.mainScreen = this.subScreen = "";
      this.errScreen = "ERROR!";
    }
  }
}
