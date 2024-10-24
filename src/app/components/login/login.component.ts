import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SwalService } from '../../services/swal.service';
import { Router, RouterLink } from '@angular/router';
import { LoginModel } from '../../models/login.model';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  url:string = ""
  // url:string = "https://alternatifmuhendis.webapi.erendelibas.com/api/"
  loginModel: LoginModel = new LoginModel();
  showModal = false;
  emailModel: ForgotPasswordModel = new ForgotPasswordModel();

  constructor(
    private http: HttpClient,
    private https: HttpService,
    private swal: SwalService,
    private router: Router,
    // private emailService: EmailJsService
  ) {
    this.url = https.url;
  }

  login(form: NgForm) {
    if (form.valid) {
      this.http.post(`${this.url}Auth/Login`, this.loginModel)
        .subscribe({
          next: (res: any) => {
            console.log(res.data);
            localStorage.setItem("token", res.data.token);
            this.swal.callToast(res.message);
            this.router.navigateByUrl("/");
          },
          error: (err: HttpErrorResponse) => {
            console.log(err)
            this.swal.callToast(err.error.errorMessages[0], 'warning');
          }
        });
    }
  }

  sendForgotMail(form:NgForm){
    if(form.valid){
      // this.emailService.sendEmail(this.emailModel);
      this.showModal = false;
    }
  }
}

export class ForgotPasswordModel{
  email: string = "";
}