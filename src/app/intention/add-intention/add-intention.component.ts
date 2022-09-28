import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {SessionService} from "../../session/session.service";
import {UtileService} from "../../utile/utile.service";
import {Validator} from "../../utile/validator";
import {FormateurService} from "../../formateur/formateur.service";
import {CoursService} from "../../cours/cours.service";
import {ResourceService} from "../../resource/resource.service";
import {IntensionService} from "../intension.service";

@Component({
  selector: 'app-add-intention',
  templateUrl: './add-intention.component.html',
  styleUrls: ['./add-intention.component.css']
})
export class AddIntentionComponent implements OnInit {
  addIntentionForm: FormGroup;
  sessions: any;
  sessionsFilter: any;
  profs: any;
  profsFilter: any;
  resources: any;
  resourcesFilter: any;
  cours: any;
  coursFilter: any;
  message: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              private formBuilder: FormBuilder,
              private sessionService: SessionService,
              private utileService: UtileService,
              private validator: Validator,
              private formateurService: FormateurService,
              private coursSrevice: CoursService,
              private resourceService: ResourceService,
              private intentionService: IntensionService) { }

  ngOnInit(): void {

    this.addIntentionForm = this.formBuilder.group({
      id: [],
      coursResIntention: ['', [Validators.required]],
      coursResResource: ['', [Validators.required]],
      coursResSession: ['', [Validators.required]],
      coursResProf: ['',[Validators.required]],
      coursResCours: ['',[Validators.required]],
      coursResStatus: [1],
    });

    this.getAllCours();
    this.getAllFormateur();
    this.getAllSession();
    this.getAllResources();

    if (this.data.intention !== undefined){
      this.addIntentionForm.patchValue(
        { id: this.data.intention.id ,
          coursResIntention: this.data.intention.coursResIntention,
          coursResResource : this.data.intention.coursResResource.id,
          coursResSession : this.data.intention.coursResSession.id,
          coursResProf : this.data.intention.coursResProf.id,
          coursResCours : this.data.intention.coursResCours.id,
          coursResStatus : this.data.intention.coursResStatus,

        } );
    }

  }

  addIntention() {
    // console.log(this.addStudentForm.value);
    this.intentionService.addIntension(this.addIntentionForm.value)
      .subscribe(rep=>{
          // console.log(rep);
          this.utileService.successAlert('Ajouter/Modifier une intention de cours', 'Opération effectuée avec succès');
          this.addIntentionForm.reset();
        },
        err => {
          console.log(err)
          this.utileService.errorAlert('Ajouter/Modifier une intention de cours',err.error);
        });


  }

  getAllSession()
  {
    this.sessionService.getSessionOrderByStartDate()
      .subscribe(response => {
        //console.log(response);
        this.sessions=response;
        this.sessionsFilter=response;
        // this.activities=response;
      }, error => {
        console.log(error);
      })

  }

  getAllResources()
  {
    this.resourceService.getAllResources()
      .subscribe(response => {
       // console.log(response);
        this.resources=response.sort((a, b)=>{
          return (a.ressDesc>b.ressDesc? 1 : -1);
        });
        this.resourcesFilter=response.sort((a, b)=>{
          return (a.ressDesc>b.ressDesc? 1 : -1);
        });
        // this.activities=response;
      }, error => {
        console.log(error);
      })

  }

  getAllCours()
  {
    this.coursSrevice.getAllCours()
      .subscribe(response => {
        //console.log(response);
        this.cours=response.sort((a, b)=>{
          return (a.coursDes>b.coursDes? 1 : -1);
        });
        this.coursFilter=response.sort((a, b)=>{
          return (a.coursDes>b.coursDes? 1 : -1);
        });
        // this.activities=response;
      }, error => {
        console.log(error);
      })

  }

  getAllFormateur()
  {
    this.formateurService.getAllProf()
      .subscribe(response => {
        //console.log(response);
        this.profs=response.sort((a, b)=>{
          return (a.profFirstName>b.profFirstName? 1 : -1);
        });

        this.profsFilter=response.sort((a, b)=>{
          return (a.profFirstName>b.profFirstName? 1 : -1);
        });
        // this.activities=response;
      }, error => {
        console.log(error);
      })

  }

  get coursResIntention() {
    return this.addIntentionForm.get('coursResIntention');
  }

  get coursResResource(){
    return this.addIntentionForm.get('coursResResource');
  }

  get coursResSession(){
    return this.addIntentionForm.get('coursResSession');
  }

  get coursResProf() {
    return this.addIntentionForm.get('coursResProf');
  }

  get coursResCours(){
    return this.addIntentionForm.get('coursResCours');
  }
  onKeySession(value) {
    //console.log(value);
    this.sessionsFilter = this.searchSession(value);
  }
  onKeyResource(value) {
    //console.log(value);
    this.resourcesFilter = this.searchResource(value);
  }
  onKeyProf(value) {
    //console.log(value);
    this.profsFilter = this.searchProf(value);
  }

  onKeyCours(value) {
    //console.log(value);
    this.coursFilter = this.searchCours(value);
  }

  searchSession(value: string) {
    let filter = value.toLowerCase();
    return this.sessions
      .filter(option => option.length <=2
        || (this.utileService.removeDiacritics( (option.sessNom).toLowerCase())
            .includes(filter))

      );
  }

  searchResource(value: string) {
    let filter = value.toLowerCase();
     console.log(filter);
    return this.resources
      .filter(option => option.length <=2
      || (this.utileService.removeDiacritics( (option.ressDesc).toLowerCase())
            .includes(filter))

    );
  }

  searchProf(value: string) {
    let filter = value.toLowerCase();
   // console.log(filter);
    return this.profs
      .filter(option => option.length <=2
        || ((this.utileService.removeDiacritics( (option.profFirstName).toLowerCase())
            .startsWith(filter))
          ||
          (this.utileService.removeDiacritics( (option.profLastName).toLowerCase())
            .startsWith(filter)))

      );
  }

  searchCours(value: string) {
    let filter = value.toLowerCase();
    console.log(filter);
    return this.cours
      .filter(option => option.length <=2
        || (this.utileService.removeDiacritics( (option.coursDes).toLowerCase())
            .includes(filter))
      );
  }
}
