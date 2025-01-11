import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Commentaire } from 'app/models/Commentaire';
import { NewReclamation } from 'app/models/NewReclamation';
import { Reclamation } from 'app/models/Reclamation';
import { CommentaireService } from 'app/service/commentaire.service';
import { ReclamationService } from 'app/service/reclamation.service';
import { AuthService } from '../auth.service';
import { Personne } from 'app/models/personne.model';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.scss']
})
export class ReclamationComponent implements  OnInit{
  reclamationForm: FormGroup;
  commentForm: FormGroup;
  reclamations: Reclamation[] = [];
  selectedImage: File = null;
  currentUserId = 1; 
  count = 0;
  user:any;
  constructor(
    private fb: FormBuilder,
    private reclamationService: ReclamationService,
    private commentaireService: CommentaireService,
    private auth : AuthService
  ) {
    this.reclamationForm = this.fb.group({
      description: [''],
      titre: [''],
      type: ['']
    });
    this.commentForm = this.fb.group({
      content: ['']
    });
  }

  ngOnInit(): void {
    this.loadReclamations();
    this.currentUserId=this.auth.getUserIdFromStorage();
    
    
  }

  loadReclamations(): void {
    this.reclamationService.getAllReclamations().subscribe({
      next: (data) => {
        this.reclamations = data;
       console.log("rec====",data)
        this.reclamations.forEach(reclamation => {
          console.log("reclamation .like ",reclamation.likes," id rec", reclamation.idReclamation)
          if (reclamation.image && typeof reclamation.image === 'string' && reclamation.image.trim() !== '') {
            reclamation.image = 'data:image/png;base64,' + reclamation.image;
          
          }
         
        });
      },
      error: (err) => {
        console.error('Error loading reclamations', err);
      }
    });
  }
  
 
  addReclamation(): void {
    const formValue = this.reclamationForm.value;
   
    const newReclamation: NewReclamation = {
      titre: formValue.titre,
      description: formValue.description,
      date: new Date().toISOString().split('T')[0], 
      heure: new Date().toTimeString().split(' ')[0], 
      type: formValue.type,
      image: this.selectedImage 
    };
console.log("ttttitre",newReclamation)
    this.reclamationService.createReclamation(newReclamation, this.currentUserId).subscribe({
      next: (reclamation) => {
        this.reclamations.unshift(reclamation);
        this.reclamationForm.reset();
        this.loadReclamations()
        this.selectedImage = null;
      },
      error: (err) => {
        console.error('Error creating reclamation', err);
      }
    });
  }

  onImageUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      this.selectedImage = target.files[0];
     
    
    }
  }

  
  likeReclamation(reclamation: any): void {
    const reclamationId = reclamation.idReclamation; 
    console.log("reclamationId",reclamationId)
    
    this.reclamationService.likeReclamation(reclamationId, this.currentUserId).subscribe({
      next: (data) => {
        this.loadReclamations()
        //console.log("hhhh",data)
      },
      error: (err) => {
        console.error('Error liking reclamation', err);
      }
    });
  }

  addComment(reclamation: any): void {
    const reclamationId = reclamation.idReclamation; 
    const content = this.commentForm.value.content;
    if (!content) return;

    this.commentaireService.createCommentaire( reclamationId,this.currentUserId,content).subscribe({
      next: (comment) => {
        console.log("hhhh",comment)
        this.commentForm.reset();
        this.loadReclamations();
      },
      error: (err) => {
        console.error('Error adding comment', err);
      }
    });
  }

   countLikes(reclamation :any) :number {
    const likes = reclamation.likes;
    //console.log("likes",likes.length)
   return likes.length;

  }
  parseCommentContent(content: string): string {
    
    if (content && typeof content === 'string') {
      try {
       
        const cleanedContent = content.trim();
       
        if (cleanedContent.startsWith("{") && cleanedContent.endsWith("}")) {
          const parsedContent = JSON.parse(cleanedContent);
          
          return parsedContent.content ? parsedContent.content : cleanedContent;
        }
       
        else {

          return cleanedContent;
        }
      } catch (e) {
       
        return content; 
      }
    }
    return content; 
  }
  
  
  
}
