import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Commentaire } from 'app/models/Commentaire';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {

  private apiUrl = `http://localhost:8089/api/commentaires`; // URL de l'API

  constructor(private http: HttpClient) {}

  createCommentaire( reclamationId: number, authorId: number,content: string): Observable<Commentaire> {
    return this.http.post<Commentaire>(`${this.apiUrl}/${reclamationId}/${authorId}`, { content });
  }

  updateCommentaire(commentaireId: number, newContent: string): Observable<Commentaire> {
    return this.http.put<Commentaire>(`${this.apiUrl}/${commentaireId}`, { content: newContent });
  }

  deleteCommentaire(commentaireId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${commentaireId}`);
  }

  getCommentairesByReclamation(reclamationId: number): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.apiUrl}/reclamation/${reclamationId}`);
  }
}
