import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Commentaire } from 'app/models/Commentaire';
import { NewReclamation } from 'app/models/NewReclamation';
import { Reclamation } from 'app/models/Reclamation';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private apiUrl = `http://localhost:8089/api/reclamation`; // URL de l'API

  constructor(private http: HttpClient) {}
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Récupérer le token depuis localStorage
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.apiUrl, { headers: this.getHeaders() });
  }
  createReclamation(reclamation: NewReclamation, userId: number): Observable<Reclamation> {
    const formData: FormData = new FormData();
  
    // Ajouter les champs texte
    formData.append('titre', reclamation.titre);
    formData.append('description', reclamation.description);
    formData.append('date', reclamation.date);
    formData.append('heure', reclamation.heure);
    formData.append('type', reclamation.type);
  
    // Ajouter l'image si elle existe
    if (reclamation.image) {
      console.log('Image sélectionnée :', reclamation.image);
      formData.append('image', reclamation.image, reclamation.image.name);
    }
  
    // Envoi de la requête
    return this.http.post<Reclamation>(`${this.apiUrl}/${userId}`, formData);
  }
  
  

  likeReclamation(reclamationId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${reclamationId}/like/${userId}`, { headers: this.getHeaders() });
  }

  unlikeReclamation(reclamationId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${reclamationId}/unlike/${userId}`, null, { headers: this.getHeaders() });
  }

  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([uintArray], { type: 'image/jpeg' });
  }
}
