
import { _decorator, Component, Node, Graphics, Color, ProgressBar, UITransform, Prefab, instantiate, Vec3, Size, Sprite, tween, UIOpacity, EventTouch, math, Vec2, size, director, Tween, Label } from 'cc';

import { FlowDotGenertion } from './FlowDotGenertion';
import { FlowDrawLine } from './FlowDrawLine';
const { ccclass, property } = _decorator;
const ProgressDirection: boolean = true;
const ProgressBarSpeed: number = 2;
const WIDTH: number = 720;
const HEIGHT: number = 1280;
/**
 * Predefined variables
 * Name = FlowGameManager
 * DateTime = Sun Oct 16 2022 11:21:12 GMT+0530 (India Standard Time)
 * Author = irshad
 * FileBasename = FlowGameManager.ts
 * FileBasenameNoExtension = FlowGameManager
 * URL = db://assets/FlowGameManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

@ccclass('FlowGameManager')
export class FlowGameManager extends Component {



    @property(Prefab)
    lineProgressBarPrefab: Prefab | null = null;

    @property(FlowDotGenertion)
    flowDotGeneration: FlowDotGenertion | null = null;

    @property(Node)
    lineContainer: Node | null = null;

    @property(FlowDrawLine)
    flowDrawLine: FlowDrawLine | null = null;

    @property(Prefab)
    touchDot: Prefab | null = null;

    @property(Node)
    PauseMenuNode: Node | null = null;

    @property(ProgressBar)
    progressbar: ProgressBar | null = null;

    dotContainer: Node = null;

    @property(Node)
    HeartLifeContainer: Node | null = null;

    @property(Node)
    scoreLabel: Node | null = null;

    private scorePoint: number = 0;



    start() {


        // let lineNod: Node = new Node("LineNode");
        // lineNod.layer = this.node.layer;
        // lineNod.addComponent(Graphics);
        // let GraphicObj: Graphics = this.node.children[0].getComponent(Graphics);
        // GraphicObj.moveTo(30, 12);
        // GraphicObj.lineTo(30, 0);
        // GraphicObj.lineWidth = 10;
        // GraphicObj.strokeColor.fromHEX(Color.GREEN.toHEX());
        // GraphicObj.close();
        // GraphicObj.stroke();
        // GraphicObj.fill();

        // this.node.addChild(lineNod);
        // let g: Graphics = this.node.children[0].getComponent(Graphics);
        // g.lineWidth = 10;
        // g.fillColor.fromHEX('#ff0000');
        // g.moveTo(-40, 0);
        // g.lineTo(0, -80);
        // g.lineTo(40, 0);
        // g.lineTo(0, 80);
        // g.close();
        // g.stroke();
        // g.fill();
    }

    generteGameScene() {

        if (this.flowDotGeneration) {
            this.dotContainer = this.flowDotGeneration.node;
        }
        for (var i = 0; i < 5; i++) {
            this.flowDotGeneration.generateRandomDots(i);
        }
        this.flowDotGeneration.dotPosition_Array = [];
        this.lineGenerationUsingSprite();
        // this.OnTouchTouchEnable = true;
        this.flowDrawLine.addTouchEventstoDots();
        this.progressbarCount = true;

    }

    tapAction() {

        // console.log("tapC")
        // let GraphicObj: Graphics = this.node.children[0].getComponent(Graphics);
        // this.ydis -= 10;
        // GraphicObj.moveTo(30, 12);
        // GraphicObj.lineTo(30, this.ydis);
        // GraphicObj.lineWidth = 10;
        // GraphicObj.strokeColor.fromHEX(Color.GREEN.toHEX());
        // GraphicObj.close();
        // GraphicObj.stroke();
        // GraphicObj.fill();

    }

    private startindx: number = 0;
    private gameTime: number = 60;  /* from json */
    private GameTimeCount: number = 60;
    private timer: number = 0;
    private progressbarCount: boolean = false;
    update(deltaTime: number) {

        if (this.lineRun) {

            if (this.lineContainer.children.length > 0) {

                if (this.startindx < this.lineContainer.children.length) {

                    if (this.lineContainer.children[this.startindx].getComponent(ProgressBar).progress < 1) {
                        this.lineContainer.children[this.startindx].getComponent(ProgressBar).progress += deltaTime * ProgressBarSpeed;
                    } else {
                        this.startindx++;
                        this.dotPopAnim(this.startindx);
                    }

                } else {
                    this.lineRun = false;
                    this.scheduleOnce(this.HideAutoDrawLine, 2);
                }
            }
        }

        if (this.progressbarCount == true) {
            let Progress = this.progressbar.progress;
            Progress += (deltaTime / this.gameTime);
            this.progressbar.progress = Progress;
            if (this.progressbar.progress >= 1) {
                this.progressbarCount = false;
                this.gameEnd();
            }
        }

        if (this.tempscore > this.scorePoint) {
            this.scorePoint += 10;
            this.scoreLabel.getComponent(Label).string = this.scorePoint.toString();
            if (this.scorePoint >= this.tempscore) {
                this.scorePoint = this.tempscore;
            }
        }

    }
    HideAutoDrawLine() {

        for (var i = 0; i < this.lineContainer.children.length; i++) {
            this.hideOpacityCall(this.lineContainer.children[i]);
        }
        this.OnTouchTouchEnable = true;
        this.tweenRepeatPopup();
    }

    tweenRepeatPopup() {
        let popUpOption: Tween<Node> = tween(this.dotContainer.children[0]).to(0.6, { scale: new Vec3(1.09, 1.09, 1.09) }).to(0.6, { scale: new Vec3(1, 1, 1) });
        tween(this.dotContainer.children[0]).repeatForever(popUpOption)
            .tag(10)
            .start();
    }

    hideOpacityCall(line: Node) {

        let _opacity: UIOpacity = line.children[0].getComponent(UIOpacity);
        if (_opacity != null) {
            tween(_opacity)
                .to(1, { opacity: 0 })
                .start();
        }

    }


    dotPopAnim(startindx: number) {

        let targetNode: Node = this.dotContainer.children[startindx];
        if (targetNode != null) {
            tween(targetNode)
                .to(0.2, { scale: new Vec3(1.1, 1.1, 1.1) })
                .to(0.2, { scale: new Vec3(1, 1, 1) })
                .start();
        }

    }



    lineGenerationUsingSprite() {


        let dotCount = this.dotContainer.children.length;

        if (dotCount > 0) {

            for (var i = 0; i < dotCount - 1; i++) {
                this.generateLineProgress(i);
            }

        }
        console.log(this.lineContainer)
        this.calculateDistaceBetwenPoints();
    }

    generateLineProgress(i: number) {

        let _progressBarNode: Node = instantiate(this.lineProgressBarPrefab);
        _progressBarNode.name = "Line" + i;
        this.lineContainer.addChild(_progressBarNode);

    }

    private dist_Array: Array<number> = []

    calculateDistaceBetwenPoints() {

        for (var i = 0; i < 5 - 1; i++) {

            let dist: number = this.distanceBtPoints(this.dotContainer.children[i].position.clone(), this.dotContainer.children[i + 1].position.clone());
            let midPoint: Vec3 = this.midPointBetweenPoints(this.dotContainer.children[i].position.clone(), this.dotContainer.children[i + 1].position.clone());
            this.dist_Array.push(dist);
            let angle: number = this.angleBetweenDots(this.dotContainer.children[i].position.clone(), this.dotContainer.children[i + 1].position.clone());
            this.lineContainer.children[i].getComponent(UITransform).setContentSize(new Size(dist, 10));
            this.lineContainer.children[i].getComponent(ProgressBar).reverse = true;
            this.lineContainer.children[i].children[0].setPosition((dist / 2), 0, 0);
            this.lineContainer.children[i].children[0]
            this.setLineColor(this.lineContainer.children[i].children[0])
            this.lineContainer.children[i].getComponent(ProgressBar).totalLength = dist;
            this.lineContainer.children[i].getComponent(ProgressBar).progress = 0;
            this.lineContainer.children[i].setPosition(midPoint);
            this.lineContainer.children[i].eulerAngles = new Vec3(0, 0, angle);

        }
        this.scheduleOnce(() => {
            this.lineRun = true;
        }, 1.5);

    }

    setLineColor(lineNode: Node) {
        lineNode.getComponent(Sprite).color = new Color().fromHEX("#561DB7");
    }


    lineRun: boolean = false;
    angleBetweenDots(arg0: Vec3, arg1: Vec3): number {

        let Xcox: number = arg0.x - arg1.x;
        let YCor: number = arg0.y - arg1.y;
        let Angle: number = Math.atan2(YCor, Xcox) * 180 / Math.PI;
        return Angle;

    }

    midPointBetweenPoints(arg0: Vec3, arg1: Vec3): Vec3 {

        let point_X: number = (arg0.x / 2) + (arg1.x / 2);
        let point_Y: number = (arg0.y / 2) + (arg1.y / 2);
        let mid_vec2: Vec3 = new Vec3(point_X, point_Y, 0);
        return mid_vec2;

    }


    distanceBtPoints(arg0: Vec3, arg1: Vec3): number {
        /**
         * Finding Distance between two Points
        */
        let X = Math.abs(arg0.x - arg1.x);
        let Y = Math.abs(arg0.y - arg1.y);
        let Z = 0;

        let dist: number = Math.sqrt((X * X) + (Y * Y));


        return dist;


    }

    private _touchDot: Node = null;
    private touchMoveStatus: boolean = false;
    private firstEndPoint: Vec3 = null;
    private OnTouchTouchEnable: boolean = false;

    OnTouchStartAction(startTouchPoint: math.Vec2) {

        if (this.OnTouchTouchEnable) {
            Tween.stopAllByTag(10);
            this.currentTouchedDot = null;
            this.startDotNode = null;
            if (this.touchDot && this.flowDrawLine) {
                this._touchDot = instantiate(this.touchDot);
                this.flowDrawLine.node.addChild(this._touchDot);
                let pos_x: number = startTouchPoint.x - (WIDTH / 2);
                let pos_y: number = startTouchPoint.y - (HEIGHT / 2);
                this._touchDot.setPosition(pos_x, pos_y, 0);
                this.firstEndPoint = new Vec3(pos_x, pos_y, 0);

                if (this.flowDotGeneration.startDot != -1 && this.checkTouchedDots(this._touchDot)) {
                    this.touchMoveStatus = true;
                }
                else {

                    // if (this.currentTouchedDot && this.startDotNode) {
                    //     this.wrongDotTouched(this.currentTouchedDot, this.startDotNode);
                    // }
                }


            }
        }

    }

    wrongDotTouched(currentTouchedDot: Node, startDotNode: Node) {
        /** change node color after touch */
        currentTouchedDot.children[0].getComponent(Sprite).color = new Color().fromHEX("#F44336");
        startDotNode.children[0].getComponent(Sprite).color = new Color().fromHEX("#F44336");
        this.waveAction(currentTouchedDot);
        this.waveAction(startDotNode);
        this.scheduleOnce(() => {
            this.resetDotColors(currentTouchedDot, startDotNode)
        }, 2)

    }
    waveAction(Dot: Node) {
        tween(Dot)
            .to(0.3, { scale: new Vec3(0.9, 0.9, 0.9) })
            .to(0.4, { scale: new Vec3(1, 1, 1) })
            .to(0.3, { scale: new Vec3(0.9, 0.9, 0.9) })
            .to(0.4, { scale: new Vec3(1, 1, 1) })
            .start();
    }


    resetDotColors(currentTouchedDot: Node, startDotNode: Node) {

        currentTouchedDot.children[0].getComponent(Sprite).color = new Color().fromHEX("#561DB7");
        startDotNode.children[0].getComponent(Sprite).color = new Color().fromHEX(Color.GREEN.toHEX());
        currentTouchedDot = null;
        startDotNode = null;

    }

    private currentTouchedDot: Node = null;
    private startDotNode: Node = null;
    checkTouchedDots(_touchDot: Node) {

        let status: boolean = false;

        for (var i = 0; i < this.dotContainer.children.length; i++) {
            if (_touchDot.getComponent(UITransform).getBoundingBox().intersects(this.dotContainer.children[i].getComponent(UITransform).getBoundingBox())) {

                this.currentTouchedDot = this.dotContainer.children[i];
                this.startDotNode = this.dotContainer.children[this.flowDotGeneration.startDot];
                if (this.flowDotGeneration.startDot == i) {
                    this.firstEndPoint = this.dotContainer.children[i].position.clone();
                    this.setGreenDot(i)
                    status = true;
                    break;
                }

            }
        }
        if (!status && this.currentTouchedDot != null) {
            let indx: number = this.dotContainer.children.indexOf(this.currentTouchedDot);
            console.log(indx)
            this.setRedeDot(indx);
            this.manageHeartLife();

            this.displayWrongPathAndHint(this.currentTouchedDot, this.startDotNode, this.dotContainer.children[this.flowDotGeneration.startDot + 1]);
            this.scheduleOnce(() => {
                // this.resetDotColor(indx);
                this.levelComplete();
            }, 1.5);

        }
        return status;
    }

    OnTouchMoveAction(startTouchPoint: math.Vec2) {

        if (this.touchMoveStatus) {

            let pos_x: number = startTouchPoint.x - (WIDTH / 2);
            let pos_y: number = startTouchPoint.y - (HEIGHT / 2);
            this._touchDot.setPosition(pos_x, pos_y, 0);

            if (this.firstEndPoint != null) {
                this.drawLineSegment1(this.firstEndPoint, pos_x, pos_y);
            }

            for (var i = 0; i < this.dotContainer.children.length; i++) {

                if (this._touchDot.getComponent(UITransform).getBoundingBox().intersects(this.dotContainer.children[i].getComponent(UITransform).getBoundingBox()) && i > this.flowDotGeneration.startDot) {

                    if (i != this.flowDotGeneration.startDot && i == (this.flowDotGeneration.startDot + 1)) {

                        this.setGreenDot(i);
                        this.activeProgresLine(i - 1)
                        this.flowDotGeneration.startDot = i;
                        this.startDotNode = this.dotContainer.children[i];
                        this.firstEndPoint = this.dotContainer.children[i].position.clone();
                        if (this.flowDotGeneration.startDot == this.dotContainer.children.length - 1) {
                            this.updateScore();
                            this.levelComplete()
                        }

                    } if (i != this.flowDotGeneration.startDot && i != (this.flowDotGeneration.startDot + 1)) {

                        this.currentTouchedDot = this.dotContainer.children[i];
                        this.manageHeartLife();
                        this.wrongDotTouched(this.currentTouchedDot, this.startDotNode);
                        this.displayWrongPathAndHint(this.currentTouchedDot, this.startDotNode, this.dotContainer.children[this.flowDotGeneration.startDot + 1], "movTap");

                        if (this.totalGameHealth == 0) {
                            this.gameEnd();
                        }
                    }
                }
            }

        } else {

            // this.wrongDotIntersected();
            // this.displayHintLine();
        }
    }

    private tempscore: number = 0;
    updateScore() {
        this.tempscore = this.tempscore + 100;
    }
    gameEnd() {
        director.loadScene("Flow");
    }
    private totalGameHealth: number = 2;
    manageHeartLife() {
        console.log(this.totalGameHealth, " Game health")
        this.HeartLifeContainer.children[this.totalGameHealth].getComponent(Sprite).color = new Color().fromHEX("#BEBEBE");
        this.totalGameHealth--;

    }
    levelComplete() {
        this.unscheduleAllCallbacks();
        let GraphicObj: Graphics = this.node.children[0].getComponent(Graphics);
        GraphicObj.clear();
        this.destroyAllAutoGeneratedLines();

    }
    destroyAllAutoGeneratedLines() {
        this.HideAutoDrawLine1();
    }

    HideAutoDrawLine1() {

        for (var i = 0; i < this.lineContainer.children.length; i++) {
            this.hideOpacityCall1(this.lineContainer.children[i], i);
        }

    }

    hideOpacityCall1(line: Node, indx: number) {

        let _opacity: UIOpacity = line.children[0].getComponent(UIOpacity);
        if (_opacity != null) {
            tween(_opacity)
                .to(1, { opacity: 0 })
                .call(() => {
                    if (indx == this.lineContainer.children.length - 1) {
                        this.hideDots();
                    }
                })
                .start();
        }

    }
    hideDots() {
        for (var i = 0; i < this.dotContainer.children.length; i++) {
            this.hideOpacityCallOfDots(this.dotContainer.children[i], i);
        }
    }

    hideOpacityCallOfDots(arg0: Node, i: number) {
        this.scheduleOnce(() => {
            this.TweenAction(arg0, i)
        }, i * 0.4)


    }
    TweenAction(arg0: Node, i: number) {
        tween(arg0)
            .to(0.3, { scale: new Vec3(1.1, 1.1, 1.1) })
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .to(0.2, { scale: new Vec3(0, 0, 0) })
            .start();

        let _opacity: UIOpacity = arg0.getComponent(UIOpacity);
        if (_opacity != null) {
            tween(_opacity)
                .to(0.8, { opacity: 0 })
                .call(() => {
                    if (i == this.dotContainer.children.length - 1) {
                        this.destroyDotsAndLines();
                    }
                })
                .start();
        }
    }
    destroyDotsAndLines() {

        this.dotContainer.destroyAllChildren();
        this.dotContainer.removeAllChildren();
        this.lineContainer.destroyAllChildren();
        this.lineContainer.removeAllChildren();
        this.resetGamedata();
    }

    /** Regenerating levels */

    resetGamedata() {

        this.flowDotGeneration.startDot = -1;
        this.lineRun = false;
        this.dist_Array = [];
        this._touchDot = null;
        this.touchMoveStatus = false;
        this.firstEndPoint = null;
        this.OnTouchTouchEnable = false;
        this.currentTouchedDot = null;
        this.startDotNode = null;
        this.startindx = 0;
        this.progressbarCount = false;
        Tween.stopAll();
        this.generteGameScene();

    }

    displayWrongPathAndHint(currentTouchedDot: Node, startDotNode: Node, nextDotNode: Node, tapstatus?: String) {

        this.touchMoveStatus = false;
        /** draw line on wrong attempt */
        if (tapstatus == "movTap") {
            this.drawLineSegment1(currentTouchedDot.position.clone(), startDotNode.position.x, startDotNode.position.y, "RedLine");
        }

        let dotLineNode: Node = this.flowDotGeneration.generateDotLine();
        dotLineNode.getComponent(Sprite).color = Color.GREEN;
        let distBetweenLine: number = this.distanceBtPoints(startDotNode.position.clone(), nextDotNode.position.clone());
        let midPoint: Vec3 = this.midPointBetweenPoints(startDotNode.position.clone(), nextDotNode.position.clone());
        let angle: number = this.angleBetweenDots(startDotNode.position.clone(), nextDotNode.position.clone());

        dotLineNode.setPosition(midPoint);
        dotLineNode.eulerAngles = (new Vec3(0, 0, angle));
        dotLineNode.getComponent(UITransform).setContentSize(size(distBetweenLine, 10));
        dotLineNode.addComponent(UIOpacity)
        this.lineContainer.addChild(dotLineNode);
        this.scheduleOnce(() => {
            this.destroyHintLine(dotLineNode);
        }, 1);

    }

    destroyHintLine(dotLineNode: Node) {
        dotLineNode.destroy();
    }


    activeProgresLine(i: number) {

        if (this.lineContainer.children[i]) {
            this.lineContainer.children[i].children[0].getComponent(UIOpacity).opacity = 255;
            this.lineContainer.children[i].children[0].getComponent(Sprite).color = new Color().fromHEX(Color.GREEN.toHEX());
        }
    }

    resetDotColor(i: number) {
        this.dotContainer.children[i].children[0].getComponent(Sprite).color = new Color().fromHEX("#561DB7");//purple
    }
    setGreenDot(i: number) {
        this.dotContainer.children[i].children[0].getComponent(Sprite).color = new Color().fromHEX(Color.GREEN.toHEX());
    }
    setRedeDot(i: number) {
        this.dotContainer.children[i].children[0].getComponent(Sprite).color = new Color().fromHEX("#F44336");
    }


    drawLineSegment1(firstEndPoint: Vec3, pos_x: number, pos_y: number, state?: String) {

        let GraphicObj: Graphics = this.node.children[0].getComponent(Graphics);
        if (GraphicObj) {

            GraphicObj.clear();
            GraphicObj.moveTo(firstEndPoint.x, firstEndPoint.y);
            GraphicObj.lineTo(pos_x, pos_y);
            GraphicObj.lineWidth = 15;
            GraphicObj.strokeColor.fromHEX(Color.GREEN.toHEX());
            if (state == "RedLine") {
                GraphicObj.strokeColor.fromHEX(Color.RED.toHEX());
            }
            GraphicObj.close();
            GraphicObj.stroke();
            GraphicObj.fill();
        }
    }

    OnTouchEndAction(startTouchPoint: math.Vec2) {
        let GraphicObj: Graphics = this.node.children[0].getComponent(Graphics);
        if (GraphicObj) {
            GraphicObj.clear();
        }
        if (this.flowDrawLine.node.children.length > 0) {
            this.flowDrawLine.node.destroyAllChildren();
            this.flowDrawLine.node.removeAllChildren();
        }
        this.startDotNode = null;
        this.currentTouchedDot = null;

    }

    PauseMenuClick() {
        //this.node.active = false;
        this.PauseMenuNode.active = true;
        this.pauseGameEvents();
    }
    pauseGameEvents() {
        this.progressbarCount = false;
    }
    resumeClick() {
        //this.node.active = true;
        this.PauseMenuNode.active = false;
        this.resumeGameEvents();
    }
    resumeGameEvents() {
        this.progressbarCount = true;
    }
    RestartClick() {

    }
    HomeClick() {
        director.loadScene("Flow");
    }
}

