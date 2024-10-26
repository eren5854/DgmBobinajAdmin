import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { DescriptionModel } from '../../models/description.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  descriptions: DescriptionModel[] = [];
  aboutModel: DescriptionModel = new DescriptionModel();
  imageSrc: string | ArrayBuffer | null = null;
  imgUrl = "";
  addCardDiv = false;
  isAboutNull = false;

  constructor(
    private http: HttpService
  ){
    this.getAbout();
    this.imgUrl = http.getImageUrl();
    
  }

  getAbout(){
    this.http.get("DescriptionModels/GetAll", (res) => {
      this.descriptions = res.data;
      this.descriptions.forEach((description) => {
        if (description.modelEnum === 0) {
          this.aboutModel = description;
          if (this.aboutModel === null) {
            this.isAboutNull = true;
          }
        }
      });
    })
  }

  createAbout(form:NgForm){
    const formData: FormData = new FormData();
    if (form.valid) {
      formData.append("id", this.aboutModel.id!);
      formData.append("title", this.aboutModel.title);
      formData.append("text", this.aboutModel.text);
      formData.append("image", this.fileInput.nativeElement.files[0])
      this.http.post("DescriptionModels/Create", formData, (res) => {
        // this.getAbout();
      location.reload();
      })
    }
  }

  updateAbout(form:NgForm){
    const formData: FormData = new FormData();
    if (form.valid) {
      formData.append("id", this.aboutModel.id!);
      formData.append("title", this.aboutModel.title);
      formData.append("text", this.aboutModel.text);
      formData.append("image", this.fileInput.nativeElement.files[0])
      this.http.post("DescriptionModels/Update", formData, (res) => {
        // this.getAbout();
      location.reload();
      })
    }
  }

  updateIsActive(id:string) {
    this.http.get(`DescriptionModels/UpdateIsActive?Id=${id}`, (res) => {
      // location.reload();
      this.getAbout();
    })
  }

  setImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file);
      this.aboutModel.image = file.name;
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  addCard() {
    this.addCardDiv = !this.addCardDiv;
  }
}
