import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import * as moment from "moment";
import {config, Workbook} from "exceljs";
import * as fs from 'file-saver';
import {UtileService} from "../../utile/utile.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ThemePalette} from "@angular/material/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {SessionService} from "../../session/session.service";
import {ResourceService} from "../resource.service";
import * as _ from 'lodash';

@Component({
  selector: 'app-charger-excel',
  templateUrl: './charger-excel-resource.component.html',
  styleUrls: ['./charger-excel-resource.component.css']
})
export class ChargerExcelResourceComponent implements OnInit {
  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  fileUploadForm: FormGroup;
  fileInputLabel: string;
  multiple = false;
  accept = ".xlsx";
  color: ThemePalette = 'primary';
  maxSize = 1;
  file = File;
  sessions: any;
  types: any;
  regions: any;
  typeFile: any;

  name = 'Angular';
  list = [];
  header = [];


  constructor(private utileService: UtileService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) public data,
              private formBuilder: FormBuilder,
              private sessionService: SessionService,
              private resourceService: ResourceService
              ) { }

  ngOnInit(): void {

    this.fileUploadForm = this.formBuilder.group({
      myfile: ['', Validators.required],
     session: ['']
    });

    this.getAllSession();
    this.getAllRegion();
    this.getAllType();

  }


  exportExcel() {

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('ressource');
    let worksheetType = workbook.addWorksheet('listeType');
    let worksheetRegion = workbook.addWorksheet('listeRegion');

    /* add region and type them worksheet*/
    this.types.forEach((value)=>{
       // console.log(value);
      worksheetType.addRow([value.id,value.nom]);

      }
    )

    this.regions.forEach((value)=>{
        //console.log(value);
      worksheetRegion.addRow([value.id,value.nom]);

      }
    )

    const columns = [];
    let typedropdownlist = "\""+this.types.join(',')+"\"";

    //console.log(typedropdownlist);
    columns.push({ header: 'Nom', key: 'ressDesc' });
    columns.push({ header: 'Url', key: 'ressUrl' });
    columns.push({ header: 'Type', key: 'ressType' });
    columns.push({ header: 'Region', key: 'ressRegion' });
    columns.push({ header: 'Ville', key: 'ressVille' });
    columns.push({ header: 'Adresse', key: 'ressLieu' });
    columns.push({ header: 'Code Postal', key: 'ressCodeP' });
    worksheet.columns = columns;

//add listeType and listeRegion to first worksheet, nomber of expected row
    for (let i=1;i<40;i++) {
      worksheet.getCell('C' + i).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['listeType!A1:A'+this.types.length], // reference your worksheet and your list start and end
        showErrorMessage: true,
        errorStyle: 'error',
        errorTitle: 'Error',
        error: 'Value must be from the list',
      };

      worksheet.getCell('D' + i).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['listeRegion!A1:A'+this.regions.length], // reference your worksheet and your list start and end
        showErrorMessage: true,
        errorStyle: 'error',
        errorTitle: 'Error',
        error: 'Value must be from the list',
      };

    };


    // formatage de l'en tête

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { wrapText: true, horizontal: 'center', vertical: 'middle'  };


 workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'modèleRessource '+ moment().format('MM/DD/YYYY HH:mm:ss') + '.xlsx');
    });


    this.utileService.successAlert('Exporter le fichier modèle', 'Opération effectuée avec succès');

  }




  onFileSelect(fileList: FileList) {
    let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const fil = this.fileUploadForm.get('myfile').value;
    this.file = this.fileUploadForm.get('myfile').value;
    // const target = event.target as HTMLInputElement;
    //const file: File = (target.files as FileList)[0];
   // console.log(fil);

    const formData = new FormData();
    formData.append('file', fil);

    //console.log(formData);

    if (fil.size > 0) {
      this.typeFile = _.includes(af, fil.type);

      if (!this.typeFile) {
        this.fileUploadForm.get('myfile').setValue(null);
        this.utileService.successAlert('Chargement des ressources ', 'Le fichier doit être au format excel');

      } else {
        this.fileInputLabel = fil.name;
        this.fileUploadForm.get('myfile').setValue(fil);
      }
    }

  }

  onFormSubmit() {

    if((this.fileUploadForm.get('session').value == '') || (this.fileUploadForm.get('ressSession').value == 'indefined'))
    {
      //console.log(this.sessions[0].id);
     /* this..patchValue(
        {  session: this.sessions[0].id });*/
   //Session insdipensable à la ressource mais pas que ça s'affiche
      this.fileUploadForm.patchValue(
        {  session: 1})

    }
   // console.log(this.fileUploadForm.get('session').value)
    this.resourceService.addResourceByFile(this.file,this.fileUploadForm.get('session').value)
      .subscribe(response => {
        let doublonValue=0;
        let errorValue=[];
        this.fileInputLabel = undefined;
        //console.log(response);
        if(response.doublon == null)
        {

        }
        else {
          doublonValue= response.doublon;

        }
        if(response.errors == null)
        {

        }
        else {
          doublonValue= response.doublon;

        }
        if((response.succes==0) && (doublonValue==0))
        {
          this.utileService.errorAlert('Chargement des Ressources par fichier excel', 'Le fichier est vide ' +
            'ou le format des cellules n\'est pas respecté  ');// et erreur sur le(s) code(s) permanent(s) '+errorValue);

        }
        else {
          this.utileService.successAlert('Chargement des Ressources par fichier excel', 'Chargement de ' + response.succes + ' ressources sur un total de ' + response.total + ' avec ' + doublonValue +
            ' doublon(s)');// et erreur sur le(s) code(s) permanent(s) '+errorValue);
          this.fileUploadForm.reset();
          // }
        }

      }, error => {
        console.log(error);
      });


  }

  getAllSession()
  {
    this.sessionService.getAllSession()
      .subscribe(response => {
        // console.log(response);
        this.sessions=response
          .sort((a, b) => (a.sessStart > b.sessStart? -1 : 1));
        // this.activities=response;
      }, error => {
        console.log(error);
      })

  }

  getAllType()
  {
    this.resourceService.getAllType()
      .subscribe(response => {
        // console.log(response);
       this.types=response
         .sort((a, b) => (a.id < b.id? -1 : 1))
         .map(value=>{
         let typeRewrite={id: value.id,
                          nom: value.trdesc}
         return typeRewrite;
       });
      //  console.log( this.types);
        // this.activities=response;
      }, error => {
        console.log(error);
      })

  }

  getAllRegion()
  {
    this.resourceService.getAllRegion()
      .subscribe(response => {
        //console.log(response);

        this.regions=response
          .sort((a, b) => (a.id < b.id? -1 : 1))
          .map(value=>{
          let regionRewrite={id: value.id,
            nom: value.regNom}
          return regionRewrite;
        });


        // this.activities=response;
      }, error => {
        console.log(error);
      })

  }
  get session()
  {
    return this.fileUploadForm.get('session');
  }


}
