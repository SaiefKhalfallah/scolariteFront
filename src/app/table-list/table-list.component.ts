import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SanctionService } from 'app/service/sanction.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
currentUser:any;

sanctions:any
  constructor(private http: HttpClient,
    private router: Router,
    private toastr: ToastrService, 
    private sanctionservice:SanctionService  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user'));
   
      this.getAllSanction()

  
 
  
  }
  getAllSanction(){
    this.sanctionservice.getSanction().subscribe(
      (response) => {
          console.log(response
          ); // Log the response to console
  
          if (this.currentUser.roles == "ADMINISTRATEUR") {
              this.sanctions = response;
              console.log("admin");
          } else if (this.currentUser.roles == "ENSEIGNANT") {
              this.sanctions = response.filter(sanction => sanction.enseignant.id_personne == this.currentUser.id_personne);
              console.log("enseignant",this.sanctions);
          } else if (this.currentUser.roles =="ETUDIANT") {
              this.sanctions = response.filter(sanction => 
               
                sanction.eleve.id_personne == this.currentUser.id_personne && sanction.sanction.confirmation==1)  ;
              console.log("etudiant",this.sanctions);
          }
      },
      (error) => {
          console.error('Error:', error); // Log any errors to console
      }
  );
}


confirmAv(id:any,confirmation:any){
  this.sanctionservice.changersSatus(id, confirmation).subscribe(
    () => {
        this.toastr.success(`Avertissement confirmé`);
        this.getAllSanction(); // Refresh the list after each successful update
    },
    error => {
      this.toastr.error(`Error`);
    } );
}
cancelAv(id:any,confirmation:any){
  this.sanctionservice.changersSatus(id, confirmation).subscribe(
    () => {
        this.toastr.success(`Avertissement rejeté`);
        this.getAllSanction(); // Refresh the list after each successful update
    },
    error => {
      this.toastr.error(`Error`);
    } );
}

}
