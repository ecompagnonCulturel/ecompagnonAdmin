import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ResourceService} from "../resource.service";
import {AddEtudiantComponent} from "../../etudiant/add-etudiant/add-etudiant.component";
import {MatDialog} from "@angular/material/dialog";
import {fromEvent, Observable, of,combineLatest} from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap
} from "rxjs/operators";
import {UtileService} from "../../utile/utile.service";
import {AddResourceComponent} from "../add-resource/add-resource.component";
import Swal from "sweetalert2";
import {ChargerExcelComponent} from "../../etudiant/charger-excel/charger-excel.component";
import {ChargerExcelResourceComponent} from "../charger-excel-resource/charger-excel-resource.component";

@Component({
  selector: 'app-list-resource',
  templateUrl: './list-resource.component.html',
  styleUrls: ['./list-resource.component.css']
})
export class ListResourceComponent implements OnInit,AfterViewInit {
  public dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Session', 'Desc', 'Type', 'Url','edit','delete'];
  length = 500;
  pageSize = 15;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 30];
  showFirstLastButtons = true;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  originalData: any[]
  resourceInUse :any;
  sessionAhead : any;
  descAhead : any;
  urlAhead : any;
  typeAhead : any;
  types: any;
  constructor(private resourceService: ResourceService,
              private dialog: MatDialog,
              private utileService: UtileService) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllResourcesFromCoursRes();
    this.getAllResourse();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    let sessionSearchBoxR = document.querySelector<HTMLInputElement>('#sessionSearchBoxR');
    let desSearchBox = document.querySelector<HTMLInputElement>('#desSearchBox');
    let typeSearchBox = document.querySelector<HTMLInputElement>('#typeSearchBox');

    this.sessionAhead = fromEvent(sessionSearchBoxR,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  sessionSearchBoxR.value.length <=2
          || this.utileService.removeDiacritics(r.ressSession.sessNom.toLowerCase())
            .includes(this.utileService.removeDiacritics(sessionSearchBoxR.value.toLocaleLowerCase()))));
      }));

    this.descAhead= fromEvent(desSearchBox,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  desSearchBox.value.length <=2
          || (this.utileService.removeDiacritics(r.ressDesc.toLowerCase())) .includes(this.utileService.removeDiacritics(desSearchBox.value.toLocaleLowerCase()))));
      }));

    this.typeAhead = fromEvent(typeSearchBox,'change').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLSelectElement).value),
      switchMap(() => {
        if (typeSearchBox.value!= 'vide') {
          return of(this.originalData.filter(r => (r.ressType.id) == (typeSearchBox.value)))
        } else {
          return of(this.originalData)
        }


      } ));

    this.typeAhead.subscribe(data =>{
    //  console.log(data);
      this.dataSource.data = data
    });

    this.sessionAhead.subscribe(data =>{
      //  console.log(data);
      this.dataSource.data = data
    });

    this.descAhead.subscribe(data =>{
      //  console.log(data);
      this.dataSource.data = data
    });


  }


  getAllResourse()
  {
    this.resourceService.getAllResources()
      .subscribe(response => {
         //console.log(response);
        this.dataSource.data = response;
        this.originalData = response;
        this.initResearch();
        // this.activities=response;
      }, error => {
        console.log(error);
      })

  }

  getAllResourcesFromCoursRes()
  {
    this.resourceService.getAllResourcesFromCoursRes()
      .subscribe(response => {
       this.resourceInUse=response
      }, error => {
        console.log(error);
      })

  }
  getAllCategories()
  {
    this.resourceService.getAllCategories()
      .subscribe(response => {
        //console.log(response);
        this.types=response
        // this.activities=response;
      }, error => {
        console.log(error);
      })

  }
  openDialog() {
    const dialogRef = this.dialog.open(AddResourceComponent, {
      width: '100%',
      height:'85%',
      data: {titre: 'Ajouter  une ressource'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  editDialog(ressource: any) {
    const dialogRef = this.dialog.open(AddResourceComponent, {
      width: '100%',
      height:'85%',
      data: {ressource, titre: 'Modifier  une ressource'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    })
  }

  private initResearch() {

  }
  // used to build an array of papers relevant at any given time
  public getPaginatorData(event: PageEvent): PageEvent {
    this.pageIndex = event.pageIndex; // * event.pageSize;
    this.pageSize = event.pageSize; // +this.pageIndex  ;
    return event;
  }s

  uploadStudent() {
    const dialogRef = this.dialog.open(ChargerExcelResourceComponent, {
      width: '70%',
      data: {titre: 'Chargement des ressources par fichier Excel '}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  objectExist(item: any, object: any) {
    //console.log(item)
    // console.log(object)
    return this.utileService.objectExist(item, object);
  }


    async deleteRessource(id)
    {


      await Swal.fire({
        // title: 'Are you sure?',
        text: 'Voulez- vous supprimer cette ressource?',
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

          this.resourceService.deleteRessource(id)
            .subscribe(
              (data) => {
                this.utileService.successAlert('Supprimer une ressource', 'Opération effectuée avec succès');
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

}
