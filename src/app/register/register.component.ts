import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router 
  ) { }

  ngOnInit(): void {
    this.initRegisterForm();
  }

  initRegisterForm() {
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      datenaissance: ['', Validators.required], // Changed to lowercase datenaissance
      sexe: ['', Validators.required], // Changed to lowercase sexe
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  reg() {
    if (this.registerForm.valid) {
      console.log('Form data:', this.registerForm.value);
      
      // Extracting datenaissance and sexe fields
      const datenaissance = new Date(this.registerForm.get('datenaissance').value); // Changed to lowercase datenaissance
      const sexe = this.registerForm.get('sexe').value; // Changed to lowercase sexe

      console.log('Datenaissance:', datenaissance);
      console.log('Sexe:', sexe);

      const formData = {
        ...this.registerForm.value,
        datenaissance: datenaissance, // Changed to lowercase datenaissance
        sexe: sexe // Changed to lowercase sexe
      };
      
      // Logging formData before sending the POST request
      console.log('formData:', formData);

      this.http.post('http://localhost:8089/api/v1/auth/register', formData)
        .subscribe(
          (response) => {
            console.log('Registration successful:', response);
            this.showNotification('bottom','right','success');
            this.router.navigate(['/login']);
          },
          (error) => {
            console.error('Registration failed:', error);
          }
        );
    } else {
      console.log('Form is invalid');
      this.showNotification('bottom','right','danger');

    }
  }
  showNotification(from, align,typetaken){
    const type = typetaken;

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: "Welcome to <b>Material Dashboard</b> - a beautiful freebie for every web developer."

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
}
