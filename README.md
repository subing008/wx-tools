微信公众平台工具包
本工具不是中间件，可直接引用使用

## 功能列表
- 获取acesstoken
- 获取jsapiTicket
- 获取signpackage
- 创建菜单
- 上传临时素材
- 持续更新中。。。

## Installation

```sh
$ npm install wx-tools-sdk
```

## Use with Connect/Express
```js
var wxsdk = require('wx-tools-sdk')('appid','secret');
```

## 获取acesstoken
```js

wxsdk.getAccessToken(function(err,token){
    //TODO
})
```

## 获取jsapiTicket
```js

wxsdk.getJsApiTicket(function(err,ticket){
    //TODO
})
```

## 获取signpackage
```js
wxsdk.getSignPackage(url,function(err,ticket){
    //TODO
})
```

##创建菜单
```js
var menus = {
  "button":[
    {
      "type": "click",
      "name": "测试1",
      "key": "MENU_KEY_TEST",
    },
  ]
}
wxsdk.createMenus(menus,function(err,result){

})
```

##上传临时素材
```js
wxsdk.uploadImage('xx/xx/1.jpg',function(err,result){
    //result {"type":"TYPE","media_id":"MEDIA_ID","created_at":123456789}
})

wxsdk.uploadVoice('xx/xx/1.mp3',function(err,result){
    //result {"type":"TYPE","media_id":"MEDIA_ID","created_at":123456789}
})

wxsdk.uploadvideo('xx/xx/1.mp4',function(err,result){
    //result {"type":"TYPE","media_id":"MEDIA_ID","created_at":123456789}
})

wxsdk.uploadthumb('xx/xx/1.jpg',function(err,result){
    //result {"type":"TYPE","media_id":"MEDIA_ID","created_at":123456789}
})
```