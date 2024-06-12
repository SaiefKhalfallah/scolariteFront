import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import {UserService} from "../user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-list-profile',
  templateUrl: './listprofiles.component.html',
  styleUrls: ['./listprofiles.component.css']
})
export class ListprofilesComponent implements OnInit {
    profiles:any;

  constructor(private userService: UserService   , private router: Router
) { } // Inject UserService

  ngOnInit() {
      this.displayprofiles();
    // Call getUsers() method

  }
    displayprofiles() {
        this.userService.getUsers().subscribe(
            (response) => {
                console.log(response); // Log the response to console
                if (Array.isArray(response)) {
                    // If response is an array, exclude the first element
                    this.profiles = response.slice(1);
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


