export interface Personne {
    id?: number;
    firstname: string;
    lastname: string;
    birthdate: Date; 
    address: string;
    gender: string;
    phoneNumber: number;
    password?: string; 
  }