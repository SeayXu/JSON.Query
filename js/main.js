/*!
 * Name: JSON.Query
 * Author: seay
 * Version: 1.0.0 (2016.04.05)
 * Home: http://json.seay.me
 * Licenses: MIT licenses.
 * Requires: jQuery
 * Copyright (c) 2016 seay.me.
 */
$(function () {
  //initialize clipboard.js
  //new Clipboard('#copy');
  var clipboard = new Clipboard('.copy');

  clipboard.on('success', function(e) {
      // console.info('Action:', e.action);
      // console.info('Text:', e.text);
      // console.info('Trigger:', e.trigger);
      e.clearSelection();
      $("#tips").html("复制成功!");
      $("#tips").fadeIn(1000,function () {
        $("#tips").fadeOut(1000);
      });
  });

  clipboard.on('error', function(e) {
    var text = $("#json-copy").val();
    prompt ("Press Ctrl + C Enter copy to clipboard", text);
  });

  //initialize all tooltips on a page
  $('[data-toggle="tooltip"]').tooltip();

  //JSON opt
  var _JSON_STR,_JSON_OBJ,_CURRENT_JSON_STR,_CURRENT_JSON_OBJ;
  var _IS_ZIP = false;
  var _IS_UNICODE = false;
  var _IS_ESCAPE = false;
  $("#json-src").keyup(function () {
    _IS_ZIP = false;
    var jsonstr=$("#json-src").val();
    if (!jsonstr) {
      return;
    }
    var result="",src="",copy="";
    try {
      var valid = jsonlint.parse(jsonstr);
      if (valid) {
        _JSON_OBJ = JSON.parse(jsonstr);
        _CURRENT_JSON_OBJ = _JSON_OBJ;

        _JSON_STR = JSON.stringify(_JSON_OBJ);
        _CURRENT_JSON_STR = _JSON_STR;

        copy = JSON.stringify(_CURRENT_JSON_OBJ);
        src = JSON.stringify(_CURRENT_JSON_OBJ,null,"  ");
        result = new JSONFormat(_JSON_STR,4).toString();
      }
    }catch(e){
      copy = "";
      src = jsonstr;
      _JSON_STR=null;
      _JSON_OBJ=null;
      result = e;
    }
    $("#json-src").val(src);
    $("#json-copy").val(copy);
    $("#json-obj").html(result);
  });

  $("#beautify").click(function () {
    var result="",src="",copy="";
    if (_JSON_OBJ) {
      if (_IS_ZIP) {
        _IS_ZIP = false;
        copy = JSON.stringify(_CURRENT_JSON_OBJ);
        src = JSON.stringify(_CURRENT_JSON_OBJ,null,"  ");
        result = new JSONFormat(_CURRENT_JSON_STR,4).toString();
      }else {
        _IS_ZIP = true;
        result = JSON.stringify(_CURRENT_JSON_OBJ);
        src = result;
        copy = result;
      }
      $("#json-src").val(src);
      $("#json-copy").val(copy);
      $("#json-obj").html(result);
    }
  });

  $("#unicode").click(function () {
    var result="",src="",copy="";
    if (_JSON_STR) {
      try {
        var jsonstr = _JSON_STR;
        if (!_IS_ZIP) {
          jsonstr = JSON.stringify(_JSON_OBJ);
        }
        //unicode编码
        if (_IS_UNICODE) {
          _IS_UNICODE = false;
          jsonstr = UnUnicode(jsonstr);
        }else {
          _IS_UNICODE = true;
          jsonstr = ChsToUnicode(jsonstr);
        }

        _CURRENT_JSON_OBJ = jsonlint.parse(jsonstr);
        _CURRENT_JSON_STR = JSON.stringify(_CURRENT_JSON_OBJ);

        if (_IS_ZIP) {
          result = _CURRENT_JSON_STR;
          src = result;
          copy = result;
        }else {
          src = JSON.stringify(_CURRENT_JSON_OBJ,null,"  ");
          result = new JSONFormat(_CURRENT_JSON_STR,4).toString();
        }
        copy = _CURRENT_JSON_STR;
      } catch (e) {
        result=e;
        src = jsonstr;
        copy = jsonstr;
      }
      $("#json-src").val(src);
      $("#json-copy").val(copy);
      $("#json-obj").html(result);
    }
  });

  $("#escape").click(function () {
    var result="",copy="";
    if (_CURRENT_JSON_STR) {
      try {
        var jsonstr = JSON.stringify(_CURRENT_JSON_OBJ);
        if (_IS_ESCAPE) {
          _IS_ESCAPE = false;
          result = jsonstr.replace(/\"/g,function (item) {
            return item.replace("\\","");
          });
        }else {
          _IS_ESCAPE = true;
          result = jsonstr.replace(/"/g,function (item) {
            return "\\"+item;
          });
        }
        copy = result;
      } catch (e) {
        copy = _JSON_STR;
        result = e;
      }
      $("#json-copy").val(copy);
      $("#json-obj").html(result);
    }
  });

  $("#clean").click(function () {
    _JSON_STR=null;
    _JSON_OBJ=null;
    _CURRENT_JSON_STR=null;
    _CURRENT_JSON_OBJ=null;
    _IS_ZIP=false;
    _IS_UNICODE=false;
    _IS_ESCAPE=false;
    $("#json-src").val("");
    $("#json-copy").html("");
    $("#json-obj").html("");
  });

  $("#json-search").click(function () {

  });

  function ChsToUnicode(str) {
    var json = JSON.parse(str);
    json = JsonChsToUnicode(json);
    //console.log(json);
    return JSON.stringify(json);
  }

  function JsonChsToUnicode(json_obj) {
    $.each(json_obj, function(name,value){
        //console.log(name+":"+value);
        if (typeof(value)=='object') {
          JsonChsToUnicode(value);
        }else {
          if (typeof(value)=='string') {
            //中,日,韩的字符:\u4E00-\u9FA5 符号:\uF900-\uFA2D
            //全角符号:\uFF00-\uFFEF
            //通用标点符:\u2000-\u206F
            //CJK符号和标点:\u3000-\u303F
            //中文竖排标点:\uFE10–\uFE1F
            //CJK兼容符号(竖排变体、下划线、顿号):\uFE30–\uFE4F
            //\uFE10–\uFE1F\uFE30–\uFE4F
            json_obj[name] = value.replace(/[\u4E00-\u9FA5\uF900-\uFA2D\uFF00-\uFFEF\u2000-\u206F\u2E80-\uFE4F]/g,function (item) {
              return ToUnicode(item);
            });
          }else {
            json_obj[name]=value;
          }
        }
    });
    return json_obj;
  }

  function ToUnicode(str) {
    var res=[];
    for(var i=0;i < str.length;i++)
        res[i]=("00"+str.charCodeAt(i).toString(16)).slice(-4);
    return "\\u"+res.join("\\u");
  }
  function UnUnicode(str) {
      var tmp=str.replace(/\\\\/g,"%");
      return unescape(tmp);
  }
});
