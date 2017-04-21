var clickNum = 0;				//判断点击次数
var isclick = [0, 0, 0, 0, 0];	//判断五个按钮是否被点击
var clickMode = 0;				//判断是否进入机器人点击模式

$(function () {
	initialize();				//初始化

	$('#bottom-positioner').mouseenter(function() {		//当菜单展开时才添加点击事件
		clickMode = 1;									//进入机器人点击模式
		$('#control-ring li').each(function(index) {	//给每个按钮添加点击事件
			$('#control-ring li').eq(index).click(function() {
				if (isclick[index] == 1) return;		//如果被点击过，则无反应
				isclick[index] = 1;						//将按钮置为被点击过
				$('#control-ring li').eq(index).find('span').text('...').show();//显示。。。
				var that = $('#control-ring li').eq(index);
				$.get('http://localhost:3000', function (data, status) {	//发送请求
					if (status == "success") {
						that.find('span').text(data).show();				//设置显示的随机数
						that.attr("disabled", "true").addClass("disabledButton");//此按钮被点击过，不可再点击
						clickNum++;						//点击次数增加
						if (checkAll()) {				//判断是否所有按钮均被点击
							showSum();					//点击大气泡
						}
					} else {
						//failure funtion
					}
				});
			});
		});
	});

	$('#bottom-positioner').mouseleave(function() {	//菜单收缩时重置计算器
		clickNum = 0;
		isclick = [0, 0, 0, 0, 0];
		clickMode = 0;
		$('#control-ring li').unbind('click');
		initialize();
	});

	$('.apb').click(function() {				//机器人程序
		if (clickMode != 1) return;
		setTimeout(function() {
			for (var i = 0; i < 5; i++) {
				$('#control-ring li').eq(i).click();
			}
		}, 0);
	});
});

function initialize() {						//重置函数
	$('#control-ring li').removeAttr("disabled").removeClass("disabledButton");
	$('.unread').text("").hide();
	$('#info-bar span').text("").removeClass("sum");
	$('#info-bar').attr("disabled", "true").removeClass("enabled");
}

function showSum() {
	var sum = 0;
	for (var i = 0; i < 5; i++) {
		sum += parseInt($('#control-ring li span').eq(i).text());
	}
	$('#info-bar span').text(sum).addClass("sum");
	$('#info-bar').removeClass("enabled").attr("disabled", "true");
}

function checkAll() {
	return clickNum == 5;
}