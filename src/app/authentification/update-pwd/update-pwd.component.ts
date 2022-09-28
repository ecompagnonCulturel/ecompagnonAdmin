import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Validator} from "../../utile/validator";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {AuthentificationService} from "../authentification.service";
import {UtileService} from "../../utile/utile.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-update-pwd',
  templateUrl: './update-pwd.component.html',
  styleUrls: ['./update-pwd.component.css']
})
export class UpdatePwdComponent implements OnInit {
  updatePasswordForm: FormGroup;
  oldPasswordType: string = 'password';
  oldPassswordIsShown: boolean = false;
  passwordType: string = 'password';
  passswordIsShown: boolean = false;
  cpasswordType: string = 'password';
  cpassswordIsShown: boolean = false;
  constructor( private fb: FormBuilder,
               private validator: Validator,
               @Inject(MAT_DIALOG_DATA) public data,
               private authService: AuthentificationService,
               private utileService: UtileService,
               private router: Router) { }

  ngOnInit(): void {

    this.updatePasswordForm = this.fb.group({
      mailUsers: [this.data.user.mailUsers],
      oldPasswordAUsers: ['', [Validators.required]],
      passwordAUsers: ['', [Validators.required]],
      confirmpasswordAUsers: ['', [Validators.required]],

    },
      {validator: Validator.mustMatch('passwordAUsers', 'confirmpasswordAUsers')}
    );
  }

  updateCurrentUser() {
    this.authService.logOut();
    document.getElementById("close").click();
    this.router.navigateByUrl('connexion').then(e => {});

  }

  sendUpadate(user) {
    this.authService.updateUserPwd(user)
      .subscribe(user => {
          // this.authenticService.loadToken();
          this.utileService.successAlert('Modifier Mot de passe', 'Opération effectuée avec succès');
          this.updateCurrentUser();

        },
        err => {
          this.utileService.errorAlert("Modifier votre mot de passe",err.error);

        });


  }

  async update() {
    let sendUser: any;
    sendUser = {
      mailUsers:this.updatePasswordForm.get('mailUsers').value,
      passwordUsers: this.updatePasswordForm.get('passwordAUsers').value,
      oldPasswordAUsers: this.updatePasswordForm.get('oldPasswordAUsers').value,

    };
    //console.log(sendUser);
    this.sendUpadate(sendUser);

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

  cPasswordVisible() {
    if (this.cpassswordIsShown) {
      this.cpassswordIsShown = false;
      this.cpasswordType = 'password';
    } else {
      this.cpassswordIsShown = true;
      this.cpasswordType = 'text';

    }

  }

  oldPasswordVisible() {
    if (this.oldPassswordIsShown) {
      this.oldPassswordIsShown = false;
      this.oldPasswordType = 'password';
    } else {
      this.oldPassswordIsShown = true;
      this.oldPasswordType = 'text';

    }

  }

  get oldPasswordAUsers() {
    return this.updatePasswordForm.get('oldPasswordAUsers');
  }

  get passwordAUsers() {
    return this.updatePasswordForm.get('passwordAUsers');
  }

  get confirmpasswordAUsers() {
    return this.updatePasswordForm.get('confirmpasswordAUsers');
  }


}
