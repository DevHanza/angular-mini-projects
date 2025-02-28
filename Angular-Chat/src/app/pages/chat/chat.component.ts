import { Component, inject, signal, effect } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChatService } from '../../supabase/chat.service';
import { Ichat } from '../../interface/chat-response';
import { DatePipe } from '@angular/common';
import { DeleteModalComponent } from '../../layout/delete-modal/delete-modal.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, DeleteModalComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fbuilder = inject(FormBuilder);
  private chatService = inject(ChatService);

  chats = signal<Ichat[]>([]);
  chatForm!: FormGroup;

  constructor() {
    this.chatForm = this.fbuilder.group({
      chat_message: ['', Validators.required],
    });

    effect(() => {
      this.onListChat();
    });
  }

  async logOut() {
    this.auth
      .signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  onSubmit() {
    const formValue = this.chatForm.value.chat_message;
    console.log(formValue);

    this.chatService
      .chatMessage(formValue)
      .then((res) => {
        console.log(res);
        this.chatForm.reset();
      })
      .catch((err) => alert(err.message));

    this.onListChat();
  }

  onListChat() {
    this.chatService
      .listChat()
      .then((res: Ichat[] | null) => {
        console.log(res);

        if (res !== null) {
          this.chats.set(res);
        } else {
          console.log('No messages Found!');
        }
      })
      .catch((err) => alert(err.message));
  }

  openDropdown(msg: Ichat) {
    console.log(msg);
    this.chatService.selectedChats(msg);
  }
}
