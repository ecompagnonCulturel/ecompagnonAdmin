import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {UtileService} from "../../utile/utile.service";
import {Router} from "@angular/router";
import {AuthentificationService} from "../authentification.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {fromEvent, of} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit, AfterViewInit{
  public dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Prenom', 'Nom','CP', 'Courriel','Enabled'];
  length = 500;
  pageSize = 15;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 30];
  showFirstLastButtons = true;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  originalData: any[]
  prenomAhead : any ;
  nomAhead : any ;
  courrielAhead : any ;
  constructor(private dialog: MatDialog,
              private utileService: UtileService,
              private router: Router,
              private authService :AuthentificationService) { }

  ngOnInit(): void {
    this.getAllusers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    let prenomSearchBox = document.querySelector<HTMLInputElement>('#prenomSearchBox');
    let nomSearchBox = document.querySelector<HTMLInputElement>('#nomSearchBox');

    this.prenomAhead = fromEvent(prenomSearchBox,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        //console.log(prenomSearchBox.value);
        return of(this.originalData.filter(r =>  prenomSearchBox.value.length <=2
          || this.utileService.removeDiacritics(r[0].toLowerCase())
            .includes(this.utileService.removeDiacritics(prenomSearchBox.value.toLocaleLowerCase()))));
      }));

    this.nomAhead = fromEvent(nomSearchBox,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        //console.log(prenomSearchBox.value);
        return of(this.originalData.filter(r =>  nomSearchBox.value.length <=2
          || this.utileService.removeDiacritics(r[1].toLowerCase())
            .includes(this.utileService.removeDiacritics(nomSearchBox.value.toLocaleLowerCase()))));
      }));

    this.prenomAhead.subscribe(data =>{
      this.dataSource.data = data
    });

    this.nomAhead.subscribe(data =>{
      this.dataSource.data = data
    });
  }

  getAllusers()
  {
    this.authService.getAllusers()
      .subscribe(response => {
        // console.log(response);
        this.dataSource.data = response;
        this.originalData = response;
        // this.activities=response;
      }, error => {
        console.log(error);
      })

  }

  // used to build an array of papers relevant at any given time
  public getPaginatorData(event: PageEvent): PageEvent {
    this.pageIndex = event.pageIndex; // * event.pageSize;
    this.pageSize = event.pageSize; // +this.pageIndex  ;
    return event;
  }

}
