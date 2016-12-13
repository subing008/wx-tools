const fs = require('fs');
const request = require('request');
const crypto = require('crypto');

const config = {
  actokenFile: '.accesstoken.json',
  jsapiFileL: '.jssdktoken.json',
}

exports = module.exports = wxsdk;

function wxsdk(appid,appsecret){
  if(!(this instanceof wxsdk)){
    return new wxsdk(appid,appsecret);
  }

  this.appId = appid;
  this.appSecret = appsecret;
}

wxsdk.prototype = {
  createNonceStr: function(){
    return Math.random().toString(36).substr(2, 15);
  },

  createTimestamp: function(){
    return parseInt(new Date().getTime() / 1000) + '';
  },

  rew: function(args){
    let keys = Object.keys(args);
    keys = keys.sort()
    let newArgs = {};
    keys.forEach(function (key) {
      newArgs[key.toLowerCase()] = args[key];
    });

    let string = '';
    for (let k in newArgs) {
      string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
  },

  readCacheFile: function(filename){
    try {
      return JSON.parse(fs.readFileSync(filename));
    } catch (e) {
      console.log("read file failed!");
    }
    return {};
  },

  writeCacheFile: function(filename,data){
    return fs.writeFileSync(filename,JSON.stringify(data));
  },

  getAccessToken: function(callback){
    let data = this.readCacheFile(config.actokenFile);
    let curtiem = new Date().getTime() / 1000;
    let instance = this;

    if ( typeof data.expireTime === "undefined" || data.expireTime < curtiem) {
      let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`;
      request.get(url,function(err,res,body){
        if (err) {
          return callback(err);
        }

        let access_token = JSON.parse(body).access_token;
        instance.writeCacheFile(config.actokenFile,{
          accessToken: access_token,
          expireTime: curtiem + 7200,
        });

        return callback(null,access_token);
      });
    }else{
      return callback(null,data.accessToken);
    }
  },

  getJsApiTicket: function(callback){
    let data = this.readCacheFile(config.jsapiFileL);
    let curtiem = new Date().getTime() / 1000;
    let instance = this;

    if ( typeof data.expireTime === "undefined" || data.expireTime < curtiem) {
      instance.getAccessToken(function(err,accessToken){
        if( err ){
          return callback(err);
        }

        const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=${accessToken}`;
        request.get(url,function(err,res,body){
          if (err) {
            return callback(err);
          }

          let jsapi_ticket = JSON.parse(body).ticket;
          instance.writeCacheFile(config.jsapiFileL,{
            JsApiTicket: jsapi_ticket,
            expireTime: curtiem + 7200,
          });

          return callback(null,jsapi_ticket);
        });
      });
    }else{
      return callback(null,data.JsApiTicket);
    }
  },

  getSignPackage: function(url,callback){
    let instance = this;
    instance.getJsApiTicket(function(err,jssdkToken){
      if (err) {
        return callback(err);
      }

      let ret = {
        jsapi_ticket: jssdkToken,
        nonceStr: instance.createNonceStr(),
        timestamp: instance.createTimestamp(),
        url: url
      };

      let string = instance.rew(ret);
      let hash = crypto.createHash('sha1');
      ret.signature = hash.update(string).digest('hex');
      ret.appId = instance.appId;
      ret.appSecret = instance.appSecret;

      return callback(null,ret);
    })
  },
}
