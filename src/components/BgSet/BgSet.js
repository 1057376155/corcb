import React, { Component } from 'react'
import http from '../../api/http';
import './BgSet.less'
import { connect } from 'react-redux';
import * as PicAction  from '../../store/pic/action';
import * as WindowAction  from '../../store/window/action';
import Unsplash, { toJson } from 'unsplash-js';
import Window from '../Window/Window';
import localforage from 'localforage'
import chrome from '../../config/chromeOp'
class BgSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pics: [],
            canGet:true,//是否能够再次请求,
            test:true,//
            selectImgType:1,//选择的图片类型
            unsplash:new Unsplash({
                applicationId: "fa60305aa82e74134cabc7093ef54c8e2c370c47e73152f72371c828daedfcd7",
            }),
            index:0,//鼠标正在浏览哪个 图片
            itemStyle:{},
            fnBarShow:false,//
        }
        this.phone_type=[
            {name:'最新壁纸',id:1,fn:'collectionsFN'},
            {name:'壁纸精选',id:2,fn:'listPhotos'},
            {name:'随机壁纸',id:3,fn:'getRandomPhoto'},
            {name:'隐藏左栏',id:-1,fn:'fNBarChange'}
        ]
        this.resize=false
        this.page=1;
    }
    componentWillMount() {
        //即将渲染
        
    }
    componentDidMount() {
        this.init()
    }
    async componentWillReceiveProps(nextProps){
        this.resize=nextProps.windowids.windowIds[nextProps.id].resize
        if(this.page!=await localforage.getItem('bgPageNumber')){
            this.init();
        }
        this.setState({
            fnBarShow:await localforage.getItem('fnBarShow')
        })
        
    }
    componentWillUpdate(){

    }
    componentDidUpdate(){
        
    }
    async init() {
        //初始化函数
        this.page=await localforage.getItem('bgPageNumber');
        var bgSelectType=await localforage.getItem('bgSelectType');
        var fnBarShow=await localforage.getItem('fnBarShow')

        if(bgSelectType&&bgSelectType.fnName){
            this.setState({
                selectImgType:bgSelectType.selectImgType,
                fnBarShow:fnBarShow
            })
            this[bgSelectType.fnName]();
        }else{
            this[this.phone_type[this.state.selectImgType-1].fn]();
        }
        
    }
    
    listPhotos(){
        //精选壁纸
        this.setState({
            pics:[]
        })
        this.props.winFN.Msg({show:true,text:'正在加载'})
        this.state.unsplash.collections.listFeaturedCollections(this.page,10).then(toJson).then(json => {
              this.props.winFN.Msg({show:false,text:'正在加载'})
              var arr=[]
              json.forEach((item,index)=> {
                  item.preview_photos.forEach((it2,in2)=>{
                    arr.push({urls:it2.urls,links:it2.links})
                  })
              });
              this.setState({
                pics:arr
              })
          })
    }
    getRandomPhoto(){
        //获取随机图片
        this.setState({
            pics:[]
        })
        if(!this.state.canGet)return;
        this.props.winFN.Msg({show:true,text:'正在加载'})
        this.state.unsplash.photos.getRandomPhoto({count:30}).then(toJson).then(json => {
          this.props.winFN.Msg({show:false,text:'正在加载'})
        //   this.page=this.page+1
          this.setState({
            pics:json
          })
            
        })
    }
    collectionsFN(){
        this.props.winFN.Msg({show:true,text:'正在加载'})
        // this.state.unsplash.photos.listCuratedPhotos(this.state.page, 30)
        this.state.unsplash.photos.listPhotos(this.page, 30)
        .then(toJson)
        .then(json => {
            this.props.winFN.Msg({show:false,text:'正在加载'})
            // this.page=this.page+1
            this.setState({
                pics:json
            })

        })
    }
    ScrollFN(e){
        //滑动事件
        if(Math.ceil(e.target.scrollTop+e.target.clientHeight)==e.target.scrollHeight){
            // this.getPics()
            this.collectionsFN();
        }
        
    }
    fNBarChange(e){
        //隐藏或者显示左栏
        e.stopPropagation();
        this.setState({
            fnBarShow:!this.state.fnBarShow
        })
        localforage.setItem('fnBarShow',!this.state.fnBarShow)
    }
    imgOnloadFN(){
   
    }
    getPicId(src){
        var startIndex=src.lastIndexOf("-")+1;
        var endIndex=src.lastIndexOf(".")
        return src.substring(startIndex,endIndex)
    }
    lookBigPic(item){
        this.props.setPic({currentPic:item.urls.full,pics:this.state.pics})
        this.props.setWinState({windowName:'ImgBrowser',windowState:{close:true}})
    }
    openLink(item){
        window.open('https://unsplash.com/@'+item.user.username+'?utm_source=corcb&utm_medium=referral')
    }
    preImg(){
        //上一页
        if(this.page==1){
            this.props.winFN.Msg({show:true,text:'前面没有了!!!',timeout:2000})
            return;
        }
        this.page=this.page-1
        this[this.phone_type[this.state.selectImgType-1].fn]();
        localforage.setItem('bgPageNumber',this.page)
    }
    nextImg(){
        // 下一页
        this.page=this.page+1
        this[this.phone_type[this.state.selectImgType-1].fn]();
        localforage.setItem('bgPageNumber',this.page)
    }
    selectType(item,index,e){
        //选择类型
        e.stopPropagation();
        this.setState({
            selectImgType:item.id<0?this.state.selectImgType:item.id
        })
        this.page=1
        localforage.setItem('bgPageNumber',this.page)
        if(this.phone_type[index].fn=='fNBarChange'){
            this[this.phone_type[index].fn](e);
            return;
        }else{
            this[this.phone_type[index].fn]();
        }
        localforage.setItem('bgSelectType',{
            fnName:this.phone_type[index].fn,
            selectImgType:item.id<0?this.state.selectImgType:item.id
            }
        )
        // console.log(item,'item')
    }
    downloadImg(item,type){
        //下载图片
        chrome.downloads.download({url:item.urls[type]})
    }
    render() {
        // var isShow = this.props.state.bgP.isShow
        
        var isShow=false;
        return (
            <div 
            // onScroll={this.ScrollFN.bind(this)} 
            className={['BgSet', isShow ? 'active' : 'hide',this.state.fnBarShow?'fnBarShow':''].join(' ')} >
                <div className="phone_type">
                    {this.phone_type.map((item,index)=>{
                        return(
                            <p 
                            key={index}
                            onClick={this.selectType.bind(this,item,index)}
                            className={[item.id==this.state.selectImgType?'active':'']}>
                                {item.name}
                            </p>
                        )
                    })}
                </div>
                <div className={["fnBarIcon"]} onClick={this.fNBarChange.bind(this)}>
                    <img src={require('../../img/arrow.svg')} alt=""/>
                </div>
                <div className="Waterfall_item">
                    <div className="Waterfall_item_item">
                    <div className="Waterfall_item_item_item">
                        {
                            this.state.pics.map((item,index)=>{
                                return (
                                    <div className="pics_item_pic_item" key={index}>
                                        {/* <div className="user" onClick={this.openLink.bind(this,item)}>
                                            {item.user.username}
                                        </div> */}
                                        <img key={index} 
                                        draggable="false"
                                        onError={this.imgOnloadFN.bind(this)} 
                                        onLoad={this.imgOnloadFN.bind(this)} 
                                        index={index} 
                                        src={item.urls.small}
                                        onClick={this.lookBigPic.bind(this,item)}
                                        />
                                        <div  className="download_img" >
                                            <span onClick={this.downloadImg.bind(this,item,'full')}>下载图片</span>
                                            <span onClick={this.downloadImg.bind(this,item,'raw')}>下载原图</span>
                                            
                                            {/* <a href={item.urls.full} download="pic">下载</a>  */}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    </div>
                    <div className="page_button">
                        <span className={this.state.selectImgType==3?'hide':''} onClick={this.preImg.bind(this)}>上一页</span>
                        <span className={this.state.selectImgType==3?'hide':''}>{this.page}</span>
                        <span className={this.state.selectImgType==3?'hide':''} onClick={this.nextImg.bind(this)}>下一页</span>
                        <span className={this.state.selectImgType!=3?'hide':''} onClick={this.getRandomPhoto.bind(this)}>随机更换</span>
                    </div>
                </div>
                
                
            </div>
        )
    }
} 

function getState(state) {
    return {
        state: state
    }
}
BgSet = connect(getState,{...PicAction,...WindowAction})(BgSet)
BgSet=Window({title:"壁纸"})(BgSet);
export default BgSet
