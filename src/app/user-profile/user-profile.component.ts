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
  profile: any;
  showParentEmail: boolean = false;
  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initRegisterForm();
    this.route.params.subscribe(params => {
      const profileId = params['id'];
      if (profileId) {
        this.isEditing = true;
        this.loadProfile(profileId);
        this.userId = profileId;
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
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      password: ['', Validators.required],
      roles: ['', Validators.required],
      image: [''],
      parentEmail: ['', Validators.email]
    });
  }

  get firstname() {
    return this.updateProfileForm.get('firstname');
  }

  get lastname() {
    return this.updateProfileForm.get('lastname');
  }

  get datenaissance() {
    return this.updateProfileForm.get('datenaissance');
  }

  get sexe() {
    return this.updateProfileForm.get('sexe');
  }

  get email() {
    return this.updateProfileForm.get('email');
  }

  get phoneNumber() {
    return this.updateProfileForm.get('phoneNumber');
  }

  get password() {
    return this.updateProfileForm.get('password');
  }

  get roles() {
    return this.updateProfileForm.get('roles');
  }
  get parentEmail() {
    return this.updateProfileForm.get('parentEmail');
  }

  loadProfile(profileId: number): void {
    this.userService.getUserProfile(profileId).subscribe(
      (profile: any) => {
        const formattedDate = this.datePipe.transform(profile.datenaissance, 'yyyy-MM-dd');
        this.profile = profile;
        this.updateProfileForm.patchValue({
          firstname: profile.nom,
          lastname: profile.prenom,
          datenaissance: formattedDate,
          sexe: profile.sexe,
          email: profile.email,
          phoneNumber: profile.telephone,
          roles: profile.roles,
          image: profile.image,
          parentEmail: profile.parentEmail
        });
      },
      error => {
        console.error('Error loading profile:', error);
      }
    );
  }
onRoleChange(role: string): void {
    this.showParentEmail = role === 'ETUDIANT';

    // Réinitialisez le champ parentEmail si le rôle change et n'est pas ÉTUDIANT.
    if (!this.showParentEmail) {
      this.updateProfileForm.get('parentEmail')?.reset();
    }
  }
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.updateProfileForm.patchValue({ image: file });
    }
  }

  submitForm(): void {
    if (this.updateProfileForm.valid) {
      const formData = new FormData();
      Object.keys(this.updateProfileForm.value).forEach(key => {
        formData.append(key, this.updateProfileForm.value[key]);
      });

      const apiCall = this.isEditing
        ? this.userService.updateUserProfile(this.userId, formData)
        : this.http.post('http://localhost:8089/api/v1/auth/register', formData);

      apiCall.subscribe(
        (response) => {
          this.toastr.success('Utilisateur ajouté/modifié avec succès');
          this.updateProfileForm.reset();
        },
        (error) => {
          this.toastr.error('Erreur lors de l\'ajout/modification');
        }
      );
    } else {
      this.toastr.error('Veuillez remplir tous les champs requis');
    }
  }
}
