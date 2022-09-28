import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtileService} from "../../utile/utile.service";
import {ThemePalette} from "@angular/material/core";
import * as moment from "moment";
import {Workbook} from "exceljs";
import * as fs from 'file-saver';
import * as _ from 'lodash';
import {EtudiantService} from "../etudiant.service";

@Component({
  selector: 'app-charger-excel',
  templateUrl: './charger-excel.component.html',
  styleUrls: ['./charger-excel.component.css']
})
export class ChargerExcelComponent implements OnInit {
  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  fileUploadForm: FormGroup;
  fileInputLabel: string;
  multiple = false;
  accept = ".xlsx";
  color: ThemePalette = 'primary';
  maxSize = 1;
  type: any;
  file = File;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) public data,
              private formBuilder: FormBuilder,
              private utileService: UtileService,
              private etudiantService: EtudiantService) { }

  ngOnInit(): void {
    this.fileUploadForm = this.formBuilder.group({
      myfile: ['', Validators.required]
    });
  }
  onFileSelect(fileList: FileList) {
    let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const fil = this.fileUploadForm.get('myfile').value;
    this.file = this.fileUploadForm.get('myfile').value;
    // const target = event.target as HTMLInputElement;
    //const file: File = (target.files as FileList)[0];
    //console.log(fil);

    const formData = new FormData();
    formData.append('file', fil);

    //console.log(formData);

    if (fil.size > 0) {
      this.type = _.includes(af, fil.type);

      if (!this.type) {
        this.fileUploadForm.get('myfile').setValue(null);
        this.utileService.successAlert('Chargement des étudiants ', 'Le fichier doit être au format excel');

      } else {
        this.fileInputLabel = fil.name;
        this.fileUploadForm.get('myfile').setValue(fil);
      }
    }
  }

  exportExcel() {

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('etudiant');
    const columns = [];
    columns.push({ header: 'Prenom Etudiant', key: 'etudLastName' });
    columns.push({ header: 'Nom Etudiant', key: 'etudFirstName' });
    columns.push({ header: 'Code permanent', key: 'etudCP' });
    columns.push({ header: 'Courriel', key: 'etudAdresse' });
    worksheet.columns = columns;
    const rows = [];
    for (let i=0;i++,i<=20;){
      rows.push();
    }
    worksheet.addRows(rows, 'n');

    // formatage de l'en tête

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { wrapText: true, horizontal: 'center', vertical: 'middle'  };

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'modèleEtudiant '+ moment().format('MM/DD/YYYY HH:mm:ss') + '.xlsx');
    });

    this.utileService.successAlert('Exporter le fichier modèle', 'Opération effectuée avec succès');

  }

  onFormSubmit() {

    this.etudiantService.addEtudiantByFile(this.file)
      .subscribe(response => {
        let doublonValue=0;
        let errorValue=[];
        this.fileInputLabel = undefined;
       // console.log(response);
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
        this.utileService.successAlert('Chargement des étudiants par fichier excel', 'Chargement de ' + response.succes + ' étudiant(es) sur un total de ' + response.total + ' avec ' + doublonValue +
          ' doublon(s)');// et erreur sur le(s) code(s) permanent(s) '+errorValue);
        this.fileUploadForm.reset();
        // }
      }, error => {
        console.log(error);
      });

  }
}
