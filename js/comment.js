// 日期格式化
function add0(m){return m<10?'0'+m:m }
function format(shijianchuo)
{
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}

/*加载菜单栏的*/
$(document).click(function(){
    $('.nav-list').removeClass('open')
})
$('.nav-menu,.nav-list').click(function(e){e.stopPropagation()})
$('nav').find('.nav-menu').click(function(e){
    $('.nav-list').toggleClass('open')
})


// 判断是否登录登录后设置头像等信息
function  setHead(date) {
        $("#head").html("<ul class=\"layui-nav\" style='background-color: white'>\n" +
            "  <li class=\"layui-nav-item\">\n" +
            "    <a href=\"\" style='color: black'>成为作者<i class=\"layui-icon layui-icon-edit\"></i></a>\n" +
            "  </li>\n" +
            "  <li class=\"layui-nav-item\" lay-unselect=\"\">\n" +
            "    <a href=\"javascript:;\" style='color: black'><img src=\"http://127.0.0.1:8066/images/"+date.data.userImg+"\"class=\"layui-nav-img\">" +date.data.username+"</a>\n" +
            "    <dl class=\"layui-nav-child\" style='color: black'>\n" +
            "      <dd><a href=\"pages/changInfo.html\">修改信息</a></dd>\n" +
            "      <dd><a href=\"javascript:;\">安全管理</a></dd>\n" +
            "      <dd><a href=\"javascript:window.sessionStorage.clear();\">退出</a></dd>\n" +
            "    </dl>\n" +
            "  </li>\n" +
            "</ul>")

    layui.use('element', function(){
        var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
        //监听导航点击
        element.on('nav(demo)', function(elem){
            //console.log(elem)
            layer.msg(elem.text());
        });
    });
}
datas=window.sessionStorage.getItem("user");
if (datas!=null){
    setHead(JSON.parse(datas));
}


// 用户登录
layui.use('layer', function(){ //独立版的layer无需执行这一句
    var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一
    //触发事件
    var active = {
        notice: function(){
            layer.open({
                type: 1
                ,area: '500px;'
                ,title:"登录"
                ,shade: 0.8
                ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
                ,btn: ['登录'],
                yes: function(index, layero){
                    $.ajax({
                        url:"http://127.0.0.1:8066/authorAdmin/userLogin",//请求的路径
                        type:"POST",//请求的方式
                        data:{mail:$("#mail").val() ,password:$("#password").val()},
                        success:function(date){
                            console.log(date)
                            if (date.success){
                                layer.msg('登录成功');
                                layer.close(index);
                                window.sessionStorage.setItem("user",JSON.stringify(date));
                                setHead(date);
                            }
                            else{
                                layer.msg('登录失败');
                                return false;
                            }
                        },
                        error:function(){
                            //请求出现错误时
                        }
                    });
                    return false;
                }
                ,btnAlign: 'c'
                ,moveType: 1 //拖拽模式，0或者1
                ,content: '<div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">我们此后的征途是星辰大海 ^_^' +
                    '<fieldset class="layui-elem-field layui-field-title" style="margin-top: 20px;">\n' +
                    '  <legend>欢迎您的加入</legend>\n' +
                    '</fieldset>' +
                    '<form class="layui-form" action="">\n' +
                    '  <div class="layui-form-item">\n' +
                    '    <label class="layui-form-label">账号</label>\n' +
                    '    <div class="layui-input-block">\n' +
                    '      <input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入账号" id="mail" class="layui-input">\n' +
                    '    </div>\n' +
                    '  </div>\n' +
                    '  <div class="layui-form-item">\n' +
                    '    <label class="layui-form-label">密码</label>\n' +
                    '    <div class="layui-input-block">\n' +
                    '      <input type="password" name="password" lay-verify="required" lay-reqtext="密码" id="password" placeholder="请输入" autocomplete="off" class="layui-input">\n' +
                    '    </div>\n' +
                    '  </div>' +
                    '</div>'
            });
        }};
    $('#layerDemo').on('click', function(){
        active.notice()
    });
});

// 搜索框
function searchToggle(obj, evt){
    var container = $(obj).closest('.search-wrapper');

    if(!container.hasClass('active')){
        container.addClass('active');
        evt.preventDefault();
    }
    else if(container.hasClass('active') && $(obj).closest('.input-holder').length == 0){
        container.removeClass('active');
        // clear input
        container.find('.search-input').val('');
        // clear and hide result container when we press close
        container.find('.result-container').fadeOut(100, function(){$(this).empty();});
    }
}

function submitFn(obj, evt){
    value = $(obj).find('.search-input').val().trim();

    _html = "Yup yup! Your search text sounds like this: ";
    if(!value.length){
        _html = "Yup yup! Add some text friend :D";
    }
    else{

        _html += "<b>" + value + "</b>";
    }

    $(obj).find('.result-container').html('<span>' + _html + '</span>');
    $(obj).find('.result-container').fadeIn(100);

    evt.preventDefault();
}


// 置顶
var four;
function Topfun(){
    four=setInterval(FourscrollBy,10);
}
function FourscrollBy(eachHeight){
    if(document.documentElement && document.documentElement.scrollTop) //IE
    {
        if(document.documentElement.scrollTop<=0){
            clearInterval(four);
        }else{
            window.scrollBy(0,-30);
        }
    }else{ //Chrome不支持documentElement.scrollTop
        if(document.body.scrollTop<=0){
            clearInterval(four);
        }else{
            window.scrollBy(0,-30);
        }
    }
}
