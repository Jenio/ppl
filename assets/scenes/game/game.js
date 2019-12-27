var Config = require('Config');
var missionInfo=require('missionInfo');
cc.Class({
    extends: cc.Component,

    properties: {
        playground: cc.Node,
        selectionContent: cc.Node,
        slotPrefab: cc.Prefab,
        selectionItemPrefab: cc.Prefab,
        _slotArray: [],
        _selectionItemsArray: [],
        level: 1,
        levelLabel:cc.Label,
        step: 1,
        stepLabel: cc.Label,
        score:0,
        scoreLabel:cc.Label,
        
        UIManager: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
    },

    start() {
        Config.GP = this;

        this.playgroundInit();
        // this.initLevel(1);
        this.selectionInit();
        this.selectionRefresh();
    },
    selectionInit() {
        let startPosition = cc.v2(-this.selectionContent.width/2+100+12,this.selectionContent.height/2-100-50);
        let deltaX = 170;
        let deltaY = 220;
        let rol = 4;
        for (let i = 0; i < 16; i++) {
            let item = cc.instantiate(this.selectionItemPrefab);
            let x = i % rol;
            let y = Math.floor(i / rol);
            item.getChildByName('label').getComponent(cc.Label).string=i+1;
            item.parent = this.selectionContent;
            item.position=startPosition.add(cc.v2(x*deltaX,-y*deltaY));
            item.index=i;
            item.on('touchend',this.selectionTouch,this);
        }


    },
    selectionRefresh() {
        let info=this.getMissionInfo();
        let children=this.selectionContent.children;
        for(let i=0;i<children.length;i++){
            let item = children[i];
            if(info[i].unlock){
                item.getChildByName('lock').active=false;
                // item.getChildByName('stars').active=true;
                // let stars= item.getChildByName('stars').children;
                // if(info[i].isComplete){
                //     for(let j = 0;j<3;j++){
                //         stars[j].active=j<info[i].startNumbers;
                //     }
                // }
            }else{
                item.getChildByName('lock').active=true;
                // item.getChildByName('stars').active=false;
            }
        }
        console.log(this.selectionContent)
    },
    playgroundInit() {
        let slotInitArray = [
            0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0,
            0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
            0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
            1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
            0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
            0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
            0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0,

        ];


        let width = 140;
        let height = 126;
        let start = cc.v2(-370, 317)
        for (let i = 0; i < slotInitArray.length; i++) {
            let y = Math.floor(i / 13);
            let x = i % 13;
            if (slotInitArray[i]) {
                let slot = cc.instantiate(this.slotPrefab);
                slot.x = start.x + x * 61;
                slot.y = start.y - y * 106
                slot.parent = this.playground;
                slot.name = `(${x},${y})`;
                slot.on('touchend', function () {
                    console.log('touchend')
                    if (Config.gameStop) return;
                    if (this.step === 0) return;
                    this.step--;
                    this.stepLabel.string = this.step;
                    slot.getComponent('slot').dropOneDrop();
                }, this)
                this._slotArray.push(slot);
            } else {
                this._slotArray.push(null);
            }

        }
    },
    startInfiniteMode() {
        Config.adventureMode = false;
        this.UIManager.getComponent('UIManager').showGameScene();
        this.initLevel(1);

        console.log('start infinite mode', 'Config.adventureMode:', Config.adventureMode)
    },
    selectionTouch(e){
        this.startAdventureMode(e.target.index)
    },
    startAdventureMode( str) {
        Config.adventureMode = true;
        let level = parseInt(str)+1;
        this.UIManager.getComponent('UIManager').showGameScene();
        this.initLevel(level);
        this.level=level;
        console.log('start adventure mode', 'Config.adventureMode:', Config.adventureMode)

    },
    gameStart() { },
    gameRestart() {
        if (Config.gameStop) return;
        if(Config.adventureMode){
            this.initLevel(this.level);
        }else{
            this.initLevel(1)
        }

    },
    gameOver() {
        ///- show gameover Panel
        if (Config.gameStop) return;
        Config.gameStop = true;
        console.log('game Over')
            this.UIManager.getComponent('UIManager').showGameOverPanel(this.score);

        //-- #if infinited Mode  record highest score;
    },
    checkIsComplete() {
        //---  any drops in playground
        let hasDrop = false;
        for (let i = 0; i < this._slotArray.length; i++) {
            let slot = this._slotArray[i];
            if (slot) {
                hasDrop = hasDrop || slot.getComponent('slot').drop.active;
            }
        }
        return !hasDrop;
    },
    update(dt) {
        if (Config.gameStop) return;
        Config.chekeGameOverTimmer -= dt;
        if (Config.chekeGameOverTimmer < 0) {
            Config.chekeGameOverTimmer = 1.5;
            let isComplete = this.checkIsComplete();
            if (isComplete) {
                Config.gameStop = true;
                console.log('mission complete,adventureMode:', Config.adventureMode)

                if (Config.adventureMode) {

                    //--- local storage 
                    let mission=this.getMissionInfo();
                    mission[this.level-1].isComplete=true;
                    if(mission[this.level]){
                        mission[this.level].unlock=true;
                    }
                    this.setMissionInfo(mission);
                    //--- show next level panel
                    this.UIManager.getComponent('UIManager').showNextLevelPanel(this.score);

                } else {
                    this.nextLevel();
                }
            } else {
                if (this.step <= 0) this.gameOver();
            }
        }
    },
    nextLevel() {
        console.log('level up')
        this.level++;
        this.initLevel(this.level)
    },
    initLevel(n) {
        this.level=n;
        let stoneNumber = 0;
        if (Config.adventureMode) {
            this.step = 20;
            this.score=0;
        } else {
            this.step += 6;

        }
        this.levelLabel.string=this.level;
        this.stepLabel.string = this.step;
        this.scoreLabel.string=this.score;
        Config.gameStop = false;
        //---- init again
        for (let i = 0; i < this._slotArray.length; i++) {
            let y = Math.floor(i / 13);
            let x = i % 13;
            if (this._slotArray[i]) {
                this._slotArray[i].getComponent('slot').setLevel(Math.floor(Math.random() * 7));
            } else {
            }

        }

        for (let i = 0; i < stoneNumber; i++) {
            this.setSton();
        }
    },
    setSton() {
        let random = Math.floor(Math.random() * this._slotArray.length);
        if (this._slotArray[random] && !this._slotArray[random].getChildByName('stone').active) {
            this._slotArray[random].getComponent('slot').setStone();
        } else {
            this.setSton();
        }
    },
    setMissionInfo(info) {
        localStorage.setItem('missionInfo', JSON.stringify(info));
    },
    getMissionInfo() {
        let info = localStorage.getItem('missionInfo');
        if (info) {
            info = JSON.parse(info);
        } else {
            info = missionInfo;
        }
        return info;
    },
    getScore(n){
        this.score+=n;
        this.scoreLabel.string=this.score;
    }
});
