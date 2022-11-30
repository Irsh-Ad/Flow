
import { _decorator, Component, Node, Event, SystemEvent, SystemEventType, __private, EventTouch, Vec2 } from 'cc';
import { FlowGameManager } from './FlowGameManager';

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = FlowDrawLine
 * DateTime = Tue Nov 01 2022 22:35:40 GMT+0530 (India Standard Time)
 * Author = irshad
 * FileBasename = FlowDrawLine.ts
 * FileBasenameNoExtension = FlowDrawLine
 * URL = db://assets/Flow/FlowDrawLine.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

@ccclass('FlowDrawLine')
export class FlowDrawLine extends Component {

    @property(Node)
    dotContainer: Node | null = null;

    @property({ type: FlowGameManager })
    flowGameManager: FlowGameManager | null = null;



    start() {
        //this.addTouchEventstoDots();
    }

    addTouchEventstoDots() {
        if (!this.node.hasEventListener(Node.EventType.TOUCH_START, this.onTouchStart, this)) {
            this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }
    }


    onTouchStart(event: EventTouch) {
        console.log("tousch Start")
        if (this.node.children.length > 0) {
            this.node.destroyAllChildren();
            this.node.removeAllChildren();
        }
        let startTouchPoint: Vec2 = event.getUILocation();
        this.flowGameManager.OnTouchStartAction(startTouchPoint);
    }
    onTouchMove(event: EventTouch) {
        let startTouchPoint: Vec2 = event.getUILocation();
        this.flowGameManager.OnTouchMoveAction(startTouchPoint);
    }
    onTouchEnd(event: EventTouch) {
        let startTouchPoint: Vec2 = event.getUILocation();
        this.flowGameManager.OnTouchEndAction(startTouchPoint);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */
