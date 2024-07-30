import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/user-profile', title: 'Gestion des profils',  icon:'person', class: '' },
    { path: '/table-list', title: 'Sanctions et absences',  icon:'library_books', class: '' },
    { path: '/typography', title: 'Notifications',  icon:'notifications', class: '' },
    { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    { path: '/maps', title: 'Réclamations',  icon:'location_on', class: '' },
    { path: '/notifications', title: 'Documents administratifs',  icon:'content_paste', class: '' },
    { path: '/list-profile', title: 'Liste des utilisateurs',  icon:'people', class: '' },
    { path: '/add-matiere', title: 'classes/matières',  icon:'library_books', class: '' },


];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
