import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {SessionService} from "../../session/session.service";
import {UtileService} from "../../utile/utile.service";
import {Validator} from "../../utile/validator";
import {ResourceService} from "../../resource/resource.service";

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.css']
})
export class AddResourceComponent implements OnInit,AfterViewInit {
  addRessourceForm: FormGroup;
  sessions: any;
  message: any;
  regions: any;
  types: any;
  isShown: boolean = false ;
  constructor(@Inject(MAT_DIALOG_DATA) public data,
              private formBuilder: FormBuilder,
              private sessionService: SessionService,
              private utileService: UtileService,
              private validator: Validator,
              private ressourceService: ResourceService) { }

  ngOnInit(): void {
    this.addRessourceForm = this.formBuilder.group({
      id: [],
      ressDesc: ['', [Validators.required]],
      ressSession: [''],
      ressUrl: ['', [Validators.required]],
      ressType: ['', [Validators.required]],
      ressRegion: [''],
      ressLieu: [''],
      ressVille: [''],
      ressCodeP: ['']

    });
    this.getAllRegion();
    this.getAllType();
    this.getAllSession();

    if (this.data.ressource !== undefined){
     // console.log(this.data.ressource)
      // tslint:disable-next-line:max-line-length
      // this.data.session.sessNom = this.data.session.sessNom.substr(0, (this.data.session.sessNom.search(this.data.session.sessYear)) - 1);
      // console.log(this.data.session.sessNom);
      this.addRessourceForm.patchValue(
        {  id: this.data.ressource.id ,
          ressDesc: this.data.ressource.ressDesc,
          ressSession: this.data.ressource.ressSession.id,
          ressUrl: this.data.ressource.ressUrl,
          ressType: this.data.ressource.ressType.id,
        } );

      if(this.data.ressource.ressRegion!== null)
      {
        this.isShown=true;
        this.addRessourceForm.get('ressRegion').patchValue(this.data.ressource.ressRegion.id);
        this.addRessourceForm.get('ressLieu').patchValue(this.data.ressource.ressLieu);
        this.addRessourceForm.get('ressVille').patchValue(this.data.ressource.ressVille);
        this.addRessourceForm.get('ressCodeP').patchValue(this.data.ressource.ressCodeP);

      }
    }

  }
  ngAfterViewInit() {

  }

  toggleShow(event: any) {
    if(event.source.triggerValue=='Lieux')
    {
      this.isShown = ! this.isShown;

    }
    else
    {
      this.isShown = false;
      this.addRessourceForm.get('ressRegion').setValidators(null);
      this.addRessourceForm.get('ressLieu').setValidators(null);
      this.addRessourceForm.get('ressVille').setValidators(null);
      this.addRessourceForm.get('ressCodeP').setValidators(null);

    }
    //

  }

  addRessource() {
    if((this.addRessourceForm.get('ressSession').value == '') || (this.addRessourceForm.get('ressSession').value == 'indefined'))
    {
      //console.log(this.sessions[0].id);
     /* this.addRessourceForm.patchValue(
        {  ressSession: this.sessions[0].id });*/
//Session insdipensable à la ressource mais pas que ça s'affiche
      this.addRessourceForm.patchValue(
        {  ressSession: 1})

    }
    this.ressourceService.addRessource(this.addRessourceForm.value)
      .subscribe(rep=>{
          // console.log(rep);
          this.utileService.successAlert('Ajouter/Modifier une ressource', 'Opération effectuée avec succès');
          this.addRessourceForm.reset();
          this.message='';
        },
        err => {
          console.log(err)
          this.utileService.errorAlert('Ajouter/Modifier une ressource',err.error);
        });


  }

  getAllRegion()
  {
    this.ressourceService.getAllRegion()
      .subscribe(response => {
        //console.log(response);
      this.regions=response;
        // this.activities=response;
      }, error => {
        console.log(error);
      })

  }

  getAllType()
  {
    this.ressourceService.getAllType()
      .subscribe(response => {
       // console.log(response);
        this.types=response;
        // this.activities=response;
      }, error => {
        console.log(error);
      })

  }


  getAllSession()
  {
    this.sessionService.getSessionOrderByStartDate()
      .subscribe(response => {
        //console.log(response[0]);
        this.sessions=response;
        // this.activities=response;
      }, error => {
        console.log(error);
      })

  }



  get ressDesc() {
    return this.addRessourceForm.get('ressDesc');
  }

  get ressSession() {
    return this.addRessourceForm.get('ressSession');
  }

  get ressUrl() {
    return this.addRessourceForm.get('ressDesc');
  }
  get ressType() {
    return this.addRessourceForm.get('ressType');
  }
  get ressRegion() {
    return this.addRessourceForm.get('ressRegion');
  }
  get ressLieu() {
    return this.addRessourceForm.get('ressLieu');
  }
  get ressVille() {
    return this.addRessourceForm.get('ressVille');
  }
  get ressCodeP() {
    return this.addRessourceForm.get('ressCodeP');
  }





}
