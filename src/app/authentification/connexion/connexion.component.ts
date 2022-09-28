import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthentificationService} from "../authentification.service";
import {TokenStorageServiceService} from "../token-storage-service.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtileService} from "../../utile/utile.service";
import {BehaviorSubject} from "rxjs";
import {AddActivityComponent} from "../../activity/add-activity/add-activity.component";
import {MatDialog} from "@angular/material/dialog";
import {UpdatePwdComponent} from "../update-pwd/update-pwd.component";

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {
  loginForm: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  passwordType: string = 'password';
  passswordIsShown: boolean = false;

  constructor(private authService: AuthentificationService,
              private tokenStorage: TokenStorageServiceService,
              private router:Router,
              private formBuilder: FormBuilder,
              private utileServie: UtileService,
             ) { }
  ngOnInit(): void {

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
    this.loginForm = this.formBuilder.group({
      mailUsers: ['', Validators.required],
      passwordUsers: ['', Validators.required]
    });

    console.log(this.tokenStorage.isAuthenticated.value);
    console.log(this.tokenStorage.getUser());

  }
  login(): void {
    this.authService.login(this.loginForm.value).subscribe(
      data => {
       // console.log(data);
        this.tokenStorage.saveToken('USERFOUND');
       // console.log(data.token);
        this.tokenStorage.saveUser(data);
        this.tokenStorage.isAuthenticated.next(true);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.home();
      //  console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;

        this.utileServie.errorAlert('Connexion','ce compte n\'existe pas encore');
      }
    );
  }
  reloadPage(): void {
    window.location.reload();
  }
  home()
  {
    this.router.navigateByUrl('/home',{replaceUrl: true});
  }

  PasswordVisible() {
    if (this.passswordIsShown) {
      this.passswordIsShown = false;
      this.passwordType = 'password';
    } else {
      this.passswordIsShown = true;
      this.passwordType = 'text';

    }

  }


  get mailUsers() {
    return this.loginForm.get('mailUsers');
  }

  get passwordUsers() {
    return this.loginForm.get('passwordUsers');
  }



}
