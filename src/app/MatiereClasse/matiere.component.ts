import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import {FormBuilder,FormGroup, Validators} from "@angular/forms";
import {UserService} from "../user.service";
import {AuthService} from "../auth.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ClasseService} from "../service/classe.service";
import {ToastrService} from "ngx-toastr";
declare var $: any;

@Component({
  selector: 'app-matiere',
  templateUrl: './matiere.component.html',
  styleUrls: ['./matiere.component.css']
})
export class MatiereComponent implements OnInit {
    checkedMatieres: any[] = [];
    checkedUsers: any[] = [];

    MatiereForm: FormGroup;
    ClassForm:FormGroup;
    matieres:any
    users:any
    classes:any

    className:any
    filteredUsers: any[] = [];
    selectedRole: string = '';
    selectedClass: string = '';

    initMatiereForm() {
        this.MatiereForm = this.formBuilder.group({
            nom: ['', Validators.required],
        });
        this.ClassForm = this.formBuilder.group({
            nom: ['', Validators.required],
        });
    }
    constructor(
        private fb: FormBuilder,
        private classeService: ClasseService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private router: Router,
        private toastr: ToastrService,
        private userservice:UserService
    ) {


    }
    ngOnInit(): void {

        this.initMatiereForm();
        this.getAllMatieres();
        this.getAllPersonnes();
        this.getAllClasses();



    }
    getAllClasses(){
        this.classeService.getClasses().subscribe(
            (response) => {
                console.log(response); // Log the response to console
                this.classes=response
            },
            (error) => {
                console.error('Error:', error); // Log any errors to console
            }
        );
    }
    getAllPersonnes(){
        this.classeService.getUsers().subscribe(
            (response) => {
                console.log(response); // Log the response to console
                this.users=response
                this.users = this.users.filter(user => !user.roles.includes('ADMINISTRATEUR'));
                this.filteredUsers = this.users;

            },
            (error) => {
                console.error('Error:', error); // Log any errors to console
            }
        );
    }
    getAllMatieres(){
        this.classeService.getMatieres().subscribe(
            (response) => {
                console.log(response); // Log the response to console
                this.matieres=response;
            },
            (error) => {
                console.error('Error:', error); // Log any errors to console
            }
        );
    }
    addmatiere() {

        if (this.MatiereForm.valid) {
            const formData = new FormData();
            Object.keys(this.MatiereForm.value).forEach(key => {
                formData.append(key, this.MatiereForm.value[key]);
            });
            console.log(this.MatiereForm.value);

            this.classeService.addMatiere(this.MatiereForm.value)
                .subscribe(
                    (response) => {
                        this.getAllMatieres();
                        this.MatiereForm.reset();
                        this.checkedMatieres.length = 0;
                        this.toastr.success("Matière ajoutée avec succès")
                    },
                    (error) => {
                        console.error('Registration failed:', error);
                        this.toastr.error("Problème d'ajout")

                    }
                );
        } else {
            console.log('Form is invalid');
        }
    }
    updateCheckedStatus(matiere: any, isChecked: boolean) {
        matiere.checked = isChecked;

        // Update checkedMatieres array based on isChecked
        if (isChecked) {
            this.checkedMatieres.push(matiere);
        } else {
            const index = this.checkedMatieres.findIndex(item => item.id === matiere.id);
            if (index !== -1) {
                this.checkedMatieres.splice(index, 1);
            }
        }
    }
    updateCheckedStatusUser(user: any, isChecked: boolean) {
        user.checked = isChecked;

        // Update checkedMatieres array based on isChecked
        if (isChecked) {
            this.checkedUsers.push(user);
        } else {
            const index = this.checkedUsers.findIndex(item => item.id === user.id);
            if (index !== -1) {
                this.checkedUsers.splice(index, 1);
            }
        }
        console.log("checked users",this.checkedUsers)
    }
    anyCheckboxChecked() {
        return this.matieres.some(matiere => matiere.checked);
    }
    anyCheckboxCheckedUser(){
        return this.filteredUsers.some(user => user.checked);

    }
    affecterClassePersonne():void{
        this.checkedUsers.forEach(user => {
            this.userservice.affectPersonClass(user.id_personne, this.selectedClass).subscribe(
                () => {
                    this.toastr.success(`La personne avec l'id ${user.id_personne} est affectée à la classe ${this.selectedClass}`);
                    this.getAllPersonnes(); // Refresh the list after each successful update
                },
                error => {
                    this.toastr.error("Problème serveur lors de l'affectation de la classe pour une personne.");
                    console.error(`Erreur pour la personne avec l'id ${user.id_personne}: `, error);
                }
            );
        });
    }
    affecterMatiere() {
        const obj = {
            "nom": this.className,
            "matieres": this.checkedMatieres.map(matiere => ({ "id": matiere.id, "nom": matiere.nom }))
        };

        this.classeService.addClasse(obj).subscribe(
            (response) => {
                this.toastr.success("les matières sont affectées à la classe "+this.className)
                this.getAllClasses();
// Optionally, refresh the list or handle the UI update here
            },
            error => {
                this.toastr.error("Error adding classe");
            }
        );
    }

    retriveClassName(event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        this.className = inputValue; // Assuming `className` is a property in your component
    }
    deleteClasse(id:number): void {
        this.classeService.deleteClasse(id).subscribe(
            () => {
                this.getAllClasses();
                // Optionally, refresh the list or handle the UI update here
            },
            error => {
                console.error('Error deleting person', error);
            }
        );
    }
    deleteMatiere(id: number): void {
        this.classeService.deleteMatiere(id).subscribe(
            () => {
                console.log(`Person with id ${id} deleted successfully`);
                this.toastr.success("La matière est supprimée avec succès");
                this.getAllMatieres();

                // Optionally, refresh the list or handle the UI update here
            },
            error => {
                this.toastr.error("Vous ne pouvez pas supprimer cette matière car elle est utilisée dans une classe");

                console.error('Error deleting person', error);
            }
        );
    }
    applyRoleFilter() {
        if (this.selectedRole === '') {
            // If no role is selected, show all users
            this.filteredUsers = this.users;
        } else {
            // Filter users based on selected role
            this.filteredUsers = this.users.filter(user => user.roles === this.selectedRole);
        }
    }

}
