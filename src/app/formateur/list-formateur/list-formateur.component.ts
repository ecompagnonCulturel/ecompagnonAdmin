import {Component, OnInit, ViewChild,AfterViewInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {UtileService} from "../../utile/utile.service";
import {Router} from "@angular/router";
import {FormateurService} from "../formateur.service";
import {AddFormateurComponent} from "../add-formateur/add-formateur.component";
import Swal from "sweetalert2";
import {fromEvent, of} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-list-formateur',
  templateUrl: './list-formateur.component.html',
  styleUrls: ['./list-formateur.component.css']
})
export class ListFormateurComponent implements OnInit,AfterViewInit {
  public dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Prenom', 'Nom', 'edit','delete'];
  length = 500;
  pageSize = 15;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 30];
  showFirstLastButtons = true;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  originalData: any[]
  profInUse :any;
  nomAhead: any;
  prenomAhead: any;
  constructor(private dialog: MatDialog,
              private utileService:UtileService,
              private router: Router,
              private formateurService: FormateurService) { }

  ngOnInit(): void {
    this.getAllProfInUse();
    this.getAllFormateur();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    let prenomSearchBoxPr = document.querySelector<HTMLInputElement>('#prenomSearchBoxPr');
    let nomSearchBoxPr = document.querySelector<HTMLInputElement>('#nomSearchBoxPr');

    this.prenomAhead = fromEvent(prenomSearchBoxPr,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  prenomSearchBoxPr.value.length <=2
          || this.utileService.removeDiacritics(r.profFirstName.toLowerCase())
            .includes(this.utileService.removeDiacritics(prenomSearchBoxPr.value.toLocaleLowerCase()))));
      }));

    this.nomAhead = fromEvent(nomSearchBoxPr,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  nomSearchBoxPr.value.length <=2
          ||this.utileService.removeDiacritics( r.profLastName.toLowerCase())
            .includes(this.utileService.removeDiacritics(nomSearchBoxPr.value.toLocaleLowerCase()))));
      }));

    this.prenomAhead.subscribe(data =>{
      this.dataSource.data = data
    });


    this.nomAhead.subscribe(data =>{
      this.dataSource.data = data
    });


  }

  getAllFormateur()
  {
    this.formateurService.getAllProf()
      .subscribe(response => {
        // console.log(response);
        this.dataSource.data = response;
        this.originalData = response;
        // this.activities=response;
      }, error => {
        console.log(error);
      })

  }

  getAllProfInUse()
  {
    this.formateurService.getAllProfInUse()
      .subscribe(response => {
        // console.log(response)
        this.profInUse=response;
      }, error => {
        console.log(error);
      })

  }

  openDialog() {
    const dialogRef = this.dialog.open(AddFormateurComponent, {
      width: '100%',
      height:'85%',
      data: {titre: 'Ajouter  un formateur'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  editDialog(prof: any) {
    const dialogRef = this.dialog.open(AddFormateurComponent, {
      width: '100%',
      height:'85%',
      data: {prof, titre: 'Modifier  un formateur'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    })
  }

  objectExist(item: any, object: any) {
    return this.utileService.objectExist(item, object);
  }

  async deleteFormateur(id)
  {


    await Swal.fire({
      // title: 'Are you sure?',
      text: 'Voulez- vous supprimer ce formateur?',
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

        this.formateurService.delProf(id)
          .subscribe(
            // Admire results
            (data) => {
              this.utileService.successAlert('Supprimer un formateur', 'Opération effectuée avec succès');
              this.ngOnInit();
            },

            error => {
              console.log(error);
            },

            // () => { console.log("completed") }

          );

      } else if (result.isDismissed) {

        console.log('Clicked No, File is safe!');

      }
    });


  }

  // used to build an array of papers relevant at any given time
  public getPaginatorData(event: PageEvent): PageEvent {
    this.pageIndex = event.pageIndex; // * event.pageSize;
    this.pageSize = event.pageSize; // +this.pageIndex  ;
    return event;
  }


}
