import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {EtudiantService} from "../etudiant.service";
import {NavigationStart, Router} from "@angular/router";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {fromEvent, of} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-list-cp-mail',
  templateUrl: './list-cp-mail.component.html',
  styleUrls: ['./list-cp-mail.component.css']
})
export class ListCpMailComponent implements OnInit,AfterViewInit {
  public dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['CP', 'Courriel'];
  length = 500;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 30];
  showFirstLastButtons = true;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  originalData: any[];
  cpAheadCPMail : any;
  courrielAheadCPMail : any;
  constructor(private etudiantService: EtudiantService,
              @Inject(MAT_DIALOG_DATA) public data,) { }

  ngOnInit(): void {

    this.getAllCpMail();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    let cpSearchBoxCPMail = document.querySelector<HTMLInputElement>('#cpSearchBoxCPMail');
    let courrielSearchBoxCPMail = document.querySelector<HTMLInputElement>('#courrielSearchBoxCPMail');




    this.cpAheadCPMail = fromEvent(cpSearchBoxCPMail,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  cpSearchBoxCPMail.value.length <=2
          || r.cpeCP.toUpperCase().includes(cpSearchBoxCPMail.value.toUpperCase())));
      }));

    this.courrielAheadCPMail = fromEvent(courrielSearchBoxCPMail,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  courrielSearchBoxCPMail.value.length <=2
          || r.cpeMail.toLowerCase().includes(courrielSearchBoxCPMail.value.toLocaleLowerCase())));
      }));

    this.cpAheadCPMail.subscribe(data =>{
      this.dataSource.data = data
    });

    this.courrielAheadCPMail.subscribe(data =>{
      this.dataSource.data = data
    });
  }

  getAllCpMail()
  {
    this.etudiantService.getAllCpMail()
      .subscribe(response => {
        this.dataSource.data = response;
        this.originalData = response;
        // this.activities=response;
      }, error => {
        console.log(error);
      })

  }

  private initResearch() {

  }


  // used to build an array of papers relevant at any given time
  public getPaginatorData(event: PageEvent): PageEvent {
    this.pageIndex = event.pageIndex; // * event.pageSize;
    this.pageSize = event.pageSize; // +this.pageIndex  ;
    return event;
  }
}
