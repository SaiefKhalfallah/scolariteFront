import { Personne } from "./personne.model";

export interface Commentaire {
    id: number;
    contenu: string;
    personne: Personne;
    dateCreation: string;
  }