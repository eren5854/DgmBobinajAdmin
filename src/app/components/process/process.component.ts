import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';
import { DescriptionModel } from '../../models/description.model';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './process.component.html',
  styleUrl: './process.component.css'
})
export class ProcessComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  descriptions: DescriptionModel[] = [];
  operations: DescriptionModel[] = [];
  operationModel: DescriptionModel = new DescriptionModel();
  addCardDiv = false;
  imageSrc: string | ArrayBuffer | null = null;
  imgUrl = "";

  constructor(
    private http: HttpService,
    private swal: SwalService
  ) {
    this.getOperation();
    this.imgUrl = http.getImageUrl();
  }


  getOperation() {
    this.http.get("DescriptionModels/GetAll", (res) => {
      this.descriptions = res.data;
      this.descriptions.forEach((description) => {
        if (description.modelEnum === 2) {
          this.operations.push(description); // Veriyi services dizisine ekle
        }
      });
    })
  }

  createService(form: NgForm) {
    const formData: FormData = new FormData();
    this.operationModel.modelEnum = 2;
    if (form.valid) {
      formData.append("title", this.operationModel.title);
      formData.append("text", this.operationModel.text);
      formData.append("image", this.fileInput.nativeElement.files[0]);
      // modelEnum değerini kontrol et
      if (this.operationModel.modelEnum !== undefined) {
        formData.append("modelEnum", this.operationModel.modelEnum.toString()); // number'ı string'e dönüştür
      }
      this.http.post("DescriptionModels/Create", formData, (res) => {
        this.addCardDiv = false;
        location.reload();
      });
    }
  }

  updateService(form: NgForm, operation: DescriptionModel) {
    const formData: FormData = new FormData();
    operation.modelEnum = 2;
    if (form.valid) {
      formData.append("id", operation.id!);
      formData.append("title", operation.title);
      formData.append("text", operation.text);
      formData.append("image", this.fileInput.nativeElement.files[0]);
      // modelEnum değerini kontrol et
      if (operation.modelEnum !== undefined) {
        formData.append("modelEnum", operation.modelEnum.toString()); // number'ı string'e dönüştür
      }
      this.http.post("DescriptionModels/Update", formData, (res) => {
        location.reload();
        // this.getService();
      })
    }
  }

  updateIsActive(id:string) {
    this.http.get(`DescriptionModels/UpdateIsActive?Id=${id}`, (res) => {
      location.reload();
      // this.getOperation();
    })
  }

  deleteServiceById(id: string) {
    this.swal.callToastWithButton('Are you sure you want to delete?', 'Yes!', () => {
      this.http.get(`DescriptionModels/DeleteById?Id=${id}`, (res) => {
        location.reload();
      });
    });
  }

  setImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file);
      this.operationModel.image = file.name;
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  addCard() {
    this.addCardDiv = !this.addCardDiv;
  }

}
