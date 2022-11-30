
import { _decorator, Component, Vec2, UITransform, Node, Sprite, SpriteFrame, Vec3, Label, Color, v2, utils, Prefab, instantiate, UIOpacity, size, tween, Rect } from 'cc';
import { FlowGameManager } from './FlowGameManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = FlowDotGenertion
 * DateTime = Sun Oct 16 2022 20:26:00 GMT+0530 (India Standard Time)
 * Author = irshad
 * FileBasename = FlowDotGenertion.ts
 * FileBasenameNoExtension = FlowDotGenertion
 * URL = db://assets/FlowDotGenertion.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

@ccclass('FlowDotGenertion')
export class FlowDotGenertion extends Component {

    /** Dot Asset */
    @property(SpriteFrame)
    dotImageSpriteWhite: SpriteFrame | null = null;

    @property(SpriteFrame)
    dotImageSpritePurple: SpriteFrame | null = null;

    @property(FlowGameManager)
    flowGameManager: FlowGameManager | null = null;

    @property(Prefab)
    dotLinePrefab: Prefab | null = null;

    @property(Node)
    dot1: Node = null;

    @property(Node)
    dot2: Node = null;

    startDot: number = -1;


    start() {

    }

    dotPosition_Array: Array<Vec2> = [];
    generateRandomDots(i: number) {

        let points: Vec2 = this.random_XY_Pos();

        if (this.node.children.length > 0) {
            {
                for (var k = 0; k < this.node.children.length; k++) {
                    if (this.node.children[k].getComponent(UITransform).getBoundingBox().intersects(new Rect(points.x, points.y, 100, 100))) {
                        this.generateRandomDots(i);
                        console.log("true call")
                        return;
                    }
                }
            }
        }

        this.dotPosition_Array.push(points);
        this.generateDotSprite(i);

        if (this.node.children.length != 0) {
            this.startDot = 0;
        }

    }

    generateDotSprite(indx: number) {

        let dotNode: Node = new Node("dot_" + indx);
        dotNode.layer = this.node.layer;
        dotNode.addComponent(UITransform);
        dotNode.addComponent(Sprite);
        dotNode.addComponent(UIOpacity);
        dotNode.getComponent(Sprite).spriteFrame = this.dotImageSpriteWhite;
        dotNode.getComponent(UITransform).setContentSize(size(100, 100));
        dotNode.setPosition(this.dotPosition_Array[indx].x, this.dotPosition_Array[indx].y, 0);

        /** Small Circle */
        let dotChildNode: Node = new Node("dot_" + indx);
        dotChildNode.layer = this.node.layer;
        dotChildNode.addComponent(UITransform);
        dotChildNode.addComponent(Sprite);
        dotChildNode.addComponent(UIOpacity);
        dotChildNode.getComponent(Sprite).spriteFrame = this.dotImageSpriteWhite;
        dotChildNode.getComponent(Sprite).color = new Color().fromHEX("#561DB7");
        dotChildNode.getComponent(UITransform).setContentSize(size(87, 87));
        dotNode.addChild(dotChildNode);

        // let temp = new Node();
        // temp.addComponent(Label);
        // temp.layer = this.node.layer;
        // temp.getComponent(Label).string = indx.toString();
        // temp.getComponent(Label).color = Color.BLACK;
        // dotNode.getComponent(UIOpacity).opacity = 0;
        // dotNode.addChild(temp);
        
        dotNode.setScale(0, 0, 0);
        this.node.addChild(dotNode);
        this.scheduleOnce(() => {
            this.OpacityTweenAction(dotNode);
        }, indx * 0.2);

    }

    OpacityTweenAction(dotNode: Node) {


        tween(dotNode.getComponent(UIOpacity))
            .to(0.2, { opacity: 255 })
            .call(() => {
                this.popDot(dotNode);
            })
            .start();

    }

    popDot(dotNode: Node) {
        tween(dotNode).to(0.1, { scale: new Vec3(1.1, 1.1, 1.1) })
            .to(0.1, { scale: new Vec3(0.9, 0.9, 0.9) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    random_XY_Pos(): Vec2 {

        let x_Pos: number = (Math.random() * 470 + 100) - 360;
        let y_Pos: number = (Math.random() * 850 + 150) - 640;
        return new Vec2(x_Pos, y_Pos);

    }
    generateDotLine(): Node {
        return instantiate(this.dotLinePrefab);
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
