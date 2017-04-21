var clickNum = 0;				//判断点击次数
var clickMode = 0;				//判断是否进入机器人点击模式
var isclick = [0, 0, 0, 0, 0];	//判断五个按钮是否被点击
var arr = [0, 1, 2, 3 ,4];		//点击顺序数组

$(function () {
	initialize();				//初始化

	$('#bottom-positioner').mouseenter(function() {			//当菜单展开时才添加点击事件
		clickMode = 1;										//进入机器人点击模式
		$('#control-ring li').each(function(index) {		//给每个按钮添加点击事件
			$('#control-ring li').eq(index).click(function() {
				if (isclick[index] == 1) return;			//如果被点击过，则无反应
				isclick[index] = 1;							//将按钮置为被点击过
				for (var i = 0; i < 5; i++) {
					if (isclick[i] == 0) {					//没被点击的变为灰色不可点击状态
						$('#control-ring li').eq(i).attr("disabled","true").addClass("disabledButton");
					}
				}
				$('#control-ring li').eq(index).find('span').text('...').show();//显示。。。
				$('#order span').eq(clickNum).addClass("clicked");				//被点击的变为不可点击状态
				var that = $('#control-ring li').eq(index);
				$.get('http://localhost:3000', function (data, status) {		//发送请求
					if (status == "success") {
						that.find('span').text(data).show();					//设置显示的随机数
						for (var i = 0; i < 5; i++) {
							if (isclick[i] == 0)								//没被点击过的变为可点击状态
								$('#control-ring li').eq(i).removeAttr("disabled").removeClass("disabledButton");
						}
						that.attr("disabled", "true").addClass("disabledButton");//被点击的变为不可点击状态
						clickNum++;
						if (clickNum == 5) {									//判断此时是否五个按钮点击完毕
							$('#info-bar').removeAttr("disabled").addClass("enabled");
							$('#info-bar').click(function() {					//给大气泡添加点击事件
								var sum = 0;
								for (var i = 0; i < 5; i++) {
									sum += parseInt($('#control-ring li span').eq(i).text());
								}
								$('#info-bar span').text(sum).addClass("sum");
								$('#info-bar').removeClass("enabled").attr("disabled", "true");//大气泡变为不可点击状态
							});
						}
						if (clickNum == 5) $('#info-bar').click();			//若点击完毕，点击大气泡
						else {
							$('#control-ring li').eq(arr[clickNum]).click();	//点击下一个按钮
						}
					} else {
						//failure funtion
					}
				});
			});
		});
	});

	$('#bottom-positioner').mouseleave(function() {//菜单收缩时重置计算器
		clickNum = 0;
		isclick = [0, 0, 0, 0, 0];
		clickMode = 0;
		$('#control-ring li').unbind('click');
		initialize();
	});

	$('.apb').click(function() {				//机器人程序
		if (clickMode != 1) return;
		setRandomOrder();
		setTimeout(function() {
			$('#control-ring li').eq(arr[0]).click();
		}, 0);
	});

});

function initialize() {					//重置函数
	$('#control-ring li').removeAttr("disabled").removeClass("disabledButton");
	$('.unread').text("").hide();
	$('#info-bar span').text("").removeClass("sum");
	$('#info-bar').attr("disabled", "true").removeClass("enabled");
	$('#order span').removeClass("clicked");
	$('#order').hide();
}

function setRandomOrder() {			//获得随机顺序
	$('#order').show();
	arr.sort(function() {
		return 0.5 - Math.random();
	});
	for (var i = 0; i < 5; i++) {
		(function(index) {
			switch(arr[index]){
				case 0:
					$('#order span').eq(index).text("A");
					break;
				case 1:
					$('#order span').eq(index).text("B");
					break;
				case 2:
					$('#order span').eq(index).text("C");
					break;
				case 3:
					$('#order span').eq(index).text("D");
					break;
				case 4:
					$('#order span').eq(index).text("E");
			}
		})(i);
	}
}