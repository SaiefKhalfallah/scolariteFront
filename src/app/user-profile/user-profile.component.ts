import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {Personne} from "../models/personne.model";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  updateProfileForm: FormGroup;
  userId: number | null = null;
  isEditing: boolean = false;
  profile:any;

  constructor(
      private datePipe: DatePipe,
      private fb: FormBuilder,
      private userService: UserService,
      private formBuilder: FormBuilder,
      private http: HttpClient,
      private router: Router,
      private route: ActivatedRoute, // Inject ActivatedRoute for route parameters
      private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initRegisterForm();
    this.route.params.subscribe(params => {
      const profileId = params['id'];
      if (profileId) {
        this.isEditing = true; // Set editing flag to true if profileId is provided
        this.loadProfile(profileId);
        this.userId=profileId;
      }
    });
  }

  initRegisterForm() {
    this.updateProfileForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      datenaissance: ['', Validators.required],
      sexe: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      roles: ['', Validators.required],
      image: ['']
    });
  }
  loadProfile(profileId: number): void {
    this.userService.getUserProfile(profileId).subscribe(
        (profile: any) => {
          console.log(profile)
          const formattedDate = this.datePipe.transform(profile.datenaissance, 'yyyy-MM-dd');

          this.profile = profile;
          // Populate form fields with profile data
          this.updateProfileForm.patchValue({
            firstname: profile.nom,
            lastname: profile.prenom,
            datenaissance: formattedDate,
            sexe: profile.sexe,
            email: profile.email,
            phoneNumber: profile.telephone,
            roles: profile.roles,
            image: profile.image
          });
        },
        error => {
          console.error('Error loading profile:', error);
        }
    );
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.updateProfileForm.patchValue({
        image: file
      });
    }
  }

  submitForm(): void {
    if (this.isEditing){
      if (this.updateProfileForm.valid) {
        const formData = new FormData();
        Object.keys(this.updateProfileForm.value).forEach(key => {
          formData.append(key, this.updateProfileForm.value[key]);
        });

        this.userService.updateUserProfile(this.userId,formData)
            .subscribe(
                (response) => {
                  console.log('Registration successful:', response);
                  this.toastr.success('Utilisateur ajouté avec succès');
                  this.updateProfileForm.reset();
                },
                (error) => {
                  console.error('Registration failed:', error);
                  this.toastr.error('Utilisateur non trouvé');
                }
            );
      } else {
        this.toastr.error('Veuillez remplir tous les champs requis');
      }
    }else{
      if (this.updateProfileForm.valid) {
        const formData = new FormData();
        Object.keys(this.updateProfileForm.value).forEach(key => {
          formData.append(key, this.updateProfileForm.value[key]);
        });

        this.http.post('http://localhost:8089/api/v1/auth/register', formData)
            .subscribe(
                (response) => {
                  console.log('Registration successful:', response);
                  this.toastr.success('Utilisateur ajouté avec succès');
                  this.updateProfileForm.reset();
                },
                (error) => {
                  console.error('Registration failed:', error);
                  this.toastr.error('Utilisateur non trouvé');
                }
            );
      } else {
        this.toastr.error('Veuillez remplir tous les champs requis');
      }
    }

  }
}
