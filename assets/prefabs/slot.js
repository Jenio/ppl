var Config=require('Config');
cc.Class({
    extends: cc.Component,

    properties: {
        drop:cc.Node,
        stone:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    setStone(){
        this.stone.active=true;
        this.drop.active=false;
    },
    setLevel(n){
        this.stone.active=false;

        if(n==0){
            this.drop.active=false;
        }else{
            this.drop.getComponent('drop').setLevel(n);
        }
    },
    dropOneDrop(){
        if(this.stone.active)return;

        if(this.drop.active){
            this.drop.getComponent('drop').addOneDrop();
        }else{
            this.setLevel(1);
        }
        Config.chekeGameOverTimmer=0.7

    },
    // update (dt) {},
});
