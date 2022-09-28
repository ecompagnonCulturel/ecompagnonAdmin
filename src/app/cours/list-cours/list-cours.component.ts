import {Component, OnInit, ViewChild,AfterViewInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {UtileService} from "../../utile/utile.service";
import {Router} from "@angular/router";
import {CoursService} from "../cours.service";
import {AddFormateurComponent} from "../../formateur/add-formateur/add-formateur.component";
import {AddCoursComponent} from "../add-cours/add-cours.component";
import Swal from "sweetalert2";
import {fromEvent, of} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-list-cours',
  templateUrl: './list-cours.component.html',
  styleUrls: ['./list-cours.component.css']
})
export class ListCoursComponent implements OnInit,AfterViewInit {
  public dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Sigle', 'NomCourt','NomLong', 'edit','delete'];
  length = 500;
  pageSize = 15;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 30];
  showFirstLastButtons = true;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  originalData: any[]
  coursInUse :any;
  sigleAhead: any;
  nomAhead: any;
  nomLAhead: any;

  constructor(private dialog: MatDialog,
              private utileService:UtileService,
              private router: Router,
              private coursService: CoursService) { }

  ngOnInit(): void {
    this.getAllCours();
    this.getAllCoursInUse();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    let sigleSearchBoxPr = document.querySelector<HTMLInputElement>('#sigleSearchBoxPr');
    let nomSearchBoxC = document.querySelector<HTMLInputElement>('#nomSearchBoxC');
    let nomLSearchBoxC = document.querySelector<HTMLInputElement>('#nomLSearchBoxC');

    this.sigleAhead = fromEvent(sigleSearchBoxPr,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  sigleSearchBoxPr.value.length <=2
          || this.utileService.removeDiacritics(r.coursNomCourt.toLowerCase())
            .includes(this.utileService.removeDiacritics(sigleSearchBoxPr.value.toLocaleLowerCase()))));
      }));

    this.nomAhead= fromEvent(nomSearchBoxC,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  nomSearchBoxC.value.length <=2
          || this.utileService.removeDiacritics(r.coursNomLong.toLowerCase())
            .includes(this.utileService.removeDiacritics(nomSearchBoxC.value.toLocaleLowerCase()))));
      }));

    this.nomLAhead= fromEvent(nomLSearchBoxC,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  nomLSearchBoxC.value.length <=2
          || this.utileService.removeDiacritics(r.coursDes.toLowerCase())
            .includes(this.utileService.removeDiacritics(nomLSearchBoxC.value.toLocaleLowerCase()))));
      }));


    this.sigleAhead.subscribe(data =>{
      this.dataSource.data = data
    });


    this.nomAhead.subscribe(data =>{
      this.dataSource.data = data
    });

    this.nomLAhead.subscribe(data =>{
      this.dataSource.data = data
    });


  }





  getAllCours()
  {
    this.coursService.getAllCours()
      .subscribe(response => {
        // console.log(response);
        this.dataSource.data = response;
        this.originalData = response;
        // this.activities=response;
      }, error => {
        console.log(error);
      })

  }

  getAllCoursInUse()
  {
    this.coursService.getAllCoursInUse()
      .subscribe(response => {
        // console.log(response)
        this.coursInUse=response;
      }, error => {
        console.log(error);
      })

  }

  openDialog() {
    const dialogRef = this.dialog.open(AddCoursComponent, {
      width: '100%',
      height:'85%',
      data: {titre: 'Ajouter  un cours'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  editDialog(cours: any) {
    const dialogRef = this.dialog.open(AddCoursComponent, {
      width: '100%',
      height:'85%',
      data: {cours, titre: 'Modifier  un cours'}
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
      text: 'Voulez- vous supprimer ce cours?',
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

        this.coursService.delCours(id)
          .subscribe(
            // Admire results
            (data) => {
              this.utileService.successAlert('Supprimer un cours', 'Opération effectuée avec succès');
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
