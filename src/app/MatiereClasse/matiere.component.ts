import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import {FormBuilder,FormGroup, Validators} from "@angular/forms";
import {UserService} from "../user.service";
import {AuthService} from "../auth.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ClasseService} from "../service/classe.service";
declare var $: any;

@Component({
  selector: 'app-matiere',
  templateUrl: './matiere.component.html',
  styleUrls: ['./matiere.component.css']
})
export class MatiereComponent implements OnInit {
    MatiereForm: FormGroup;
    matieres:any
    initMatiereForm() {
        this.MatiereForm = this.formBuilder.group({
            nom: ['', Validators.required],
        });
    }
    constructor(
        private fb: FormBuilder,
        private classeService: ClasseService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private router: Router
    ) {


    }
    ngOnInit(): void {
        this.initMatiereForm();
        this.getAllMatieres();

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
                        console.log('Registration successful:', response);
                        this.getAllMatieres();
                        this.showNotification('bottom', 'right', 'success', "Subject added successfully");
                        this.MatiereForm.reset();
                    },
                    (error) => {
                        console.error('Registration failed:', error);
                        this.showNotification('bottom', 'right', 'danger', "Problem occurred");
                    }
                );
        } else {
            console.log('Form is invalid');
            this.showNotification('bottom', 'right', 'danger', "Problem occurred");
        }
    }
    showNotification(from, align,typetaken,message){
        const type = typetaken;

        const color = Math.floor((Math.random() * 4) + 1);

        $.notify({
            icon: "notifications",
            message: message

        },{
            type: type[color],
            timer: 4000,
            placement: {
                from: from,
                align: align
            },
            template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
                '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
                '<i class="material-icons" data-notify="icon">notifications</i> ' +
                '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '</div>' +
                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                '</div>'
        });
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
