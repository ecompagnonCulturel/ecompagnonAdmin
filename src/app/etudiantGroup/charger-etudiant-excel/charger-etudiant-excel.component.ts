import { Component, OnInit, ViewChild, ElementRef, Inject} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as _ from 'lodash';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UtileService} from '../../utile/utile.service';
import {EtudiantGroupService} from '../etudiant-group.service';
import {ThemePalette} from '@angular/material/core';
import * as moment from "moment";
import {Workbook} from "exceljs";
import * as fs from 'file-saver';

@Component({
  selector: 'app-charger',
  templateUrl: './charger-etudiant-excel.component.html',
  styleUrls: ['./charger-etudiant-excel.component.css']
})
export class ChargerEtudiantExcelComponent implements OnInit {
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
              private etudiantGroupService: EtudiantGroupService) { }

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
    console.log(fil);

    const formData = new FormData();
    formData.append('file', fil);

    console.log(formData);

    if (fil.size > 0) {
      this.type = _.includes(af, fil.type);

      if (!this.type) {
        this.fileUploadForm.get('myfile').setValue(null);
        this.utileService.successAlert('Chargement des étudiants dans les groupe', 'Le fichier doit être au format excel');

      } else {
        this.fileInputLabel = fil.name;
        this.fileUploadForm.get('myfile').setValue(fil);
      }
    }
  }

  onFormSubmit() {

    this.etudiantGroupService.addEtudiantGroup(this.file, this.data.group.id)
     .subscribe(response => {
        let doublonValue=0;
       let errorValue=[];
        this.fileInputLabel = undefined;
        console.log(response);
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
        this.utileService.successAlert('Chargement des étudiants dans les groupe', 'Chargement de ' + response.succes + ' étudiant(es) sur un total de ' + response.total + ' avec ' + doublonValue +
          ' doublon(s)');// et erreur sur le(s) code(s) permanent(s) '+errorValue);
        this.fileUploadForm.reset();
     // }
    }, error => {
      console.log(error);
    });
  }


  exportExcel() {

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('groupe');
    const columns = [];
    columns.push({ header: 'Code permanent', key: 'CP' });
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
      fs.saveAs(blob, 'modèleEtudiantGroup '+ moment().format('MM/DD/YYYY HH:mm:ss') + '.xlsx');
    });

    this.utileService.successAlert('Exporter le fichier modèle', 'Opération effectuée avec succès');

  }
}
