$(function () {
  var _JSON_STR,_JSON_OBJ;
  var _IS_ZIP = false;
  $("#json-src").keyup(function () {
    _IS_ZIP = false;
    var jsonstr=$("#json-src").val();
    try {
      var valid = jsonlint.parse(jsonstr);
      if (valid) {
        _JSON_OBJ = valid;
        var result = JSON.stringify(valid, null, "  ");
        _JSON_STR = result;
        $("#json-src").val(result);
      }
    }catch(e){
      _JSON_STR=null;
      _JSON_OBJ=null;
    }
    if (_JSON_STR) {
      // //JsonFormater.js
      // var options = {
      //     dom : '#json-obj' //对应容器的css选择器
      // };
      // var jf = new JsonFormater(options); //创建对象
      // jf.doFormat(_JSON_STR); //格式化json

      var jf = new JSONFormat(_JSON_STR,4).toString();
      $("#json-obj").html(jf);
    }
  });
  $("#beautify").click(function () {
    if (_JSON_OBJ) {
      _IS_ZIP = false;
      var result = JSON.stringify(_JSON_OBJ, null, "  ");
      $("#json-src").val(result);
    }
  });

  $("#compress").click(function () {
    if (_JSON_OBJ) {
      _IS_ZIP = true;
      var result = JSON.stringify(_JSON_OBJ);
      $("#json-src").val(result);
    }
  });

  $("#unicode-en").click(function () {
    if (_JSON_STR) {
      try {
        var jsonstr = _JSON_STR;
        if (!_IS_ZIP) {
          jsonstr = JSON.stringify(_JSON_OBJ);
        }
        var unicode = ChsToUnicode(jsonstr);
        var valid = jsonlint.parse(unicode);
        var result = JSON.stringify(valid);
        if (!_IS_ZIP) {
          result = JSON.stringify(valid, null, "  ");
        }
        _JSON_STR=result;
        _JSON_OBJ = valid;
        $("#json-src").val(result);

        if (_JSON_STR) {
          // //JsonFormater.js
          // var options = {
          //     dom : '#json-obj' //对应容器的css选择器
          // };
          // var jf = new JsonFormater(options); //创建对象
          // jf.doFormat(_JSON_STR); //格式化json

          var jf = new JSONFormat(_JSON_STR,4).toString();
          $("#json-obj").html(jf);
        }
      } catch (e) {
      }
    }
  });

  $("#unicode-de").click(function () {
    if (_JSON_STR) {
      try {
        var jsonstr = _JSON_STR;
        if (!_IS_ZIP) {
          jsonstr = JSON.stringify(_JSON_OBJ);
          //console.log(jsonstr);
        }
        var str = UnUnicode(jsonstr);
        var valid = jsonlint.parse(str);
        var result = JSON.stringify(valid);
        if (!_IS_ZIP) {
          result = JSON.stringify(valid, null, "  ");
        }
        _JSON_STR=result;
        _JSON_OBJ = valid;
        $("#json-src").val(result);

        if (_JSON_STR) {
          // //JsonFormater.js
          // var options = {
          //     dom : '#json-obj' //对应容器的css选择器
          // };
          // var jf = new JsonFormater(options); //创建对象
          // jf.doFormat(_JSON_STR); //格式化json

          var jf = new JSONFormat(_JSON_STR,4).toString();
          $("#json-obj").html(jf);
        }
      } catch (e) {
      }
    }
  });

  $("#escape").click(function () {
    if (_JSON_OBJ) {
      var result = JSON.stringify(json);
      result.replace();
      _JSON_STR=result;
      _JSON_OBJ = json;
      $("#json-src").val(result);
    }
  });

  $("#json-search").click(function () {

  });

  function ChsToUnicode(str) {
    var json = JSON.parse(str);
    json = JsonChsToUnicode(json);
    console.log(json);
    return JSON.stringify(json);
  }

  function JsonChsToUnicode(json_obj) {
    $.each(json_obj, function(name,value){
        console.log(name+":"+value);
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
