var g_objCssVals = {
	"blur":0,
	"grayscale":0,
	"invert":0,
	"saturate":100,
	"contrast":0,
	"sepia":0,
	"brightness":100
};
var g_ArrCssAttributes = ["-webkit-filter","-moz-filter","-o-filter","-ms-filter","filter"];
var g_cssLine;
var g_intervals = [];
var g_numCSSChars = 0;

$(document).ready(function() {
	$("input[type=range]").on("focus",function() {
		var $elem = $(this);
		var value = $elem.parent("label").attr("for");
		var currentVal;

		g_intervals[$elem] = setInterval(function() {
			currentVal = $elem.val();
			$elem.parent("label").children("input:not(name)").val(currentVal);
			g_objCssVals[value] = currentVal;
			updateCSS();
		},100);
	});

	$("input[type=range]").focusout(function() {
		$elem = $(this);
		clearInterval(g_intervals[$elem]);
		updateCSS();
	});

	$("input:not(name)").on("keydown",function() {
		/*
		Todo
		 */
		$elem = $(this);
		$slider = $elem.parents("label").find(".slider");
		console.log($slider);
		$slider.attr("val","50");
	});

	$("#selectbtn").click(function() {
		$("#css").select();
	});

	function updateCSS() {
		g_cssLine = "";
		$.each(g_objCssVals,function(index,value) {

			var maxValue = $("#filterForm").find("[name=" + index + "]").attr("max");
			var startValue = $("#filterForm").find("[name=" + index + "]").next("input").attr("placeholder");
			var realVal = function(index,value) {
				if(index == "saturate") {
					return (value == maxValue ? maxValue + "%" : value + "%");
				} else if(index == "blur") {
					return (value == maxValue ? maxValue + "px" : value + "px");
				} else {
					if(isEven(value / 100)) {
						return value / 100;
					} else if(value == 100) {
						return 1;
					} else if(value < 100) {
						return "." + value;
					} else {
						return value / 100;
					}
				}
			}(index,value);

			if(value != startValue) {
				g_cssLine = g_cssLine + " " + index + "(" + realVal + ")";
			}
		});

		$("#css").html("");
		$("#filterImg").css(vendorPrefix() + "filter","");

		if(g_cssLine != "") {
			for(var attr in g_ArrCssAttributes) {
				$("#css").html($("#css").html() + g_ArrCssAttributes[attr] + ":" + g_cssLine + ";\r\n");
				$("#filterImg").css(vendorPrefix() + "filter",g_cssLine);
			}
			checkOverflow();
		}
	}
});

function vendorPrefix() {
	return function(str) { 
		return str.charAt(0).toUpperCase() + str.slice(1); 
	}((Array.prototype.slice.call(window.getComputedStyle(document.documentElement,"")).join("").match(/-(moz|webkit|ms)-/) || (styles.OLink === "" && ["","o"]))[0]);
}

function isEven(number) {
	return (number % 2 == 0);
}

function checkOverflow() {
	$elem = $("#css");

	if($elem[0].scrollHeight > parseInt($elem.css("height"))) {
		$elem.addClass("overflow");
	} else if(g_numCSSChars > getCSSCharLength()) {
		$elem.removeClass("overflow");
	}

	g_numCSSChars = getCSSCharLength();
}

function getCSSCharLength() {
	return $("#css").html().split("").length;
}