import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommentModel } from '../../models/comment.model';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {

  comments: CommentModel[] = [];

  showModal: boolean = false;
  selectedMessage: CommentModel | null = null;

  constructor(
    private http: HttpService,
    private swal: SwalService
  ) {
    this.getComment();
  }

  getComment() {
    this.http.get("Comments/GetAll", (res) => {
      this.comments = res.data;

    })
  }

  createComment() {
    this.swal.callToastWithButton('Yeni yorum alanı oluşturmak istediğinize emin misiniz?', 'Evet!', () => {
      this.http.post("Comments/Create", { isUpdateable: true }, (res) => {
        this.getComment();
      });
    });
  }


  updateIsActive(id: string) {
    this.http.get(`Comments/UpdateIsActive?Id=${id}`, (res) => {
      // location.reload();
      this.getComment();
    })
  }

  deleteCommentById(id: string) {
    this.swal.callToastWithButton('Silmek istediğinize emin misiniz?', 'Evet!', () => {
      this.http.get(`Comments/DeleteById?Id=${id}`, (res) => {
        this.getComment();
      });
    });
  }

  openModal(item: CommentModel) {
    this.selectedMessage = item;
    this.showModal = true;
    // this.updateMessage(item.id!);
  }

  closeModal() {
    this.showModal = false;
    this.selectedMessage = null;
  }
}
