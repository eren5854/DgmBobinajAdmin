import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { ProductModel } from '../../models/product.model';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  productModel: ProductModel = new ProductModel();
  products: ProductModel[] = [];
  addCardDiv = false;
  imageSrc: string | ArrayBuffer | null = null;
  imgUrl = "";

  constructor(
    private http: HttpService,
    private swal: SwalService
  ){
    this.imgUrl = http.imageUrl;
    this.getProduct();
  }

  getProduct(){
    this.http.get("Products/GetAll", (res) => {
      this.products = res.data;
      console.log(this.products);
      
    });
  }

  createProduct(form:NgForm){
    const formData: FormData = new FormData();
    if (form.valid) {
      formData.append("productName", this.productModel.productName);
      formData.append("productDescription", this.productModel.productDescription);
      formData.append("image", this.fileInput.nativeElement.files[0]);
      this.http.post("Products/Create", formData, (res) => {
        this.addCardDiv = false;
        location.reload();
      });
    }
  }

  updateProduct(form:NgForm, product:ProductModel){
    const formData: FormData = new FormData();
    if (form.valid) {
      formData.append("id", product.id!)
      formData.append("productName", product.productName);
      formData.append("productDescription", product.productDescription);
      formData.append("image", this.fileInput.nativeElement.files[0]);
      this.http.post("Products/Update", formData, (res) => {
        this.addCardDiv = false;
        location.reload();
      });
    }
  }

  updateIsActive(id:string) {
    this.http.get(`Products/UpdateIsActive?Id=${id}`, (res) => {
      location.reload();
      // this.getOperation();
    })
  }

  deleteProductById(id:string){
    this.swal.callToastWithButton('Silmek istediğinize emin misiniz?', 'Evet', () => {
      this.http.get(`Products/DeleteById?Id=${id}`, (res) => {
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
      this.productModel.image = file.name;
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  addCard() {
    this.addCardDiv = !this.addCardDiv;
  }
}
