import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {EtudiantService} from "../etudiant.service";
import {AddActivityComponent} from "../../activity/add-activity/add-activity.component";
import {MatDialog} from "@angular/material/dialog";
import {AddEtudiantComponent} from "../add-etudiant/add-etudiant.component";
import {UtileService} from "../../utile/utile.service";
import {fromEvent, of} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map, switchMap} from "rxjs/operators";
import {EtudiantGroupService} from "../../etudiantGroup/etudiant-group.service";
import {NavigationStart,Router} from "@angular/router";
import Swal from "sweetalert2";
import {ChargerEtudiantExcelComponent} from "../../etudiantGroup/charger-etudiant-excel/charger-etudiant-excel.component";
import {ChargerExcelComponent} from "../charger-excel/charger-excel.component";
import {ListCpMailComponent} from "../list-cp-mail/list-cp-mail.component";


@Component({
  selector: 'app-list-etudiant',
  templateUrl: './list-etudiant.component.html',
  styleUrls: ['./list-etudiant.component.css']
})
export class ListEtudiantComponent implements OnInit,AfterViewInit {
  public dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Prenom', 'Nom', 'CP', 'Courriel','edit','delete'];
  length = 500;
  pageSize = 20;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 30];
  showFirstLastButtons = true;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  originalData: any[]
  etudiantInUse :any;
  nomAhead : any ;
  prenomAhead : any ;
  cphead : any ;
  courrielAhead : any ;
   routeSub: any;

  constructor(private etudiantService:EtudiantService,
              private dialog: MatDialog,
              private utileService:UtileService,
              private etudiantGroupServive:EtudiantGroupService,
              private router: Router) { }

  ngOnInit(): void {
    this.getAllStudent();
    this.getAllEtudiantInUse();

    //for destroy component f
    this.routeSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // save your data
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  let nomSearchBox = document.querySelector<HTMLInputElement>('#nomSearchBox');
    let prenomSearchBox = document.querySelector<HTMLInputElement>('#prenomSearchBox');
    let cpSearchBox = document.querySelector<HTMLInputElement>('#cpSearchBox');



    this.prenomAhead = fromEvent(prenomSearchBox,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  prenomSearchBox.value.length <=2
          || this.utileService.removeDiacritics(r.etudFirstName.toLowerCase())
            .includes(this.utileService.removeDiacritics(prenomSearchBox.value.toLocaleLowerCase()))));
      }));

    this.nomAhead = fromEvent(nomSearchBox,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  nomSearchBox.value.length <=2
          ||this.utileService.removeDiacritics( r.etudLastName.toLowerCase())
            .includes(this.utileService.removeDiacritics(nomSearchBox.value.toLocaleLowerCase()))));
      }));
    this.cphead = fromEvent(cpSearchBox,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  cpSearchBox.value.length <=2
          || r.etudCP.toLowerCase().includes(cpSearchBox.value.toLocaleLowerCase())));
      }));


    this.prenomAhead.subscribe(data =>{
      this.dataSource.data = data
    });


    this.nomAhead.subscribe(data =>{
      this.dataSource.data = data
    });


    this.cphead.subscribe(data =>{
      this.dataSource.data = data
    });
  }

  getAllStudent()
  {
    this.etudiantService.getAllEtudiantOrderByFirstName()
      .subscribe(response => {
       // console.log(response);
        this.dataSource.data = response;
        this.originalData = response;
        this.initResearch();
        // this.activities=response;
      }, error => {
        console.log(error);
      })

  }
  getAllEtudiantInUse()
{
  this.etudiantGroupServive.getAllEtudiant()
    .subscribe(response => {
     // console.log(response)
    this.etudiantInUse=response;
    }, error => {
      console.log(error);
    })

}
  openDialog() {
    const dialogRef = this.dialog.open(AddEtudiantComponent, {
      width: '100%',
      height:'85%',
      data: {titre: 'Ajouter  un étudiant'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  editDialog(etudiant: any) {
    const dialogRef = this.dialog.open(AddEtudiantComponent, {
      width: '100%',
      height:'85%',
      data: {etudiant, titre: 'Modifier  un étudiant'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    })
 }

  objectExist(item: any, object: any) {
    return this.utileService.objectExist(item, object);
  }

  async deleteEtudiant(id)
{


  await Swal.fire({
    // title: 'Are you sure?',
    text: 'Voulez- vous supprimer cet étudiant',
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

      this.etudiantService.delEtudiant(id)
        .subscribe(
          // Admire results
          (data) => {
            this.utileService.successAlert('Supprimer un étudiant', 'Opération effectuée avec succès');
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

  public ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  uploadStudent() {
    const dialogRef = this.dialog.open(ChargerExcelComponent, {
      width: '50%',
      data: {titre: 'Chargement des étudiants par fichier Excel '}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
  initResearch()
  {
    document.querySelector<HTMLInputElement>('#nomSearchBox').value='';
    document.querySelector<HTMLInputElement>('#prenomSearchBox').value='';
    document.querySelector<HTMLInputElement>('#cpSearchBox').value='';

  }

  listCpMail() {
    const dialogRef = this.dialog.open(ListCpMailComponent, {
      width: '70%',
      data: {titre: 'Liste des courriels et code Permanents des étudiants' +
          ' pouvant créer leur compte'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });

  }
}
