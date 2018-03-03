import { PaperScope, Path, view, MouseEvent, Point } from 'paper';
import { AppComponent } from './app.component';
import { TriNode } from './triNode';
export class Renderer {

  startCorner: Point;
  dragging: boolean;
  rect: Path.Rectangle;
  master: AppComponent;
  boardHeight: number;
  boardWidth: number;
  paper: PaperScope;

  constructor(master: AppComponent) {
    this.master = master;
    this.paper = master.paper;
    this.boardHeight = this.paper.view.bounds.height;
    this.boardWidth = this.paper.view.bounds.width;
    this.createBackground();
    this.setViewFunctions();
  }

  createBackground() {
    this.rect = new Path.Rectangle({
      point: [0, 0],
      size: [this.boardWidth, this.boardHeight]
    });
    this.rect.sendToBack();
    this.rect.fillColor = 'lightgrey';
  }

  renderTriangles() {
    let flip = true;
    for (let j = 0; j < this.master.boardHeight; j++) {
      for (let i = 0; i < this.master.boardWidth; i++) {
        const tri = new TriNode(this.master, i, j,
          this.master.triWidth * i,
          5 + this.master.triHeight * j, flip);
          flip = !flip;
        }
        flip = !flip;
      }
    }

    setViewFunctions() {
      const view = this.paper.view;
      view['scope'] = this;
      this.startCorner = view.bounds.point;
      view.onMouseDown = function(event) {
        if (event.event.button === 2) {
          event.stopPropagation();
          this['scope'].dragging = true;
        }
      };
      view.onMouseUp = function(event) {
        if (event.event.button === 2) {
          event.stopPropagation();
          this['scope'].dragging = false;
        }
      };
      view.onMouseDrag = function(event) {
        this['scope'].onViewMouseDrag(event);
      }
    }
    onViewMouseDrag(event) {
      const view = this.paper.view;
      let dragScale = 2.2;
      if (this.dragging) {
        view.center = view.center.add(event.delta.divide(dragScale));
        this.rect.position = this.rect.position.add(event.delta.divide(dragScale));
        //too far right
        if (this.startCorner.x - view.bounds.point.x > this.master.triRadius * this.master.boardWidth) {
          const correction = this.master.triRadius * this.master.boardWidth;
          for (const nodeList of this.master.nodeList) {
            for (const node of nodeList) {
              for (const view of node.views) {
                view.translate(new Point(-correction, 0));
              }
            }
          }
          this.startCorner.x = view.bounds.point.x;
        }
        //too far left
        if (this.startCorner.x - view.bounds.point.x < -(this.master.triRadius * this.master.boardWidth)) {
          const correction = this.master.triRadius * this.master.boardWidth;
          for (const nodeList of this.master.nodeList) {
            for (const node of nodeList) {
              for (const view of node.views) {
                view.translate(new Point(correction, 0));
              }
            }
          }
          this.startCorner.x = view.bounds.point.x;
        }
        //too far up
        if (this.startCorner.y - view.bounds.point.y > this.master.triHeight * this.master.boardHeight) {
          const correction = this.master.triHeight * this.master.boardHeight;
          for (const nodeList of this.master.nodeList) {
            for (const node of nodeList) {
              for (const view of node.views) {
                view.translate(new Point(0, -correction));
              }
            }
          }
          this.startCorner.y = view.bounds.point.y;
        }
        //too far down
        if (this.startCorner.y - view.bounds.point.y < -(this.master.triHeight * this.master.boardHeight)) {
          const correction = this.master.triHeight * this.master.boardHeight;
          for (const nodeList of this.master.nodeList) {
            for (const node of nodeList) {
              for (const view of node.views) {
                view.translate(new Point(0, correction));
              }
            }
          }
          this.startCorner.y = view.bounds.point.y;
        }
      }
    }

  }
