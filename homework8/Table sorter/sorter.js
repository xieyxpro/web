$(function() {
	$("thead th").click(function() {
		//to make all items in theads has click function
		$(this).makeSort();
	});
});

/*
 *to judge whether it is ascend or descend,
 *make the clicked item has the right style
 *and call the suitable sort function
 */
$.fn.makeSort = function() {
	if ($(this).hasClass("ascend")) {
		$(this).parents("table").find("thead th").removeClass();
		$(this).attr("class", "descend");
		$(this).makeDescendSort();
	} else {
		$(this).parents("table").find("thead th").removeClass();
		$(this).attr("class", "ascend");
		$(this).makeAscendSort();
	}
}

/*
 *The following two sort function get the data at first
 *and used to sort, then set the new table's tr
 */
$.fn.makeAscendSort = function() {
	var index = $(this).index();
	var data = $(this).getData(index);
	data.sort();
	$(this).setTrIndex(data, index);
}

$.fn.makeDescendSort = function() {
	var index = $(this).index();
	var data = $(this).getData(index);
	data.sort();
	data.reverse();
	$(this).setTrIndex(data, index);
}

//This function gets the exact column data form the father table's tr
$.fn.getData = function(index) {
	var data = [];
	$(this).parents("table").find("tbody tr").each(function() {
		var text = $(this).children("td:eq("+index+")").text();
		data.push(text);
	});
	return data;
}

//The data has been sorted, just match original rows and insert them
$.fn.setTrIndex = function(data, index) {
	for (var i = 0; i < data.length; i++) {
		var text = data[i];
		$(this).parents("table").find("tbody tr").each(function() {
			var thisText = $(this).children("td:eq("+index+")").text();
			if (thisText == text) $(this).parents("table").find("tbody").append($(this));
		});
	}
}
