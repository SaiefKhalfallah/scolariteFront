import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SanctionService } from 'app/service/sanction.service';
import { Console } from 'console';
import { ToastrService } from 'ngx-toastr';
import * as pdfjs from 'pdfjs-dist';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  seepdf:any
  isVisible: Boolean
absenceToDisplay:any
currentUser:any;
absences:any
sanctions:any
pdfSrc: string | ArrayBuffer;
file: File | undefined;
@ViewChild('pdfViewer', { static: false }) pdfViewer: ElementRef;
pdfData: any; // Variable to hold PDF data from base64

  constructor(private http: HttpClient,
    private router: Router,
    private toastr: ToastrService, 
    private sanctionservice:SanctionService  ) { }

  ngOnInit() {
    this.seepdf=false;

    this.isVisible=false;
    this.currentUser = JSON.parse(localStorage.getItem('user'));
   
      this.getAllSanction()
      this.getAllAbsences()

  
 
  
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
getAllAbsences(){
  this.sanctionservice.getAbsences().subscribe(
    (response) => {
        console.log(response
        ); // Log the response to console

        if (this.currentUser.roles == "ADMINISTRATEUR") {
            this.absences = response;
            console.log("admin");
        } else if (this.currentUser.roles == "ENSEIGNANT") {
            this.absences = response.filter(absence => absence.enseignant.id_personne == this.currentUser.id_personne);
            console.log("enseignant",this.absences);
        } else if (this.currentUser.roles =="ETUDIANT") {
            this.absences = response.filter(absence => 
             
              absence.eleve.id_personne == this.currentUser.id_personne )  ;
            console.log("etudiant",this.absences);
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
confirmAb(id:any){
  this.sanctionservice.justifier(id, "oui").subscribe(
    () => {
        this.toastr.success(`Justificatif accepté`);
        this.getAllAbsences(); // Refresh the list after each successful update
    },
    error => {
      this.toastr.error(`Error`);
    } );
}
cancelAb(id:any){
  this.sanctionservice.justifiern(id, "non2").subscribe(
    () => {
        this.toastr.success(`Justificatif refusé`);
        this.getAllAbsences(); // Refresh the list after each successful update
    },
    error => {
      this.toastr.error(`Error`);
    } );
}

function(ext) {
  if (ext != undefined) {
      return this.extToMimes(ext);
  }
  return undefined;
}
extToMimes(ext) {
  let type = undefined;
  switch (ext) {
      case 'jpg':
      case 'png':
      case 'jpeg':
          type = 'image/jpeg'
          break;
      case 'txt':
          type = 'text/plain'
          break;
      case 'xls':
          type = 'application/vnd.ms-excel'
          break;
      case 'doc':
          type = 'application/msword'
          break;
      case 'xlsx':
          type = 'application/vnd.ms-excel'
          break;
      default:

  }
  return type;
}
async onFileSelected(event: any) {
  const file: File = event.target.files[0];
  
  this.file=file
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const typedArray = new Uint8Array(e.target.result);
      this.renderPDF(typedArray,e.target.result);
    };
    reader.readAsArrayBuffer(file);
  }
}
async toggleVisibility(id:any){
  this.seepdf=!this.seepdf;


  this.absenceToDisplay = this.absences.find(absence => absence.id === id);

  this.file=this.absenceToDisplay.absence.fileupload;
  this.test()
}

 downloadPDF(id:any) {
  this.absenceToDisplay = this.absences.find(absence => absence.id === id);

  const linkSource = 'data:application/pdf;base64,' + this.absenceToDisplay.absence.fileupload;
  const downloadLink = document.createElement("a");
  const fileName = "justificatif.pdf";
  
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}
test(): void {
  if (this.absenceToDisplay && this.absenceToDisplay.absence && this.absenceToDisplay.absence.fileupload) {
    this.pdfData = this.absenceToDisplay.absence.fileupload;
    pdfjs.GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.js'; // Adjust the path as per your project structure

    const binaryString = atob(this.absenceToDisplay.absence.fileupload);
    console.log('blob2',binaryString)
  
    // Create a Uint8Array from the binary string
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }

    // Load PDF using PDF.js
    const pdfData = atob(this.pdfData);
    console.log(pdfData)
    const loadingTask = window['pdfjs-dist'].getDocument({ data: uint8Array });

    loadingTask.promise.then(pdf => {
      // Fetch the first page
      pdf.getPage(1).then(page => {
        const viewport = page.getViewport({ scale: 1 });
        const canvas = this.pdfViewer.nativeElement;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
      });
    }, reason => {
      console.error('Error: ' + reason);
    });
  }
}
 
renderPDF(data: Uint8Array,a:any) {
  console.log('target',a)

  console.log('data pdf etudiant',data)

  pdfjs.GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.js'; // Adjust the path as per your project structure

  pdfjs.getDocument(data).promise.then(pdf => {
    pdf.getPage(1).then(page => {
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas: HTMLCanvasElement = this.pdfViewer.nativeElement;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      page.render(renderContext);
    });
  });
}
  saveFile(id:any) {
   this.sanctionservice.uploadFile(id,this.file).subscribe(
    () => {
      this.toastr.success(`Justificatif envoyé`);
      this.getAllAbsences(); // Refresh the list after each successful update
  },
  error => {
    this.toastr.error(`Error`);
  } 

   );
     }
   

fileconfirmab(id:any,name:any){
  this.sanctionservice.justifierfilename(id,name).subscribe(
    () => {
        this.toastr.success(`Justificatif envoyé`);
        this.getAllAbsences(); // Refresh the list after each successful update
    },
    error => {
      this.toastr.error(`Error`);
    } );

}
}
