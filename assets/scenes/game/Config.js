module.exports={
    initLocalStorageItems:function(string){
        let temp = localStorage.getItem(string);
        if (temp) {
            temp = parseInt(temp);
        } else {
            temp = 0;
        }
        this[string] = temp;
    },
    gameStop:false,
    chekeGameOverTimmer:1.5,
    adventureMode:true,
}