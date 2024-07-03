import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import {UserService} from "../user.service";
import {Router} from "@angular/router";
import { SanctionService } from 'app/service/sanction.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-profile',
  templateUrl: './listprofiles.component.html',
  styleUrls: ['./listprofiles.component.css']
})
export class ListprofilesComponent implements OnInit {
    profiles:any;
    filteredProfiles: any[] = [];
    currentUser:any;
    descriptionAvert:any;
    showAvertissement: { [key: number]: boolean } = {};
    avertissementText: { [key: number]: string } = {};
    avertissementType: any;
    searchQuery: string = '';


  constructor(private userService: UserService,private sanctionService: SanctionService   , private router: Router,        private toastr: ToastrService
) { } // Inject UserService

  ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('user'));
        
      this.displayprofiles();

    // Call getUsers() method

  }
  searchProfiles(event: Event) {
    event.preventDefault();
    const query = this.searchQuery.toLowerCase();
    this.filteredProfiles = this.profiles.filter(profile => {
        const fullName = `${profile.nom.toLowerCase()} ${profile.prenom.toLowerCase()}`;
        return fullName.includes(query);
    });
}
  toggleAvertissement(id_personne: number): void {
    this.showAvertissement[id_personne] = !this.showAvertissement[id_personne];
}
onChange(ev:any){
this.avertissementType=ev;
}
    displayprofiles() {
        
        this.userService.getUsers().subscribe(
            (response) => {
                console.log(response); // Log the response to console
                if (Array.isArray(response)) {
                    console.log("admin",this.currentUser)

                    // If response is an array, exclude the first element
                    if (this.currentUser.roles=="ADMINISTRATEUR"){
                        this.profiles = response.slice(1);
                        console.log("admin")

                    }
                    if(this.currentUser.roles=="ENSEIGNANT"){
                        console.log("ens")

                        this.profiles=response.filter(profile => {
                            return profile.nomclasse === this.currentUser.nomclasse && profile.roles === "ETUDIANT";
                        });
                    }
                    this.filteredProfiles = this.profiles;

                } else {
                    console.error('Response is not an array');
                }
            },
            (error) => {
                console.error('Error:', error); // Log any errors to console
            }
        );
    }


    getImageUrl(image: any): string {
        if (image) {
            return 'data:image/*;base64,' + image; // Adjust this based on how your image data is stored
        } else {
            return ''; // Or provide a default image URL if the image is not available
        }
    }
    AvertPerson(id_personne:any){
        const avertissement = this.avertissementText[id_personne];
        const avertType = this.avertissementType;

        const obj=
            {
                "id_eleve": id_personne,
                "id_enseignant": this.currentUser.id_personne,
                "type": avertType,
                "description": avertissement
              }

              console.log('aa',obj)

              this.sanctionService.addSaction(obj).subscribe(
                (response) => {
                    console.log(response); // Log the response to console
                
                    this.toastr.success("Eleve averti")
                    this.toggleAvertissement(id_personne);
                },
                (error) => {
                    console.error('Error:', error); // Log any errors to console
                    this.toastr.error("Probléme rencontré")

                }
            );
        }
    AbsencePerson(id_personne:any){

    }

    deletePerson(id: number): void {
        this.userService.deletePerson(id).subscribe(
            () => {
                console.log(`Person with id ${id} deleted successfully`);
                this.displayprofiles();
                // Optionally, refresh the list or handle the UI update here
            },
            error => {
                console.error('Error deleting person', error);
            }
        );
    }
    deactivatePerson(id: number,actif:number): void {
        this.userService.deactivatePerson(id,actif).subscribe(
            () => {
                console.log(`Person with id ${id} deleted successfully`);
                this.displayprofiles();
                // Optionally, refresh the list or handle the UI update here
            },
            error => {
                console.error('Error deleting person', error);
            }
        );
    }

    editProfile(profile: any): void {
        // Navigate to UserProfileComponent and pass the profile data
        this.router.navigate(['/user-profile', profile.id_personne]); // Adjust the route and parameter as per your routing configuration
    }
    // Method to get image src

}


