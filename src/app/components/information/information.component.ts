import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';
import { InformationModel } from '../../models/information.model';
import { WorkDateModel } from '../../models/work-date.model';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css'
})
export class InformationComponent {
  informationModel: InformationModel = new InformationModel();
  workDates: WorkDateModel[] = [];
  workDateModel:WorkDateModel = new WorkDateModel();
  isInformationNull = false;

  constructor(
    private http: HttpService,
    private swal: SwalService
  ) {
    this.getInformation();
    this.getWorkDate();
  }

  getInformation() {
    this.http.get("Informations/GetAll", (res) => {
      this.informationModel = res.data[0];
      if(this.informationModel === null){
        this.isInformationNull = true;
      }
    });
  }

  createInformation(form:NgForm){
    if (form.valid) {
      this.http.post("Informations/Create", this.informationModel, (res) => {
        this.getInformation();
      })
    }
  }

  updateInformation(form: NgForm) {
    if (form.valid) {
      this.http.post("Informations/Update", this.informationModel, (res) => {
        this.getInformation();
      })
    }
  }

  getWorkDate() {
    this.http.get("WorkDates/GetAll", (res) => {
      this.workDates = res.data;

    });
  }

  createWorkDate(form:NgForm){
    if (form.valid) {
      this.http.post("WorkDates/Create", this.workDateModel, (res) => {
        this.getWorkDate();
      })
    }
  }

  updateWorkDate(form: NgForm, workDate: WorkDateModel) {
    if (form.valid) {
      this.http.post("WorkDates/Update", workDate, (res) => {
        this.getWorkDate();
      })
    }
  }
}
