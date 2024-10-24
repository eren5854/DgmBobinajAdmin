import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { DescriptionModel } from '../../models/description.model';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css'
})
export class ServiceComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  descriptions: DescriptionModel[] = [];
  services: DescriptionModel[] = [];
  serviceModel: DescriptionModel = new DescriptionModel();
  addCardDiv = false;
  imageSrc: string | ArrayBuffer | null = null;
  imgUrl = "";

  constructor(
    private http: HttpService,
    private swal: SwalService
  ){
    this.getService();
    this.imgUrl = http.getImageUrl();
  }


  getService(){
    this.http.get("DescriptionModels/GetAll", (res) => {
      this.descriptions = res.data;
      this.descriptions.forEach((description) => {
        if (description.modelEnum === 1) {
          this.services.push(description); // Veriyi services dizisine ekle
        }
      });
    })
  }

  createService(form:NgForm){
    const formData: FormData = new FormData();
    this.serviceModel.modelEnum = 1;
    if (form.valid) {
      formData.append("title", this.serviceModel.title);
      formData.append("text", this.serviceModel.text);
      formData.append("image", this.fileInput.nativeElement.files[0]);
       // modelEnum değerini kontrol et
    if (this.serviceModel.modelEnum !== undefined) {
      formData.append("modelEnum", this.serviceModel.modelEnum.toString()); // number'ı string'e dönüştür
    }
      this.http.post("DescriptionModels/Create", formData, (res) => {
        this.addCardDiv = false;
        location.reload();
      });
    }
  }

  updateService(form:NgForm, service:DescriptionModel){
    const formData: FormData = new FormData();
    service.modelEnum = 1;
    if (form.valid) {
      formData.append("id", service.id!);
      formData.append("title", service.title);
      formData.append("text", service.text);
      formData.append("image", this.fileInput.nativeElement.files[0]);
       // modelEnum değerini kontrol et
    if (service.modelEnum !== undefined) {
      formData.append("modelEnum", service.modelEnum.toString()); // number'ı string'e dönüştür
    }
      this.http.post("DescriptionModels/Update", formData, (res) => {
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

  deleteServiceById(id:string){
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
      this.serviceModel.image = file.name;
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  addCard() {
    this.addCardDiv = !this.addCardDiv;
  }
}
