import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PaperScope, Path, Point } from 'paper';
import { Renderer } from './renderer';
import { TriNode } from './triNode';
import { ButtonsModule } from 'ngx-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  @ViewChild('myCanvas') canvas;
  @ViewChild('submitButton') submitButton;
  title = 'app works!';
  paper = new PaperScope();
  nodeList: TriNode[][] = [];
  selected: TriNode;
  triSelected = false;
  redColor = '#DA4238';
  blueColor = '#4238DA';

  currentColor = this.redColor;

  public boardHeight = 8;
  public boardWidth = 16;
  public triRadius: number;
  public triWidth: number;
  public triHeight: number;
  triScale = 2.8;
  triSpacing = 5;

  constructor(private ref: ChangeDetectorRef){
  }

  ngOnInit() {
    this.triRadius = this.canvas.nativeElement.width / (this.boardWidth / this.triScale);
    this.triWidth = this.triRadius + this.triSpacing;
    this.triHeight = this.triRadius * 1.6  + this.triSpacing;
    for (let i = 0; i < this.boardWidth; i++) {
      this.nodeList[i] = [];
    }
    this.paper.setup(this.canvas.nativeElement);
    console.log(this.paper);
    const renderer = new Renderer(this);
    renderer.renderTriangles();
    console.log(this.triRadius);
    this.ref.detectChanges();

  }

  getTri(x: number, y: number) {
    return this.nodeList[x][y];
  }

  buttonClicked() {
    this.selected.marked = true;
    this.selected.updateTeam(this.currentColor);
    this.currentColor = (this.currentColor === this.redColor) ? this.blueColor : this.redColor;
    this.triSelected = false;
    this.selected.deselect();
  }

  update() {
    this.ref.detectChanges();
  }
}
