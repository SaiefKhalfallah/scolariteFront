import { Commentaire } from "./Commentaire";
import { Personne } from "./personne.model";

export interface Reclamation {
  idReclamation: number;
    title: string;
    description: string;
    date: string;
    heure: string;
    image?: string;
    type: string ;
    likes: any[];
    commentaires: Commentaire[];
    personne: Personne;
  }