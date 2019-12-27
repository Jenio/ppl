var Config=require('Config');
cc.Class({
    extends: cc.Component,

    properties: {
        level:0,
        bulletPrefab:cc.Prefab,
        frames:[cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setLevel(n){
        //---  set level by scale or sprite 
        if(!this.node.active){
            this.node.active=true;
            // this.node.scale=0;
        }
        this.level=n;
        // this.node.runAction(cc.scaleTo(0.6,0.16*n).easing(cc.easeBounceOut()))
        this.node.runAction(cc.sequence(
            cc.scaleTo(.1,1.1),
            cc.scaleTo(.2,1).easing(cc.easeBackOut())
        ));
        this.node.getComponent(cc.Sprite).spriteFrame=this.frames[n-1];
        console.log('set frame :',n)
    },
    addOneDrop(){
        Config.GP.getScore(1);
        if(this.level==6){
            this.explode();
        }else{
            this.setLevel(this.level+1);
        }
    },
    explode(){
        Config.GP.getScore(5);
        this.node.active=false;
        for(let i=0;i<6;i++){
            let bullet = cc.instantiate(this.bulletPrefab);
            bullet.parent=Config.GP.playground;
            bullet.position=this.node.parent.position;
            let angle=i*Math.PI/3;
            let distance=2000;
            bullet.rotation=angle*180/Math.PI;
            bullet.runAction(cc.sequence(
                cc.moveBy(2,cc.v2(distance*Math.cos(angle),distance*-Math.sin(angle))),
                cc.callFunc(function(){
                    bullet.destroy();
                },this)
            ))
            
        }
        Config.chekeGameOverTimmer=0.7;
    },
    // update (dt) {},
});
