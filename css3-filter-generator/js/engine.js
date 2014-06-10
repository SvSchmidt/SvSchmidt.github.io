var cssVals = {
	"blur":0,
	"grayscale":0,
	"invert":0,
	"saturate":100,
	"contrast":0,
	"sepia":0,
	"brightness":100
};
var cssAttributes = ["-webkit-filter","-moz-filter","-o-filter","-ms-filter","filter"];
var cssLine;
var intervals = [];

$(document).ready(function() {
	$("input[type=range]").on("focus",function() {
		var $elem = $(this);
		var value = $elem.parent("label").attr("for");
		var currentVal;

		intervals[$elem] = setInterval(function() {
			currentVal = $elem.val();
			$elem.parent("label").children("input:not(name)").val(currentVal);
			cssVals[value] = currentVal;
			updateCSS();
		},100);
	});

	$("input[type=range]").focusout(function() {
		$elem = $(this);
		clearInterval(intervals[$elem]);
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
		cssLine = "";
		$.each(cssVals,function(index,value) {

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
				cssLine = cssLine + " " + index + "(" + realVal + ")";
			}
		});

		$("#css").html("");
		$("#filterImgContainer").css(vendorPrefix() + "filter","");

		if(cssLine != "") {
			for(var attr in cssAttributes) {
				$("#css").html($("#css").html() + cssAttributes[attr] + ":" + cssLine + ";\r\n");
				$("#filterImgContainer").css(vendorPrefix() + "filter",cssLine);
			}
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