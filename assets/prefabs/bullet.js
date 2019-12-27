
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onCollisionEnter(other,self){
        if(other.node.group==='drop'){
            other.node.getComponent('drop').addOneDrop();
           
        }
        this.node.destroy();
    },
    start () {

    },

    // update (dt) {},
});
