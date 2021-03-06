import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';
import {HttpStorage} from '../../providers/httpstorage';
import {Platform} from 'ionic-angular';
import * as $ from "jquery";
import {DomSanitizer} from '@angular/platform-browser';
import {StreamingMedia, StreamingVideoOptions} from '@ionic-native/streaming-media';

@Component({
  selector: 'page-video',
  templateUrl: 'video.html'
})
export class VideoPage {
  seg: any;
  subject: any;
  videos: any;
  video: any;
  si: any;
  sj: any;
  title: any;
  url: any;
  playbackRate: any;
  fileTransfer: FileTransferObject;
  downqueue: any;
  vd: any;
  urll: any;
  first: any;

  constructor(private sanitizer: DomSanitizer, public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private httpstorage: HttpStorage, private transfer: FileTransfer, private file: File, private streamingMedia: StreamingMedia) {
    this.playbackRate = 1;
    this.seg = "s1";
    this.subject = this.navParams.get('subject');
    this.videos = this.navParams.get('videos');
    this.fileTransfer = this.navParams.get("ft");
    this.downqueue = this.navParams.get("downqueue");
    this.vd = this.navParams.get("vd");
    this.si = -1;
    this.sj = -1;
    //this.video=this.videos[0].list[0];
    this.title = this.subject.name;
    this.urll = "";
    //this.first=true;
    //this.title=this.video.title;
    //this.urll=this.sanitizer.bypassSecurityTrustResourceUrl(this.video.lectureUrl==null?'':this.video.lectureUrl);


    /*
     if(this.getDown(this.video.id)==1) this.url=this.file.dataDirectory+this.video.id+'.mp4';
     else this.url=this.video.videoUrl;
     this.httpstorage.getStorage("play",(data)=>{
     if(data==null){
     data={i:0,j:0,id:this.video.id,currentTime:0}
     this.httpstorage.setStorage("play",data);
     }
     else{
     let tmp=this.videos[data.i].list[data.j];
     if(tmp!=null&&tmp.id==data.id){
     this.si=data.i;
     this.sj=data.j;
     this.video=tmp;
     this.title=tmp.title;
     if(this.getDown(tmp.id)==1) this.url=this.file.dataDirectory+this.video.id+'.mp4';
     else this.url=this.video.videoUrl;
     $("#video")[0].currentTime=data.currentTime==null?0:data.currentTime;
     this.urll=this.sanitizer.bypassSecurityTrustResourceUrl(this.video.lectureUrl==null?'':this.video.lectureUrl);
     }
     }
     })
     */
    /*
     this.file.applicationDirectory+
     this.file.applicationStorageDirectory+
     this.file.dataDirectory;
     */
    this.fileTransfer.onProgress((event) => {
      $(".video-jdt").children("div").css("width", event.loaded * 100 / event.total + "%").html("<p>" + (event.loaded * 100 / event.total).toFixed(0) + "%</p>");
    });
  }

  isOk(tryOut: any) {
    if (tryOut || (this.subject.video && this.subject.time >= new Date().getTime())) {
      return true;
    }else {
      return false;
    }
  }

  getDownClass(id) {
    let down = this.getDown(id);
    if (down == 0) return 'video-down';
    else if (down == 1) return 'video-delete';
    else if (down == 2) return 'video-jdt';
    else return 'video-wait';
  }

  getDown(id) {
    let cot = 0;
    let down = 0;
    for (let x of this.downqueue) {
      if (id == x.id) {
        if (cot == 0) down = 2;
        else down = 3;
        break;
      }
      cot++;
    }
    for (let x of this.vd) {
      if (id == x.id) {
        down = 1;
        break;
      }
    }
    return down;
  }

  formatSeconds(value) {
    if (value == NaN) return '00:00';
    var theTime = parseInt(value);// 秒
    var theTime1 = 0;// 分
    var theTime2 = 0;// 小时
    if (theTime > 60) {
      theTime1 = parseInt(theTime / 60 + "");
      theTime = parseInt(theTime % 60 + "");
      if (theTime1 > 60) {
        theTime2 = parseInt(theTime1 / 60 + "");
        theTime1 = parseInt(theTime1 % 60 + "");
      }
    }
    var result = "00:" + (theTime < 10 ? '0' + theTime : theTime);
    if (theTime1 > 0) {
      result = "" + (theTime1 < 10 ? '0' + theTime1 : theTime1) + ":" + (theTime < 10 ? '0' + theTime : theTime);
    }
    if (theTime2 > 0) {
      result = theTime2 + ":" + (theTime1 < 10 ? '0' + theTime1 : theTime1) + ":" + (theTime < 10 ? '0' + theTime : theTime);
    }
    return result;
  }

  getJd(event) {
    this.video.time = event.target.duration;
    this.video.done = event.target.currentTime;
  }

  canPlay(event) {
    if (!this.first) event.target.play();
  }

