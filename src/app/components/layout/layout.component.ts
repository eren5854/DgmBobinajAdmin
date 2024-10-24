import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { ContactModel } from '../../models/contact.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  @ViewChild('sideMenu') sideMenu: ElementRef | undefined;

  contacts: ContactModel[] = [];

  messageCount: number = 0;

  isDarkTheme = false;
  isSideBarOpen = false;
  constructor(
    private renderer: Renderer2,
    private http: HttpService,
    public auth: AuthService,
  ){
    this.getAllMessage();
  }


  getAllMessage(){
    this.http.get("Contacts/GetAll", (res) => {
      let unreadMessages = res.data.filter((message: ContactModel) => !message.isRead);
      this.messageCount = unreadMessages.length;
      if (unreadMessages.length === 0) {
        this.contacts = res.data.filter((message: ContactModel) => message.isRead).slice(0, 4);
      } else {
        this.contacts = unreadMessages.slice(0, 4);
      }
    });
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      this.renderer.addClass(document.body, 'dark-theme-variables');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme-variables');
    }
  }

  toggleSideBar(): void {
    this.isSideBarOpen = !this.isSideBarOpen;
    const sideMenuElement = this.sideMenu?.nativeElement as HTMLElement;

    if (this.isSideBarOpen) {
      sideMenuElement.style.display = 'block';
    } else {
      sideMenuElement.style.display = 'none';
    }
  }

  logout() {
    localStorage.setItem("token", "");
  }
}
