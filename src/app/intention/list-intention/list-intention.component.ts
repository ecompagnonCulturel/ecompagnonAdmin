import {Component, OnInit, ViewChild,AfterViewInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {UtileService} from "../../utile/utile.service";
import {SessionService} from "../../session/session.service";
import {IntensionService} from "../intension.service";
import Swal from "sweetalert2";
import {AddSessionComponent} from "../../session/add-session/add-session.component";
import {fromEvent, of} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map, switchMap} from "rxjs/operators";
import {AddIntentionComponent} from "../add-intention/add-intention.component";

@Component({
  selector: 'app-list-intension',
  templateUrl: './list-intention.component.html',
  styleUrls: ['./list-intention.component.css']
})
export class ListIntentionComponent implements OnInit,AfterViewInit {
  intension: any;
  originalData: any[]
  public dataSource = new MatTableDataSource<any[]>();
  displayedColumns: string[] = ['ressource', 'cours', 'prof', 'session', 'intension', 'edit', 'delete'];
  length = 500;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 30];
  showFirstLastButtons = true;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  ressourceAhead: any;
  coursAhead: any;
  profAhead: any;
  sessionAhead: any;
  constructor( private dialog: MatDialog,
               private utileService: UtileService,
               private sessionService: SessionService,
               private intensionService: IntensionService) { }

  ngOnInit(): void {
    this.getAllIntension();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    let ressourceSearchBox = document.querySelector<HTMLInputElement>('#ressourceSearchBox');
    let coursSearchBox = document.querySelector<HTMLInputElement>('#coursSearchBox');
    let profSearchBox = document.querySelector<HTMLInputElement>('#profSearchBox');
    let sessionSearchBox = document.querySelector<HTMLInputElement>('#sessionSearchBox');

    this.ressourceAhead = fromEvent(ressourceSearchBox,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  ressourceSearchBox.value.length <=2
          ||this.utileService.removeDiacritics( (r.coursResResource.ressDesc).toLowerCase())
            .includes(this.utileService.removeDiacritics(ressourceSearchBox.value.toLocaleLowerCase()))));
      }));

    this.coursAhead = fromEvent(coursSearchBox,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  coursSearchBox.value.length <=2
          ||this.utileService.removeDiacritics( (r.coursResCours.coursDes).toLowerCase())
            .includes(this.utileService.removeDiacritics(coursSearchBox.value.toLocaleLowerCase()))));
      }));

    this.profAhead = fromEvent(profSearchBox,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  profSearchBox.value.length <=2
          ||(this.utileService.removeDiacritics( (r.coursResProf.profFirstName).toLowerCase())
            .includes(this.utileService.removeDiacritics(profSearchBox.value.toLocaleLowerCase())))
          ||(this.utileService.removeDiacritics( (r.coursResProf.profLastName).toLowerCase())
            .includes(this.utileService.removeDiacritics(profSearchBox.value.toLocaleLowerCase())))

        ));
      }));

    this.sessionAhead = fromEvent(sessionSearchBox,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  sessionSearchBox.value.length <=2
          ||this.utileService.removeDiacritics( (r.coursResSession.sessNom).toLowerCase())
            .includes(this.utileService.removeDiacritics(sessionSearchBox.value.toLocaleLowerCase()))));
      }));

    this.ressourceAhead.subscribe(data =>{
      this.dataSource.data = data
    });

    this.coursAhead.subscribe(data =>{
      this.dataSource.data = data
    });

    this.sessionAhead.subscribe(data =>{
      this.dataSource.data = data
    });
  }

  getAllIntension() {
    // this.sessionService.getAllSession();
    this.intensionService.getAllIntension().subscribe(intensionAll => {
    this.intension=intensionAll;
    this.dataSource.data=intensionAll;
    this.originalData=intensionAll;
      },
      err => {
        console.log(err);
      }
    );
  }

  // used to build an array of papers relevant at any given time
  public getPaginatorData(event: PageEvent): PageEvent {
    this.pageIndex = event.pageIndex; // * event.pageSize;
    this.pageSize = event.pageSize; // +this.pageIndex  ;
    return event;
  }


  objectExist(item: any, object: any) {
    return this.utileService.objectExist(item, object);
  }

  async delIntension(id) {

    await Swal.fire({
      // title: 'Are you sure?',
      text: 'Voulez- vous supprimer cette intension',
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

        this.intensionService.delIntension(id)
          .subscribe(
            // Admire results
            (data) => {
              this.ngOnInit()
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

  openDialog() {
    const dialogRef = this.dialog.open(AddIntentionComponent, {
      width: '100%',
      data: {titre: 'Ajouter une Intention'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  editDialog(intention) {
    const dialogRef = this.dialog.open(AddIntentionComponent, {
      width: '100%',
      data: {intention, titre: 'Modifier une intention de cours'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  async deleteIntension(id: any)
{
  await Swal.fire({
    // title: 'Are you sure?',
    text: 'Voulez- vous supprimer cette intention?',
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

      this.intensionService.delIntension(id)
        .subscribe(
          // Admire results
          (data) => {
            this.utileService.successAlert('Supprimer une intention', 'Opération effectuée avec succès');
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
