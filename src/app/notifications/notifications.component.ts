import { Component, OnInit } from '@angular/core';
import { DocService } from 'app/service/doc.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  docs: any[] = [];  file: File | undefined;
  docToDisplay:any
  currentUser:any;

  constructor(       private toastr: ToastrService,  private docservice:DocService
  ) { }
  showNotification(from, align){
      const type = ['','info','success','warning','danger'];

      const color = Math.floor((Math.random() * 4) + 1);

      $.notify({
          icon: "notifications",
          message: "Welcome to <b>Material Dashboard</b> - a beautiful freebie for every web developer."

      },{
          type: type[color],
          timer: 4000,
          placement: {
              from: from,
              align: align
          },
          template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
            '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
            '<i class="material-icons" data-notify="icon">notifications</i> ' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
              '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            '</div>' +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
          '</div>'
      });
  }
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user'));

    this.getAllDocs();

  }
  saveFile(id:any) {
    this.docservice.uploadFile(id,this.file).subscribe(
     () => {
       this.toastr.success(`Justificatif envoyé`);
       this.getAllDocs(); // Refresh the list after each successful update
   },
   error => {
     this.toastr.error(`Error`);
   } 
 
    );
      }

      

  getAllDocs(){
    
      this.docservice.getdocumentAdministratif().subscribe(
          (response) => {
              console.log(response); // Log the response to console
              this.docs=response.filter(doc => {
                return doc.id_eleve === this.currentUser.id_personne;
            });
          },
          (error) => {
              console.error('Error:', error); // Log any errors to console
          }
      );
  

      
  }
  Request(type:any){


    const obj=
        {
            "id_eleve": this.currentUser.id_personne,
            "type": type,
          }

          console.log('aa',obj)

          this.docservice.adddocumentAdministratif(obj).subscribe(
            (response) => {
                console.log(response); // Log the response to console
            this.getAllDocs()
                this.toastr.success("Docment demandé avex succés")
            },
            (error) => {
                console.error('Error:', error); // Log any errors to console
                this.toastr.error("Probléme rencontré")

            }
        );
    }

  downloadPDF(id:any) {
    this.docToDisplay = this.docs.find(doc => doc.id === id);
  
    const linkSource = 'data:application/pdf;base64,' + this.docToDisplay.doc.fileupload;
    const downloadLink = document.createElement("a");
    const fileName = "justificatif.pdf";
    
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

}
