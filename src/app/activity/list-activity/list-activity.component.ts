import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivityService} from "../activity.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {AddActivityComponent} from "../add-activity/add-activity.component";
import {UtileService} from '../../utile/utile.service';
import Swal from "sweetalert2";
import {fromEvent, of} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map, switchMap} from "rxjs/operators";
import { NavigationStart, Router } from '@angular/router';


@Component({
  selector: 'app-list-activity',
  templateUrl: './list-activity.component.html',
  styleUrls: ['./list-activity.component.css']
})
export class ListActivityComponent implements OnInit,AfterViewInit {
  public dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Session', 'Activité', 'edit', 'delete'];
  length = 500;
  pageSize = 50;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 30];
  showFirstLastButtons = true;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  originalData: any[]
  activitiesInUse: any;
  descAhead : any ;
  sessionAheadA : any ;
  private routeSub:any;

  constructor(private activityService:ActivityService,
              private dialog: MatDialog,
              private utileService: UtileService,
              private router: Router
              ) { }

  ngOnInit(): void {
    this.getAllActivities();
    this.getAllActivitiesFromComplement();

 /*   //for destroy component f
    this.routeSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // save your data
      }
    });*/
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    let descSearchBox = document.querySelector<HTMLInputElement>('#descSearchBox');
    let sessionSearchBoxA = document.querySelector<HTMLInputElement>('#sessionSearchBoxA');

   // console.log(this.originalData);


  this.sessionAheadA = fromEvent(sessionSearchBoxA,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  sessionSearchBoxA.value.length <=2
          || this.utileService.removeDiacritics(r.session.sessNom.toLowerCase())
            .includes(this.utileService.removeDiacritics(sessionSearchBoxA.value.toLocaleLowerCase()))));
      }));

    this.descAhead = fromEvent(descSearchBox,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  descSearchBox.value.length <=2
          || this.utileService.removeDiacritics(r.actDesc.toLowerCase())
            .includes( this.utileService.removeDiacritics(descSearchBox.value.toLocaleLowerCase()))));
      }));

 this.descAhead.subscribe(data =>{
      this.dataSource.data = data
    });

    this.sessionAheadA.subscribe(data =>{
      this.dataSource.data = data
    });
  }


  getAllActivities()
  {
    this.activityService.getAllActivities()
      .subscribe(response => {
       // console.log(response);
        this.dataSource.data = response;
        this.originalData = response;
       // this.activities=response;
      }, error => {
        console.log(error);
      })

  }

  getAllActivitiesFromComplement()
  {
    this.activityService.getAllActivitiesFromComplement()
      .subscribe(response => {
       // console.log(response);
      this.activitiesInUse=response;
      }, error => {
        console.log(error);
      })

  }

  openDialog() {
    const dialogRef = this.dialog.open(AddActivityComponent, {
      width: '35%',
      data: {titre: 'Ajouter  une activité'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  editDialog(activite) {
    const dialogRef = this.dialog.open(AddActivityComponent, {
      width: '35%',
      data: {activite, titre: 'Modifier  une activité'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
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


  async deleteActivite(id) {

    await Swal.fire({
      // title: 'Are you sure?',
      text: 'Voulez- vous supprimer cette activité',
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

        this.activityService.deleteActivite(id)
          .subscribe(
            // Admire results
            (data) => {
              this.utileService.successAlert('Supprimer une activité', 'Surpression effectuée avec sussès')
              this.getAllActivities();
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
/*  public ngOnDestroy() {
    this.routeSub.unsubscribe();
  }*/

}
