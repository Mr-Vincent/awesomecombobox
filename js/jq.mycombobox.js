/**
 * Created by dongwei on 2017/2/12.
 * 我自己定义的下拉框
 * 计划出来的很屌很炫酷
 * 但实际上却很low
 */
(function($,document){
    var log = function(){
        console.log.apply(console, arguments);
    };

    //是否带有title属性,有就在前面显示,没有就不显示
    function _hasTitle(opt){
        var label = '';
        if(opt.title){
            label = '<label>'+opt.title+'</label> ';
            return label;
        }else{
            return '';
        }
    }
    //自定义click事件
    function _checkClick(opt,target){
        if(opt.click){
            //定义了click这个事件
            opt.click.call(target, $(target).index(), $(target).attr('val'));
        }
    }
    //是不是多选
    function _isMultiple(opt,target,self,list,texts,values){
        if(opt.multiple){
            var isSelected = target.hasClass('selected');
            var value = target.attr('val');
            var text = target.text();
            if(isSelected){
                target.removeClass('selected');
                texts.remove(text);
                values.remove(value);
            }else{
                target.addClass('selected');
                texts.push(text);
                values.push(value);
            }
            self.val(texts);
        }else{
            self.val(target.text());
            list.hide();
        }
        _bulidValueField(values,self);
    }
    //生成value的隐藏域
    function _bulidValueField(items,self){
        var item = '';
        for(var i = 0;i<items.length; i++){
            item += '<input type="hidden" name="val" value="'+items[i]+'">';
        }
        self.empty().append(item);
    }
    //首先是确定以怎么样的方式去渲染组件
    //选择使用选择器方式 $('selector').combobox(options);
    //这种是为jq对象添加函数
    $.fn.combobox = function(options) {
        console.log('my_combobox init');
        var selectedValues = [];
        var selectedTexts = [];
        //得到绑定对象
        var self = $(this);
        var defaultOpt = {
            data:[],//下拉的数据
            defaultValue:0,//组件第一次加载文本框显示的文本
            title:'',//label
            width:'200px',//文本框宽度
            height:'20px',//文本框高度
            select_max_height:'',//下拉框最大高度,宽度能自定义,和文本框宽度一致
            transition:false,//出场动画
            multiple:false,//可否多选
            value:'',//指定的值
            text:'',//要显示的值
            onValueSelected:false,//值被选中事件
            filter:true//筛选,输入值自动筛选,类似查找
        };//默认参数

        var params = {};
        //合并穿进来的参数和默认参数,也就是说没传进来就用默认的,传进来了就用传进来的
        $.extend(params, defaultOpt);
        $.extend(params, options);

        var label = _hasTitle(params);
        if(label != ''){
            self.before(label);
        }
        //初始化默认值
        if(params.data){
            var defaultText = params.data[params.defaultValue].text;
            self.val(defaultText);
        }
        //指定下拉组件的宽度
        if(params.width){
            self.css({width:params.width});
        }
        //文本框的高度
        if(params.height){
            self.css({height:params.height});
        }

        //得到下拉内容容器对象,先在页面中定义好
        var list;
        if(options.content){
             list= $('#'+options.content);
        }else{
            //没有预先弄好的内容,通过传进来的参数去生成
            var ul = '<ul class="list_item" style="display: none">';
            var data = options.data;
            var li = '';
            for(var index = 0; index < data.length; index++){
                li += '<li val='+data[index].value+'>'+data[index].text+'</li>';
            }
            ul += li + '</ul>';
            list = $(ul);
            var lis = list.children();
            log(lis);
            lis.each(function(i){
                var li = $(this);
                if(i % 2 == 0){
                    li.addClass('odd');
                }else{
                    li.addClass('even');
                }
            });
            $('body').append(list);
        }
        if(params.select_max_height){
            list.css({'max-height':params.select_max_height});
        }

        //添加样式
        self.addClass('ec');
        //得到位置
        var postion = self.position();
        var pos_left = postion.left;
        var pos_top = postion.top;
        //得到宽度
        var self_width = self.outerWidth();
        var self_height = self.outerHeight();
        //重新计算下拉框的位置
        var combobox_top = pos_top + self_height;
        log('left:'+pos_left + ',top:' +pos_top +'width:' +self_width);
        list.css({top:combobox_top,left:pos_left,width:self_width});

        //list.show();
        //alert(list.width());
        //效果已经出来,只差事件绑定了

        self.bind('click',function(e){
            e.stopPropagation();
            if(params.transition){
                list.animate({
                    display:'block',
                    height:'toggle'
                },400);
            }else{
                list.toggle();
            }
        });
        //点击空白 下拉消失
        $(document).bind('click', function(e){
            list.hide();
        });
        //点击条目设置值
        list.on('click','li',function(e){
            e.stopPropagation();
            var _this = $(e.target);
            _checkClick(params,_this);
            _isMultiple(params,_this,self,list,selectedTexts,selectedValues);
        });
    }
}(jQuery,document));

/**
 * 为Array添加方法
 */
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove= function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};