import { Component, OnInit } from '@angular/core';
import { DocService } from 'app/service/doc.service';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import html2canvas from 'html2canvas';
import { UserService } from 'app/user.service';
import { Personne } from 'app/models/personne.model';
import { AuthService } from 'app/auth.service';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  docs: any[] = []; 
  file: File | undefined;
  docToDisplay:any
  currentUser:any;
  documents: any[] = [];
  docsuser: any[] = [];
  user :Personne;
  doc :any;

  constructor( private datePipe: DatePipe, private toastr: ToastrService,  private docservice:DocService , private userservie :UserService,private auth :AuthService
  ) { 
   
  }
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
    if(this.currentUser.roles === 'ETUDIANT'){
      const userid=this.auth.getUserIdFromStorage();
      this.docservice.getDocumentsForUser(userid).subscribe(data => {
        this.docsuser = data; 
      });
    }
  

  }
  saveFile(id:any ,file :File) {
    this.docservice.uploadFile(id,file).subscribe(
     () => {
       this.toastr.success(`Document accepté`);
       this.getAllDocs(); 
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
              this.docs=response
            ;
          },
          (error) => {
              console.error('Error:', error); // Log any errors to console
          }
      );
  

      
  }
  Request(type:any){


    const obj=
        {
            "idEleve": this.currentUser.id_personne,
            "type": type,
            "Date_reception": this.datePipe.transform(new Date(), 'dd-MM-yyyy')
            
          }

          console.log('aa',obj)

          this.docservice.adddocumentAdministratif(obj).subscribe(
            (response) => {
                console.log(response); // Log the response to console
            this.getAllDocs()
                this.toastr.success("Document demandé avec succés")
            },
            (error) => {
                console.error('Error:', error); // Log any errors to console
                this.toastr.error("Problème rencontré")

            }
        );
    }
    formatDate(timestamp: number): string | null {
      return this.datePipe.transform(timestamp, 'dd/MM/yyyy');
    }
    downloadPDF(id: any) {
      console.log("doc user", this.docsuser);
      this.docToDisplay = this.docsuser.find(doc => doc.id_document === id);
   
      if (this.docToDisplay && this.docToDisplay.fileupload) {
        const base64Data = this.docToDisplay.fileupload;
   
        const fileSize = (base64Data.length * 3) / 4;  // Calcul approximatif de la taille en octets
        console.log("File size (bytes): ", fileSize);
   
        // Si le fichier est trop volumineux, vous pouvez décider d'implémenter un message d'erreur ou un téléchargement direct
        if (fileSize < 50 * 1024 * 1024) { // Si la taille est inférieure à 10 Mo
          const linkSource = 'data:application/pdf;base64,' + base64Data;
          
          const downloadLink = document.createElement("a");
          const fileName = "justificatif.pdf";  // Nom du fichier pour le téléchargement
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          
          // Simuler un clic pour lancer le téléchargement
          downloadLink.click();
        } else {
          console.error("Le fichier est trop volumineux pour être téléchargé avec base64.");
          // Vous pourriez ici envisager de montrer un message ou d'ajouter une méthode de téléchargement direct.
        }
      } else {
        console.error("Le document PDF est introuvable ou ne contient pas de données.");
      }
    }
   
    
 async generatePDF(user :any): Promise<File> {
  await  console.log("yasssss",user)
     return  new  Promise(  (resolve, reject) =>  {
    
     var formattedDate : String ='';
     
     if(user){
      console.log("date de ..",user.datenaissance)
      formattedDate  =  this.formatDate(user.datenaissance)
      
     }
     
     const nom = user.nom || 'Nom non défini';
     const prenom = user.prenom || 'Prénom non défini';
     const telephone = user.telephone || 'Téléphone non défini';
     const nomclasse = user.nomclasse || 'Nom de classe non défini';

     
      const  hiddenHtml = `
     <div style="width: 210mm; height: 297mm; padding: 20mm; font-family: 'Times New Roman', serif; font-size: 16px; line-height: 1.5; box-sizing: border-box;">
  <div id="pdfTable" #pdfTable>
    <p dir="LTR" style='margin:0cm; margin-bottom:.0001pt; text-align:justify; font-size:17px; font-family:"Times New Roman", serif;'>
      &nbsp;
    </p>
    <p dir="LTR" style='margin:0cm; margin-bottom:.0001pt; text-align:justify; font-size:16px; font-family:"Times New Roman", serif;'>
      -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    </p>
    <div class="logo">
      <img src="/assets/img/avatar.png" style="width: 50mm; height: auto; margin-left: 10mm;" />
    </div>
    <h3 dir="LTR" style='margin:0cm; font-size:14px; font-family:"Times New Roman", serif;'>
      République Tunisienne
    </h3>
    <h3 dir="LTR" style='margin:0cm; font-size:14px; font-family:"Times New Roman", serif;'>
      Ministère de l'éducation Tunisie
    </h3>
    <h3 dir="LTR" style='margin:0cm; font-size:14px; font-family:"Times New Roman", serif;'>
      Lycée et Collège Esprit-Al Fikr 
    </h3>
    <h1 dir="LTR" style='margin:0cm; text-align:left; font-size:20px; font-family:"Times New Roman", serif;'>
      Cebalat Ben Ammar
    </h1>
    <h2 style="font-size:24px; text-align:center; margin-top:20mm;">ATTESTATION DE PRÉSENCE</h2>
    <div style="margin-left: 10mm; margin-top: 20mm;">
      <p dir="LTR" style='font-size:17px;'>
        Le Secrétaire Général du Lycée et Collège Esprit-Al Fikr atteste que :
      </p>
      <p dir="LTR" style='font-size:17px;'>
        <strong>Nom :</strong> ............ ${nom} ............
      </p>
      <p dir="LTR" style='font-size:17px;'>
        <strong>Prénom :</strong> ............ ${prenom} ............
      </p>
      <p dir="LTR" style='font-size:17px;'>
        <strong>Né(e) le :</strong> ${formattedDate || 'Non défini' } à Tunis
      </p>
      <p dir="LTR" style='font-size:17px;'>
        <strong>Numéro de téléphone :</strong> ${telephone}
      </p>
      <p dir="LTR" style='font-size:17px;'>
        Inscrit(e) en ${nomclasse} pour l’année 2024 / 2025
      </p>
      <p dir="LTR" style='font-size:16px; text-align:justify;'>
        La présente attestation est délivrée à l’intéressé(e), pour servir et valoir ce que de droit.
      </p>
    </div>
    <p dir="LTR" style='font-size:16px; text-align:right; margin-top: 20mm;'>
      <strong>Tunis, le ...../...../.....</strong>
    </p>
    <p dir="LTR" style='font-size:16px; text-align:right;'>
      Le Secrétaire Général
    </p>
    <p dir="LTR" style='text-align:left; font-size:16px; margin-top:20mm;'>
      ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    </p>
  </div>
</div>

      `;
  
      const container =  document.createElement('div');
      container.innerHTML = hiddenHtml;
  
      const pdfElement = container.querySelector('#pdfTable') as HTMLElement;
  
      if (!pdfElement) {
        console.error('L\'élément HTML #pdfContent n\'a pas été trouvé');
        reject(new Error("L'élément HTML #pdfContent n'a pas été trouvé."));
        return;
      }
  
      // Ajouter l'élément au DOM
      document.body.appendChild(pdfElement);
  
      // Log pour vérifier que l'élément est bien dans le DOM
      console.log('Élément ajouté au DOM:', pdfElement);
  
      // Donner un léger délai pour permettre le rendu correct du DOM
      setTimeout(() => {
        html2canvas(pdfElement, { 
          scale: 1, 
          logging: true,   // Activer les logs pour html2canvas
          useCORS: true,   // Utiliser CORS pour les ressources externes
          backgroundColor: null // Aucun fond de couleur (transparent)
        })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgWidth = 210; // Largeur A4 en mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  
          const pdfBlob = pdf.output('blob');
          const file = new File([pdfBlob], 'attestation.pdf', { type: 'application/pdf' });
  
          resolve(file);
        })
        .catch((error) => {
          console.error('Erreur lors de la génération du PDF avec html2canvas:', error);
          reject(new Error('Erreur lors de la génération du PDF'));
        })
        .finally(() => {
          // Nettoyer l'élément du DOM après la génération
          if (pdfElement) {
            document.body.removeChild(pdfElement);
          }
        });
      }, 1000); // Attendre un peu avant la capture
    
    });
  }
  
  
  
  
  async acceptRequest(doc :any): Promise<void> {
    console.log("doc id :::",doc)
    
    try {
      const id=doc.id_document;
      const user= await this.getuser(doc.idEleve);
      console.log("acepte " , user)
      const file = await this.generatePDF(user);
      
      console.log("doc file :::",file)
      this.saveFile(id,file); 
      this.changestatus(id,"ACCEPTED")
    } catch (error) {
      console.error('Erreur lors de la génération ou de l\'upload du fichier PDF', error);
    }
  }

  async getuser(id: number) {
    try {
      // Utilisez firstValueFrom pour obtenir la première valeur de l'Observable
      const user = await firstValueFrom(this.userservie.getbyId(id));
      return user;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur', error);
      throw error;  // Lancer l'erreur si nécessaire
    }
  }
  changestatus(id:number,status :string){
    this.docservice.changestatus(id,status).subscribe((data)=>{
      this.doc=data;
    })
  }
  rejectRequest(documentId: number) {
    this.docservice.changestatus(documentId, 'REJECTED').subscribe(response => {
      this.doc=response
      this.getAllDocs()
      console.log('Document rejeté', response);
    });
  }

 

}
