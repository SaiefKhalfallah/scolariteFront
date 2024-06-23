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

    MatiereForm: FormGroup;
    ClassForm:FormGroup;
    matieres:any
    users:any
    classes:any

    className:any
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
        private toastr: ToastrService
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
                        this.toastr.success("Matiére ajouté avec succés")
                    },
                    (error) => {
                        console.error('Registration failed:', error);
                        this.toastr.error("Probléme d'ajout")

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
    anyCheckboxChecked() {
        return this.matieres.some(matiere => matiere.checked);
    }
    affecterMatiere() {
        const obj = {
            "nom": this.className,
            "matieres": this.checkedMatieres.map(matiere => ({ "id": matiere.id, "nom": matiere.nom }))
        };

        this.classeService.addClasse(obj).subscribe(
            (response) => {
                this.toastr.success("les matiéres sont affectées a la classe "+this.className)
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
                this.getAllMatieres();
                // Optionally, refresh the list or handle the UI update here
            },
            error => {
                console.error('Error deleting person', error);
            }
        );
    }
}
