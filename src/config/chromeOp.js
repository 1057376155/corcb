var chrome={
    noChrome:true,
    tabs:{
        onCreated:{addListener:function(){}},
        update(){},
        getAllInWindow(){},
        onUpdated:{addListener:function(){}},
        onRemoved:{addListener:function(){}},
        onSelectionChanged:{addListener(){}}
    },
    system:{
        cpu:{getInfo(){}},
        memory:{getInfo(){}}
    },
    downloads:{
        download(){}
    }
}
                                                                              
export default chrome