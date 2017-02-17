/**
 * Created by dongwei on 2017/2/12.
 * 我自己定义的下拉框
 * 计划出来的很屌很炫酷
 */
(function($,document){
    $.log = function(msg){
        console.log(msg);
    };

    //首先是确定以怎么样的方式去渲染组件
    //选择使用选择器方式 $('selector').combobox(options);
    //这种是为jq对象添加函数
    $.fn.combobox = function(options) {
        console.log('my_combobox init');
        //得到下拉内容容器对象,先在页面中定义好
        var list;
        if(options.content){
             list= $('#'+options.content);
        }else{
            //没有预先弄好的内容,通过穿进来的参数去生成
            var ul = '<ul class="list_item" style="display: none">';
            var data = options.data;
            var li = '';
            for(var index in  data){
                li += '<li>'+data[index].text+'</li>';
            }
            ul += li + '</ul>';
            //$('body').append(ul);
            //list = $('.list_item');
            list = $(ul);
            $('body').append(list);
        }
        //得到绑定对象
        var self = $(this);
        //得到位置
        var postion = self.position();
        var pos_left = postion.left;
        var pos_top = postion.top;
        //得到宽度
        var self_width = self.outerWidth();
        var self_height = self.outerHeight();
        //重新计算下拉框的位置
        var combobox_top = pos_top + self_height;
        $.log('left:'+pos_left + ',top:' +pos_top +'width:' +self_width);
        list.css({top:combobox_top,left:pos_left,width:self_width});

        //list.show();
        //alert(list.width());
        //效果已经出来,只差事件绑定了
        self.bind('click',function(e){
            e.stopPropagation();
            list.toggle();
        });
        //点击空白 下拉消失
        $(document).bind('click', function(e){
            e.stopPropagation();
            list.hide();
        });
        //鼠标移到条目上背景换色
        list.children().hover(
            function(){
                $(this).addClass("selected");
            },
            function(){
                $(this).removeClass("selected");
            }
        );
        //点击条目设置值
        list.children().click(function () {
            self.val($(this).text());
        });
    }
}(jQuery,document));