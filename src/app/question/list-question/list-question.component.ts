import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionService} from '../../session/session.service';
import {QuestionnaireService} from '../../questionnaire/questionnaire.service';
import {UtileService} from '../../utile/utile.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-list-question',
  templateUrl: './list-question.component.html',
  styleUrls: ['./list-question.component.css']
})
export class ListQuestionComponent implements OnInit {
  constructor() {
  }


  ngOnInit(): void {
  }
}
