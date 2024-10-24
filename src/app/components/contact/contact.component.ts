import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactModel } from '../../models/contact.model';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contacts: ContactModel[] = [];

  showModal: boolean = false;
  selectedMessage: ContactModel | null = null;

  constructor(
    private http: HttpService,
    private swal: SwalService
  ){
    this.getAllMessage();
  }

  getAllMessage(){
    this.http.get("Contacts/GetAll", (res) => {
      this.contacts = res.data;      
    })
  }

  updateMessage(id: string){
    this.http.get(`Contacts/Update?Id=${id}`, (res) => {
      this.getAllMessage();
    })
  }

  deleteMessageById(id: string, subject: string){
    this.swal.callToastWithButton(`${subject} konulu mesaj silinsin mi?`, 'Yes!', () => {
      this.http.get(`Contacts/DeleteById?Id=${id}`, (res) => {
        this.getAllMessage();
      });
    });
  }


  openModal(item: ContactModel) {
    this.selectedMessage = item;
    this.showModal = true;
    this.updateMessage(item.id!);
  }

  closeModal() {
    this.showModal = false;
    this.selectedMessage = null;
  }
}
