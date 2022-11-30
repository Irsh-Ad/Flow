
import { _decorator, Component, Node, Animation, Label } from 'cc';
import { FlowGameManager } from './FlowGameManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = FlowMainMenu
 * DateTime = Sun Nov 13 2022 17:36:03 GMT+0530 (India Standard Time)
 * Author = irshad
 * FileBasename = FlowMainMenu.ts
 * FileBasenameNoExtension = FlowMainMenu
 * URL = db://assets/Script/FlowMainMenu.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

@ccclass('FlowMainMenu')
export class FlowMainMenu extends Component {

    @property(Node)
    timerCountLabel: Node | null = null;

    @property(Node)
    getReady: Node | null = null;
    @property(Node)
    Go: Node | null = null;
    @property(Node)
    timerPanel: Node | null = null;

    @property({ type: FlowGameManager })
    flowGameManager: FlowGameManager | null = null;


    start() {
        // [3]
    }

    onPlayButtonClick() {
        this.node.children[0].active = false;
        this.activeTimerPanel();
    }
    activeTimerPanel() {
        this.Go.active = false;
        this.timerCountLabel.active = false;
        this.getReady.active = true;
        this.timerPanel.active = true;
        this.getReady.getComponent(Animation).play("countAnim");
        this.scheduleOnce(() => {
            this.timerCountLabel.active = true;
            this.timerCountLabel.getComponent(Animation).play("countAnim");
            this.timerCountLabel.getComponent(Label).string = this.timeCount.toString();
            this.isTimerActivated = true;
        }, 0.8)
    }

    private timer: number = 0;
    private timeCount: number = 3;
    private isTimerActivated: boolean = false;

    update(deltaTime: number) {

        if (this.isTimerActivated) {
            this.timer += deltaTime
            if (this.timer > 1) {
                this.timeCount--;
                this.timer = 0;
                this.countdownTimer(this.timeCount);
            }
        }

    }
    countdownTimer(timeCount: number) {

        if (timeCount > 0) {
            this.timerCountLabel.getComponent(Animation).play("countAnim");
            this.timerCountLabel.getComponent(Label).string = this.timeCount.toString();
        }
        if (timeCount == 0) {
            this.getReady.getComponent(Animation).play("hideAnim");
            this.timerCountLabel.active = false;
            this.Go.active = true;
            this.Go.getComponent(Animation).play("countAnim");
        }
        if (timeCount == -1) {
            this.isTimerActivated = false;
            this.loadGame();
        }
    }

    loadGame() {
        this.node.active = false;
        this.flowGameManager.node.active = true;
        this.flowGameManager.generteGameScene();
    }
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
