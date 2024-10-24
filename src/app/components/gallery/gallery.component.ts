import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ImageModel } from '../../models/image.model';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {

  
  @ViewChild('fileInput') fileInput!: ElementRef;
  images: ImageModel[] = [];
  galleries: ImageModel[] = [];
  galleryModel: ImageModel = new ImageModel();
  addCardDiv = false;
  imageSrc: string | ArrayBuffer | null = null;
  imgUrl = "https://localhost:7023/Images/";

  constructor(
    private http: HttpService,
    private swal: SwalService
  ) {
    this.getGallery();
  }


  getGallery() {
    this.http.get("Galeries/GetAll", (res) => {
      this.images = res.data;
      this.images.forEach((image) => {
        if (image.galeryEnum === 0) {
          this.galleries.push(image); // Veriyi services dizisine ekle
        }
      });
    })
  }

  createGallery(form: NgForm) {
    const formData: FormData = new FormData();
    this.galleryModel.galeryEnum = 0;
    if (form.valid) {
      formData.append("image", this.fileInput.nativeElement.files[0]);
      // modelEnum değerini kontrol et
      if (this.galleryModel.galeryEnum !== undefined) {
        formData.append("galeryEnum", this.galleryModel.galeryEnum.toString()); // number'ı string'e dönüştür
      }
      this.http.post("Galeries/Create", formData, (res) => {
        this.addCardDiv = false;
        location.reload();
      });
    }
  }

  updateGallery(form: NgForm, referance: ImageModel) {
    const formData: FormData = new FormData();
    referance.galeryEnum = 0;
    if (form.valid) {
      formData.append("id", referance.id!);
      formData.append("image", this.fileInput.nativeElement.files[0]);
      // modelEnum değerini kontrol et
      if (referance.galeryEnum !== undefined) {
        formData.append("galeryEnum", referance.galeryEnum.toString()); // number'ı string'e dönüştür
      }
      this.http.post("Galeries/Update", formData, (res) => {
        location.reload();
        // this.getService();
      })
    }
  }

  updateIsActive(id:string) {
    this.http.get(`Galeries/UpdateIsActive?Id=${id}`, (res) => {
      location.reload();
      // this.getOperation();
    })
  }

  deleteGalleryById(id: string) {
    this.swal.callToastWithButton('Are you sure you want to delete?', 'Yes!', () => {
      this.http.get(`Galeries/DeleteById?Id=${id}`, (res) => {
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
      this.galleryModel.image = file.name;
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  addCard() {
    this.addCardDiv = !this.addCardDiv;
  }
}
