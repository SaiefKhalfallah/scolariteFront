import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Routes } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from './auth.service';
//import { TokenInterceptor } from './token.interceptor';
import { UserService } from './user.service';
import { BrowserModule } from '@angular/platform-browser';
import { TokenInterceptor } from './token.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [
    NgxDocViewerModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule, // Only import once
    HttpClientModule,
    ComponentsModule,
    MatMenuModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({ timeOut: 2000 , enableHtml: true }),

  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    RegisterComponent,
    LoginComponent,
  ],
  providers: [
    DatePipe,
    AuthService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
     useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
