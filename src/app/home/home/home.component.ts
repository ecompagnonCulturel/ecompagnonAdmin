import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TokenStorageServiceService} from "../../authentification/token-storage-service.service";
import {AuthentificationService} from "../../authentification/authentification.service";
import Swal from "sweetalert2";
import {UpdatePwdComponent} from "../../authentification/update-pwd/update-pwd.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = 'Ecompagnon Culturel';
  version:any;
  navLinks: any[];
  activeLinkIndex = -1;
  user: any;

  constructor (private router: Router,
               private tokenStorage: TokenStorageServiceService,
               private authService: AuthentificationService,
               private dialog: MatDialog){
    this.navLinks = [

      {
        label: 'Cours',
        link: 'list-cours',
        index: 1
      },
      {
        label: 'Etudiants',
        link: 'list-etudiant',
        index: 2
      },
      {
        label: 'Exportation des Données',
        link: 'export',
        index: 3
      },
      {
        label: 'Formateurs',
        link: 'list-formateur',
        index: 4
      },
      {
        label: 'Groupes-test',
        link: 'list-etudGroup',
        index: 5
      },
      {
        label: 'Intention',
        link: 'list-intension',
        index: 6
      } ,
      {
        label: 'Post-test',
        link: 'list-activity',
        index: 0
      },
      {
        label: 'Questionnaires',
        link: 'list-questionnaire',
        index: 8
      },
      {
        label: 'Ressources',
        link: 'list-resource',
        index: 9
      },
      {
        label: 'Sessions',
        link: 'list-session',
        index: 10
      },
      {
        label: 'Utilisateurs',
        link: 'list-users',
        index: 11
      }
    ];
  }

  ngOnInit(): void {

    // this.router.navigate(['version/list-version']);
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });

    this.user=this.tokenStorage.getUser();

  }
  async logout() {
    await Swal.fire({
      // title: 'Are you sure?',
      text: 'Voulez- vous  vraiment vous déconnecter?',
      // icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'OK',
      reverseButtons: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      confirmButtonColor: '#3DC2FF',
      cancelButtonColor: '#d33',
    }).then((result) => {

      if (result.isConfirmed) {
        this.authService.logOut();
        this.router.navigateByUrl('connexion').then(e => {});
       // this.router.navigateByUrl('/connexion',{replaceUrl: true});

      } else if (result.isDismissed) {

        console.log('Clicked No, File is safe!');

      }
    });

  }

  editDialog(user) {
    const dialogRef = this.dialog.open(UpdatePwdComponent, {
      width: '35%',
      data: {user,titre: 'Modifier  le mot de passe admin'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
}
