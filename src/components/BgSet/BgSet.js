import React, { Component } from 'react'
import http from '../../api/http';
import './BgSet.less'
import { connect } from 'react-redux'
import * as PicAction  from '../../store/pic/action';
import * as WindowAction  from '../../store/window/action';
import Unsplash, { toJson } from 'unsplash-js';
import Window from '../Window/Window';
import Waterfall from '../Waterfall/Waterfall'
class BgSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pics: [],
            page:1,
            canGet:true,//是否能够再次请求,
            test:true,//
            unsplash:new Unsplash({
                applicationId: "fa60305aa82e74134cabc7093ef54c8e2c370c47e73152f72371c828daedfcd7",
            }),
            index:0,//鼠标正在浏览哪个 图片
            itemStyle:{}
        }
        this.resize=false
    }
    componentWillMount() {
        //即将渲染
        
        this.init()
    }
    componentDidMount() {
        
    }
    componentWillReceiveProps(nextProps){
        this.resize=nextProps.windowids.windowIds[nextProps.id].resize
        //为了性能的考虑 在拖拉的时候只有第一次 会触发大小变化的字段 结束的时候改变变化 拖拉缩小放大的时候 不会改变
        var time=setInterval(()=>{
            if(this.resize){
                this.refs.Waterfall.init();//重新排列
            }else{
                clearInterval(time)
            }
        },300)
    }
    componentWillUpdate(){

    }
    componentDidUpdate(){
        if(this.resize){
            setTimeout(()=>{
                this.refs.Waterfall.init();//重新排列
            },300)
        }
        
    }
    init() {
        //初始化函数
        this.setState({
            isloadImgNum:0
        })
        // this.getPics();
        // this.listPhotos(); 
        this.collectionsFN();
        
    }
    listPhotos(){
        //
        this.state.unsplash.photos.listPhotos(1,30).then(toJson).then(json => {
              console.log(json)
          }).catch((err)=>{
              if(err.message=="Unexpected token R in JSON at position 0"){
                  //超出请求次数,切换key
                //   console.log("超出请求次数,切换key")
              }
          });
    }
    getPics(){
        //获取图片
        
        this.setState({
            canGet:false,
        })
        if(!this.state.canGet)return;
        this.props.winFN.Msg({show:true,text:'正在加载'})
        this.state.unsplash.photos.getRandomPhoto({width:1920,height:1080,count:30}).then(toJson).then(json => {
          this.props.winFN.Msg({show:false,text:'正在加载'})
          var arr=[...this.state.pics,...json]
          var idobj={}
          var picArr=[];
          arr.forEach((item,index)=>{
              if(!idobj[item.id]){
                idobj[item.id]=item.id
                picArr.push(item)
              }
          })
          this.setState({
                canGet:true,
                pics:[...this.state.pics,...json]
          })
          setTimeout(()=>{
            this.refs.Waterfall.init()
          },300)
            
        }).catch((err)=>{
            if(err.message=="Unexpected token R in JSON at position 0"){
                //超出请求次数,切换key
            }
        });
    }
    collectionsFN(){
        this.setState({
            canGet:false,
        })
        if(!this.state.canGet)return;
        this.props.winFN.Msg({show:true,text:'正在加载'})
        // this.state.unsplash.photos.listCuratedPhotos(this.state.page, 30)
        this.state.unsplash.photos.listPhotos(this.state.page, 30)
        .then(toJson)
        .then(json => {
            // Your code
            this.props.winFN.Msg({show:false,text:'正在加载'})
            this.setState({
                page:this.state.page+1,
                canGet:true,
                pics:[...this.state.pics,...json]
            })
            setTimeout(()=>{
                this.refs.Waterfall.init()
            },300)

        }).catch((err)=>{
            if(err.message=="Unexpected token R in JSON at position 0"){
                //超出请求次数,切换key
            }
        });
    }
    ScrollFN(e){
        //滑动事件
        if(Math.ceil(e.target.scrollTop+e.target.clientHeight)==e.target.scrollHeight){
            // this.getPics()
            this.collectionsFN();
        }
        
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
    render() {
        // var isShow = this.props.state.bgP.isShow
        var isShow=false;
        return (
            <div onScroll={this.ScrollFN.bind(this)} className={['BgSet', isShow ? 'active' : 'hide'].join(' ')} >
                <Waterfall ref="Waterfall">
                    {
                        <div className="Waterfall_item">
                            {
                                this.state.pics.map((item,index)=>{
                                    return (
                                        <div className="pics_item_pic_item" key={index}>
                                            <div className="user" onClick={this.openLink.bind(this,item)}>
                                                {item.user.username}
                                            </div>
                                            <img key={index} 
                                            draggable="false"
                                            onError={this.imgOnloadFN.bind(this)} 
                                            onLoad={this.imgOnloadFN.bind(this)} 
                                            index={index} 
                                            src={item.urls.small}
                                            onClick={this.lookBigPic.bind(this,item)}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </Waterfall>
            </div>
        )
    }
} 

function getState(state) {
    // console.log(state,'-=-=')
    return {
        state: state
    }
}
// BgSet = connect(getState, { setProcedureState })(BgSet)
BgSet = connect(getState,{...PicAction,...WindowAction})(BgSet)
BgSet=Window({title:"壁纸"})(BgSet);
export default BgSet
