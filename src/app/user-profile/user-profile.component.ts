import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Personne } from '../models/personne.model';
import { AuthService } from '../auth.service';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
declare var $: any;

@Component({
  selector: 'app-update-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  updateProfileForm: FormGroup;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr:ToastrService
  ) {


  }
  initRegisterForm() {
    this.updateProfileForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      datenaissance: ['', Validators.required], // Changed to lowercase datenaissance
      sexe: ['', Validators.required], // Changed to lowercase sexe
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      roles: ['', Validators.required],
      image: ['', Validators.required],

    });
  }

  ngOnInit(): void {
    this.initRegisterForm();
    /*if (this.authService.isLoggedIn()) {
      this.userId = this.authService.getUserIdFromStorage();
      if (this.userId !== null) {
        this.loadUserProfile();
      } else {
        this.authService.fetchCurrentUserId().subscribe(
          (userId: number) => {
            this.userId = userId;
            this.loadUserProfile();
          },
          (error) => {
            console.error('Error fetching current user ID:', error);
          }
        );
      }
    } else {
      console.error('User not authenticated.');
    }*/
  }
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      console.log(event.target.files[0]);
      const file = event.target.files[0];
      this.updateProfileForm.patchValue({
        image: file
      });
    }
  }
  reg() {

    if (this.updateProfileForm.valid) {
      const formData = new FormData();
      Object.keys(this.updateProfileForm.value).forEach(key => {
        formData.append(key, this.updateProfileForm.value[key]);
      });

      console.log(this.updateProfileForm.value);

      this.http.post('http://localhost:8089/api/v1/auth/register', formData)
          .subscribe(
              (response) => {
                console.log('Registration successful:', response);
                this.toastr.success('user added successfully')
                this.updateProfileForm.reset();
              },
              (error) => {
                console.error('Registration failed:', error);
                this.toastr.error('cannot add user')
              }
          );
    } else {
      console.log('Form is invalid');
      this.toastr.error('image is large')
    }
  }


}
