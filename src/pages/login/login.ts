import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { HttpStorage } from '../../providers/httpstorage';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpstorage:HttpStorage
  ) {
    this.clear();
  }
  account:string="";
  password:string="";

  pwm:any;
  pwmuser:any;
  pwmopw:any;
  pwmnpw:any;

  pwf:any;
  pwfs:any;
  pwfuser:any;
  pwfyzm:any;
  pwfpwd:any;
  login(){
      this.httpstorage.getHttp('/app/loginController.do?login&userId='+this.account+'&userPwd='+this.password,(data)=>{
        console.log(data);
        if(data!=null){
          if(data.returnCode){
            let user:any={
              token:data.content.token,
              userId:data.content.userId,
              userName:data.content.userName
            }
            this.httpstorage.setStorage("user",user);
            this.navCtrl.setRoot(TabsPage);
          }
          else{
            let alert = this.alertCtrl.create({
              title: '系统通知',
              subTitle: '账号或密码错误',
              buttons: ['好'],
            });
            alert.present();
          }
        }
        else {
          console.log("nonet");
        }
      })
  }
  free(){
    let user:any={
      token:'',
      userId:'百词斩免登陆测试用户',
      userName:''
    }
    this.httpstorage.setStorage("user",user);
    this.navCtrl.setRoot(TabsPage);
  }
  clear(){
    this.pwm=false;
    this.pwmuser="";
    this.pwmopw="";
    this.pwmnpw="";

    this.pwf=false;
    this.pwfs=true;
    this.pwfuser="";
    this.pwfyzm="";
    this.pwfpwd="";
  }
  pwfsend(){
    if(this.pwfuser==""){
      let alert = this.alertCtrl.create({
        title: '系统通知',
        subTitle: '请先输入账号！',
        buttons: ['好'],
        //cssClass:'mid'
      });
      alert.present();
    }
    else{
      this.httpstorage.getHttp("/app/userController.do?sendEmail&userId="+this.pwfuser,(data)=>{
        let alert = this.alertCtrl.create({
          title: '系统通知',
          subTitle: data.msg,
          buttons: ['好'],
          //cssClass:'mid'
        });
        alert.present();
        if(data.returnCode) this.pwfs=false;
      })
    }
  }
  pwfok(){
    if(this.pwfyzm!=""&&this.pwfpwd!="")
    this.httpstorage.getHttp("/app/userController.do?doUpdatePwdByEmailCode&userId="+this.pwfuser+"&newPwd="+this.pwfpwd+"&emailCode="+this.pwfyzm,(data)=>{
      let alert = this.alertCtrl.create({
        title: '系统通知',
        subTitle: data.msg,
        buttons: ['好'],
        //cssClass:'mid'
      });
      alert.present();
      if(data.returnCode) this.clear();
    })
  }
  pwmok(){
    this.httpstorage.getHttp("/app/userController.do?doUpdatePwdByOldPwd&userId="+this.pwmuser+"&newPwd="+this.pwmnpw+"&oldPwd="+this.pwmopw,(data)=>{
      let alert = this.alertCtrl.create({
        title: '系统通知',
        subTitle: data.msg,
        buttons: ['好'],
        //cssClass:'mid'
      });
      alert.present();
      if(data.returnCode) this.clear();
    })
  }
  forget(){
    this.pwf=true;
    /*
    if(this.account==""){
      let alert = this.alertCtrl.create({
        title: '系统通知',
        subTitle: '请先输入账号！',
        buttons: ['好'],
        //cssClass:'mid'
      });
      alert.present();
    }
    else{
      this.httpstorage.getHttp("/app/userController.do?sendEmail&userId="+this.account,(data)=>{})
      let prompt = this.alertCtrl.create({
        title: '忘记密码',
        subTitle:'验证码邮件已发送到您指定的邮箱',
        inputs: [
          {
            name: 'yzm',
            placeholder: '请输入验证码'
          },
          {
            name: 'npw',
            placeholder: '请输入新密码'
          }
        ],
        buttons: [
          {
            text: '确定',
            handler: data => {
              if(data.yzm!=""&&data.npw!="") this.httpstorage.getHttp("/app/userController.do?doUpdatePwdByEmailCode&userId="+this.account+"&newPwd="+data.npw+"&emailCode="+data.yzm,(data)=>{
                let alert = this.alertCtrl.create({
                  title: '系统通知',
                  subTitle: data.msg,
                  buttons: ['好'],
                  //cssClass:'mid'
                });
                alert.present();
              })
            }
          }
        ]
      });
      prompt.present();
    }
    */
  }
  mod(){
    this.pwm=true;
    /*
    if(this.account==""){
      let alert = this.alertCtrl.create({
        title: '系统通知',
        subTitle: '请先输入账号！',
        buttons: ['好'],
        //cssClass:'mid'
      });
      alert.present();
    }
    else{
      let prompt = this.alertCtrl.create({
        title: '修改密码',
        inputs: [
          {
            name: 'opw',
            placeholder: '请输入旧密码',
            type:'password'
          },
          {
            name: 'npw',
            placeholder: '请输入新密码',
            type:'password'
          }
        ],
        buttons: [
          {
            text: '确定',
            handler: data => {
              if(data.yzm!=""&&data.npw!="") this.httpstorage.getHttp("/app/userController.do?doUpdatePwdByOldPwd&userId="+this.account+"&newPwd="+data.npw+"&oldPwd="+data.opw,(data)=>{
                let alert = this.alertCtrl.create({
                  title: '系统通知',
                  subTitle: data.msg,
                  buttons: ['好'],
                  //cssClass:'mid'
                });
                alert.present();
              })
            }
          }
        ]
      });
      prompt.present();
    }
    */
  }
}
