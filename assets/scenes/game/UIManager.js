var Config = require('Config');
cc.Class({
    extends: cc.Component,

    properties: {
        menuScene: cc.Node,
        gameScene: cc.Node,
        selectionScene: cc.Node,
        maskNode: cc.Node,

        gameOverPanelPrefab: cc.Prefab,
        scorePanelPrefab:cc.Prefab,
        nextLevelPanelPrefab: cc.Prefab,
        nowActivePanel: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init() {

    },
    start() {

    },

    showMenuScene() {
        this.removeNowActivePanel(
            ()=>{
                this.showMenuSceneWithCallback(null);
            }
        );

       
    },
    showMenuSceneWithCallback(callback) {
        this.removeNowActivePanel();
        console.log('showMenuSceneWithCallback', callback)
        this.maskMoveTransition(() => {
            this.closeAllScene();
            this.menuScene.active = true;
            if (callback) callback();
        })
    },
    showGameScene() {
        this.maskMoveTransition(() => {
            this.closeAllScene();
            this.gameScene.active = true;
        })
    },
    showSelectionScene() {
        this.maskMoveTransition(() => {
            this.closeAllScene();
            this.selectionScene.active = true;
        })
    },
    closeAllScene() {
        this.menuScene.active = false;
        this.gameScene.active = false;
        this.selectionScene.active = false;
    },
    showGameOverPanel(score) {
        let node = cc.instantiate(this.gameOverPanelPrefab);
        node.parent = this.node;
        node.position = cc.v2(0, -2000);
        node.runAction(cc.moveTo(.5, 0, 200));
        this.nowActivePanel = node;
        node.getChildByName('score').getComponent(cc.Label).string=score;
        // node.getChildByName('menuButton').on('touchend', function () {
        //     this.removeNowActivePanel(
        //         ()=>{
        //             this.showMenuSceneWithCallback();
        //         }
        //     );

        // }, this);

        node.getChildByName('startButton').on('touchend', function () {

            this.removeNowActivePanel(
                ()=>{
                    Config.gameStop = false;
                    Config.GP.gameRestart();
                    node.destroy();
                    this.nowActivePanel = null;
                }
            );


       
        }, this)
        //.easing(cc.easeOut())
    },
    showScorePanel(score,bool) {

        let node = cc.instantiate(this.scorePanelPrefab);
        node.parent = this.node;
        node.position = cc.v2(0, -2000);
        node.runAction(cc.moveTo(.5, 0, 200));
        this.nowActivePanel = node;
        node.getChildByName('scoreLabel').getComponent(cc.Label).string=score;

        node.getChildByName('OKButton').on('touchend', function () {
            this.removeNowActivePanel(
                ()=>{
                    this.showGameOverPanel();
                }
            );

        }, this);
    },
    showNextLevelPanel(score){
        Config.GP.selectionRefresh();
        console.log('show showNextLevelPanel panel')
        let node = cc.instantiate(this.nextLevelPanelPrefab);
        node.parent = this.node;
        node.position = cc.v2(0, -2000);
        node.runAction(cc.moveTo(.5, 0, 300));
        this.nowActivePanel = node;

        node.getChildByName('score').getComponent(cc.Label).string=score;

        node.getChildByName('startButton').on('touchend', function () {
           
            this.removeNowActivePanel(
                ()=>{
                    Config.gameStop = false;
                    Config.GP.gameRestart();
                }
            );
        }, this)

        node.getChildByName('nextLevelButton').on('touchend', function () {
            this.removeNowActivePanel(
                ()=>{
                    if(Config.GP.level==16){
                        this.showMenuSceneWithCallback();
                    }else{
                        Config.gameStop = false;
                        Config.GP.nextLevel();
                    }
                }
            );
        }, this)
    },
    removeNowActivePanel(callback) {
        console.log('removeNowActivePanel', callback)
        if (this.nowActivePanel) {
            this.nowActivePanel.runAction(
                cc.sequence(
                    cc.moveTo(.7, 0, -2000).easing(cc.easeBackIn()),
                    cc.callFunc(
                        function () {
                            this.nowActivePanel.destroy();
                            this.nowActivePanel = null;

                            if (callback) callback();
                        }, this
                    )
                )
            )
        }else{
            if (callback) callback();
        }
    },
    maskMoveTransition(callback) {
        let a1 = Math.random() * Math.PI * 2;
        let a2 = Math.random() * Math.PI * 2;
        let duration=0.3;
        let distance = 3000;
        this.maskNode.x = distance * Math.cos(a1);
        this.maskNode.y = -distance * Math.sin(a1);
        this.maskNode.runAction(
            cc.sequence(
                cc.moveTo(duration, 0, 0),
                cc.callFunc(callback, this),
                cc.moveTo(duration, distance * Math.cos(a2), -distance * Math.sin(a2)),
            )
        )
    },
    fadeInOutTransition(callback) {
        this.maskNode.x = 0;
        this.maskNode.y = 0;
        this.maskNode.opacity = 0;
        this.maskNode.runAction(
            cc.sequence(
                cc.fadeIn(.5),
                cc.callFunc(callback, this),
                cc.fadeOut(.5),
                cc.callFunc(function () {
                    this.maskNode.opacity = 255;
                    this.maskNode.x = 2000;
                }, this),

            )
        )
    }
    // update (dt) {},
});
