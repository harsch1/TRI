import { PaperScope, Path, Point, Color } from 'paper';
import { AppComponent } from './app.component';

export class TriNode {
  flipped: boolean;
  xCoord: number;
  yCoord: number;
  master: AppComponent;
  paper: PaperScope;
  neighbours: any[];
  team: string;
  xIndex: number;
  yIndex: number;
  selected: boolean;
  marked: boolean;
  views: Path.RegularPolygon[] = [];

  constructor(master: AppComponent, xIndex: number, yIndex: number,
              xCoord: number, yCoord: number, flipped: boolean) {
    this.master = master;
    this.paper = master.paper;
    this.marked = false;
    this.neighbours = [];
    this.team = 'white';
    this.xIndex = xIndex;
    this.yIndex = yIndex;
    this.selected = false;
    this.flipped = flipped;

    const vBuffer = this.master.triWidth * this.master.boardWidth;
    const hBuffer = this.master.triHeight * this.master.boardHeight;
    this.render(xCoord - vBuffer, yCoord - hBuffer); // top left
    this.render(xCoord, yCoord - hBuffer); // top
    this.render(xCoord + vBuffer, yCoord - hBuffer); // top right
    this.render(xCoord - vBuffer, yCoord); // left
    this.render(xCoord, yCoord); // center
    this.render(xCoord + vBuffer, yCoord); // right
    this.render(xCoord - vBuffer, yCoord + hBuffer); // bottom left
    this.render(xCoord, yCoord + hBuffer); // bottom
    this.render(xCoord + vBuffer, yCoord + hBuffer); // bottom right

    this.render(xCoord + 2 * vBuffer, yCoord - hBuffer); // top right x2
    this.render(xCoord + 2 * vBuffer, yCoord); // right x2
    this.render(xCoord + 2 * vBuffer, yCoord + hBuffer); // bottom right x2
    if (yIndex < 3) {
      this.render(xCoord - vBuffer, yCoord + 2 * hBuffer); // bottom x2 left
      this.render(xCoord, yCoord + 2 * hBuffer); // bottom x2
      this.render(xCoord + vBuffer, yCoord + 2 * hBuffer); // bottom x2 right
      this.render(xCoord + 2 * vBuffer, yCoord + 2 * hBuffer); // bottom x2 right x2
    }
    this.master.nodeList[xIndex][yIndex] = this;
  }

  render(xCoord: number, yCoord: number) {
    const triangle = new Path.RegularPolygon({
      center: new Point(xCoord, yCoord),
      sides: 3,
      radius: this.master.triRadius,
      fillColor: this.team,
      strokeColor: 'black',
      strokeWidth: 2
    });
    triangle['scope'] = this;
    triangle.rotation = this.flipped ? 180 : 0;
    // triangle.onMouseDown = this.onMouseDown();
    triangle.onMouseUp = function(event) {
      if (event.event.button === 0 && this.contains(event.point)) {
        this['scope'].onMouseUp();
      }
    };
    triangle.onMouseEnter = this.onMouseEnter();
    triangle.onMouseLeave = this.onMouseLeave();
    this.views.push(triangle);
  }

  select() {
    this.selected = true;
    if (this.master.triSelected) {
      this.master.selected.selected = false;
      this.master.selected.deselectViews();
    }
    this.master.triSelected = true;
    this.master.selected = this;
    this.selectViews();
    this.master.update()
  }

  deselect() {
    this.selected = false;
    if (this.master.selected === this) {
      this.deselectViews();
      this.master.selected = null;
      this.master.triSelected = false;
      this.master.update()
    }
  }
  selectViews(): any {
    for (const view of this.views) {
      view.strokeWidth = 5;
    }
  }
  deselectViews(): any {
    for (const view of this.views) {
      view.strokeWidth = 2;
    }
  }

  updateTeam(color) {
    this.team = color;
    for (const view of this.views) {
      view.fillColor = this.team;
    }
  }
  onMouseUp(): any {
    if (!this.marked) {
      this.selected ? this.deselect() : this.select();
    }
  }
  onMouseEnter(): any {
    if (!this.marked) {
      for (const view of this.views) {
        (<Color>view.fillColor).subtract(0.25);
      }
    }
  }
  onMouseLeave(): any {
    if (!this.marked) {
      for (const view of this.views) {
        (<Color>view.fillColor).add(0.25);
      }
    }
  }
}
