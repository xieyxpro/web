function check() {
	var username = $("#username").val();
	if (!(/^[a-zA-Z]\w{5,17}$/.test(username))) {
		alert("用户名应为6~18位英文字母、数字或下划线，且以英文字母开头！！！");
		return false;
	}

	var stuId = $("#stuId").val();
	if (!(/^[1-9][0-9]{7}/.test(stuId))) {
		alert("学号应为8位且不以0开头的数字！！！");
		return false;
	}

	var tellphone = $("#tellphone").val();
	if (!(/^[1-9][0-9]{10}/.test(tellphone))) {
		alert("电话应为不以0开头的11位数字！！！");
		return false;
	}

	var mail = $("#mail").val();
	if (!(/^[a-zA-Z0-9_\-]+@(([a-zA-Z0-9_\-])+\.)+[a-zA-Z]{2,4}$/.test(mail))) {
		alert("邮箱地址不合法");
		return false;
	}

	return true;
}