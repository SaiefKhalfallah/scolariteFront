import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/auth.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    roles: string[]; 
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Acceuil', icon: 'dashboard', class: '', roles: ['ADMINISTRATEUR', 'PERSONNEL','ENSEIGNANT','ETUDIANT'] },
  { path: '/user-profile', title: 'Gestion des profils', icon: 'person', class: '', roles: ['ADMINISTRATEUR'] },
  { path: '/table-list', title: 'Sanctions et absences', icon: 'library_books', class: '', roles: ['ADMINISTRATEUR','PERSONNEL','ENSEIGNANT','ETUDIANT'] },
 // { path: '/typography', title: 'Notifications', icon: 'notifications', class: '', roles: ['ADMINISTRATEUR', 'user'] },
  //{ path: '/icons', title: 'Icons', icon: 'bubble_chart', class: '', roles: ['ADMINISTRATEUR'] },
  { path: '/rec', title: 'Réclamations', icon: 'support_agent', class: '', roles: ['ADMINISTRATEUR','PERSONNEL','ENSEIGNANT','ETUDIANT'] },
  { path: '/notifications', title: 'Documents administratifs', icon: 'content_paste', class: '', roles: ['ADMINISTRATEUR','PERSONNEL','ETUDIANT'] },
  { path: '/list-profile', title: 'Liste des utilisateurs', icon: 'people', class: '', roles: ['ADMINISTRATEUR','PERSONNEL','ENSEIGNANT'] },
  { path: '/add-matiere', title: 'Classes et matières', icon: 'library_books', class: '', roles: ['ADMINISTRATEUR','PERSONNEL'] },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  currentUser :any;
  constructor( private auth :AuthService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    const role =this.currentUser.roles;
    this.menuItems = ROUTES.filter(menuItem =>
      menuItem.roles.includes(role) 
    );
   // this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