  ionViewDidEnter() {
    //let video=$("#video")[0];
    /*
     this.httpstorage.getStorage("pl",(data)=>{
     if(data==null){
     data=[];
     this.httpstorage.setStorage("pl",data);
     }
     else{
     for(let i=0;i<this.videos.length;i++){
     for(let j=0;j<this.videos[i].list.length;j++){
     for(let v of data){
     if(this.videos[i].list[j].id==v.id){
     this.videos[i].list[j].done=v.done;
     this.videos[i].list[j].time=v.time;
     if(v.flg){
     this.si=i;
     this.sj=j;
     }
     break;
     }
     }
     }
     }
     }
     this.video=this.videos[this.si].list[this.sj];
     this.title=this.video.title;
     //if(this.isOk(this.video.tryOut)){
     if(this.getDown(this.video.id)==1) this.url=this.file.dataDirectory+this.video.id+'.mp4';
     else this.url=this.video.videoUrl;
     //}
     //video.currentTime=this.video.done;
     this.urll=this.sanitizer.bypassSecurityTrustResourceUrl(this.video.lectureUrl==null?'':this.video.lectureUrl);
     })
     */
  }

  ionViewWillUnload() {
    //this.httpstorage.setStorage("play",{i:this.si,j:this.sj,id:this.video.id,currentTime:this.video.done})
    /*
     this.httpstorage.getStorage("pl",(data)=>{
     for(let i=0;i<this.videos.length;i++){
     for(let j=0;j<this.videos[i].list.length;j++){
     let flg=true;
     for(let v of data){
     if(this.videos[i].list[j].id==v.id){
     v.done=this.videos[i].list[j].done;
     v.time=this.videos[i].list[j].time;
     v.flg=0;
     if(this.si==i&&this.sj==j){
     v.flg=1;
     }
     flg=false;
     break;
     }
     }
     if(flg&&this.videos[i].list[j].done>0){
     if(this.si==i&&this.sj==j) data.push({id:this.videos[i].list[j].id,done:this.videos[i].list[j].done,time:this.videos[i].list[j].time,flg:1})
     else data.push({id:this.videos[i].list[j].id,done:this.videos[i].list[j].done,time:this.videos[i].list[j].time,flg:0})
     }
     }
     }
     this.httpstorage.setStorage("pl",data);
     })
     */
  }

  setUrl(i, j) {

    this.si = i;
    this.sj = j;
    this.video = this.videos[i].list[j];
    this.title = this.video.title;
    let options: StreamingVideoOptions = {
      successCallback: () => {
        console.log('Video played')
      },
      errorCallback: (e) => {
        console.log('Error streaming')
      },
      orientation: 'landscape'
    };
    this.streamingMedia.playVideo(this.video.videoUrl, options);
    this.urll = this.sanitizer.bypassSecurityTrustResourceUrl(this.video.lectureUrl == null ? '' : this.video.lectureUrl);
  }

  download() {
    if (this.downqueue.length > 0) {
      let v = this.downqueue[0];
      //v.down=2;
      this.fileTransfer.download(v.videoUrl, this.file.dataDirectory + v.id + '.mp4').then((entry) => {
        //v.down=1;
        let v = this.downqueue[0];
        this.httpstorage.getStorage("vd", (data) => {
          //if(data==null) data=[];
          let flg = true;
          for (let w of data) {
            if (v.id == w.id) {
              flg = false;
              break;
            }
          }
          if (flg) {
            let time = new Date().getTime();
            data.push({id: v.id, time: time, tit: v.title});
            this.httpstorage.setStorage("vd", data);
            this.vd.push({id: v.id, time: time, tit: v.title});
          }
        })
        this.downqueue.shift();
        this.download();
      }, (error) => {
        console.log(error);
        this.downqueue.shift();
        this.download();
      });
    }
  }

  setOpera(i, j) {
    let v = this.videos[i].list[j];
    let down = this.getDown(v.id);
    if (down == 0) {
      //v.down=3;
      this.downqueue.push(v);
      if (this.downqueue.length == 1) this.download();
    }
    else if (down == 1) {
      //v.down=0;
      this.file.removeFile(this.file.dataDirectory, v.id + '.mp4');
      /*
       this.httpstorage.getStorage("vd",(data)=>{
       let newdata=[];
       for(let w of data){
       if(w.id!=v.id){
       newdata.push(w);
       }
       }
       this.vd=newdata;
       this.httpstorage.setStorage("vd",newdata);
       })
       */
      let idx = 0;
      for (let i = 0; i < this.vd.length; i++) {
        if (this.vd[i].id == v.id) {
          idx = i;
          break;
        }
      }
      this.vd.splice(i, 1);
      this.httpstorage.setStorage("vd", this.vd);
    }
    else if (down == 2) {
      //v.down=0;
      this.fileTransfer.abort();
    }
    else {
      //v.down=0;
      /*
       let newdownqueue=new Array();
       for(let a of this.downqueue){
       if(a.id!=v.id) newdownqueue.push(a);
       }
       this.downqueue=newdownqueue;
       this.callback(this.downqueue);
       */
      let idx = 0;
      for (let i = 0; i < this.downqueue.length; i++) {
        if (this.downqueue[i].id == v.id) {
          idx = i;
          break;
        }
      }
      this.downqueue.splice(idx, 1);
    }
  }

  setRate(e) {
    //$("#video")[0].playbackRate=e;
  }

  htoggle(i: number) {
    $(".video-title").eq(i).children(".cb").toggleClass("cbx");
    $(".video-title").eq(i).nextAll().toggle();
  }
}
