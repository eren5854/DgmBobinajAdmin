import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { LayoutModel } from '../../models/layout.model';
import { LinkModel } from '../../models/link.model';
import { SwalService } from '../../services/swal.service';
import { MiniServiceModel } from '../../models/mini-service.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  layoutModel: LayoutModel = new LayoutModel();
  links: LinkModel[] = [];
  linkModel: LinkModel = new LinkModel();
  miniServiceModel: MiniServiceModel = new MiniServiceModel();
  miniServices: MiniServiceModel[] = [];
  imageSrc: string | ArrayBuffer | null = null;
  imgUrl = "";
  isLayoutNull = false;

  addCardDiv = false;
  addLinkCardDiv = false;
  addMiniServiceCardDiv = false;

  constructor(
    private http: HttpService,
    private swal: SwalService
  ){
    this.getLayout();
    this.getMiniService();
    this.getLink();
    this.imgUrl = http.getImageUrl();
  }

  getLayout(){
    this.http.get("Layouts/GetAll", (res) => {
      this.layoutModel = res.data[0];
      if(this.layoutModel === null){
        this.isLayoutNull = true;
        console.log(this.isLayoutNull);
        
      }
    });
  }

  updateLayout(form: NgForm){
    const formData: FormData = new FormData;
    if (form.valid) {
      formData.append("id", this.layoutModel.id!);
      formData.append("title", this.layoutModel.title);
      formData.append("subtitle", this.layoutModel.subtitle);
      formData.append("logo", this.fileInput.nativeElement.files[0]);
      this.http.post("Layouts/Update", formData, (res) => {
        this.getLayout();
      });
    }
  }

  createLayout(form: NgForm){
    const formData: FormData = new FormData;
    if (form.valid) {
      formData.append("title", this.layoutModel.title);
      formData.append("subtitle", this.layoutModel.subtitle);
      formData.append("logo", this.fileInput.nativeElement.files[0]);
      this.http.post("Layouts/Create", formData, (res) => {
        // this.getLayout();
        location.reload();
      });
    }
  }

  updateIsActive(id:string) {
    this.http.get(`Layouts/UpdateIsActive?Id=${id}`, (res) => {
      // location.reload();
      this.getLayout();
    })
  }

  getLink(){
    this.http.get("Links/GetAll", (res) => {
      this.links = res.data;
      
    })
  }

  createLink(form:NgForm){
    if (form.valid) {
      // Seçilen rate değerini number türüne çeviriyoruz
    const typeValue = parseInt((<HTMLSelectElement>document.getElementById('linkType')).value, 10);

    // Comment modeline id ve rate değerini atıyoruz
    if (!isNaN(typeValue)) {
      this.linkModel.linkType = typeValue;

      // HTTP post isteğiyle yorumu güncelliyoruz
      this.http.post("Links/Create", this.linkModel, (res) => {
        this.addCardDiv = false;
        this.getLink();
      });
    } else {
      console.error("Lütfen geçerli bir rate değeri seçiniz.");
    }
    }
  }

  updateLink(form:NgForm, link:LinkModel){
    if (form.valid) {
       // Seçilen rate değerini number türüne çeviriyoruz
    const typeValue = parseInt((<HTMLSelectElement>document.getElementById('linkType')).value, 10);

    // Comment modeline id ve rate değerini atıyoruz
    if (!isNaN(typeValue)) {
      link.linkType = typeValue;

      // HTTP post isteğiyle yorumu güncelliyoruz
      this.http.post("Links/Update", link, (res) => {
        this.addCardDiv = false;
        this.getLink();
      });
    } else {
      console.error("Lütfen geçerli bir rate değeri seçiniz.");
    }
    }
  }

  updateLinkIsActive(id:string) {
    this.http.get(`Links/UpdateIsActive?Id=${id}`, (res) => {
      // location.reload();
      this.getLink();
    })
  }

  deleteLinkById(id:string){
    this.swal.callToastWithButton('Are you sure you want to delete?', 'Yes!', () => {
      this.http.get(`Links/DeleteById?Id=${id}`, (res) => {
        this.getLink();
      });
    });
  }

  getMiniService(){
    this.http.get("MiniServices/GetAll", (res) => {
      this.miniServices = res.data;
      
    });
  }

  createMiniService(form:NgForm){
    const formData: FormData = new FormData();
    if (form.valid) {
      formData.append("title", this.miniServiceModel.title);
      formData.append("subtitle", this.miniServiceModel.subtitle);
      formData.append("image", this.fileInput.nativeElement.files[0])
      this.http.post("MiniServices/Create", formData, (res) => {
        this.addMiniServiceCardDiv = false;
        this.getMiniService();
      location.reload();

      })
    }
  }

  updateMiniService(form:NgForm, miniService:MiniServiceModel){
    const formData: FormData = new FormData();
    if (form.valid) {
      formData.append("id", miniService.id!);
      formData.append("title", miniService.title);
      formData.append("subtitle", miniService.subtitle);
      formData.append("image", this.fileInput.nativeElement.files[0])
      this.http.post("MiniServices/Update", formData, (res) => {
        // this.getMiniService();
      location.reload();
        
      })
    }
  }

  updateMiniServiceIsActive(id:string) {
    this.http.get(`MiniServices/UpdateIsActive?Id=${id}`, (res) => {
      console.log(res);
      location.reload();
      // this.getMiniService();
    })
  }

  deleteMiniServiceById(id:string){
    this.swal.callToastWithButton('Are you sure you want to delete?', 'Yes!', () => {
      this.http.get(`MiniServices/DeleteById?Id=${id}`, (res) => {
        this.getMiniService();
      });
    });
  }

  setImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file);
      this.layoutModel.logo = file.name;
    }
  }

  setMiniServiceImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file);
      this.miniServiceModel.image = file.name;
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  addCard() {
    this.addCardDiv = !this.addCardDiv;
  }

  addLinkCard() {
    this.addLinkCardDiv = !this.addLinkCardDiv;
  }
  
  addMiniServiceCard(){
    this.addMiniServiceCardDiv = !this.addMiniServiceCardDiv;
  }
}
