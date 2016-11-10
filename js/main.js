$(document).ready(function() {
	
	var win_count = 0;
		
	$(function create_chips() {
		
		for (index = 0; index < 84; index++) { // make chips
			create_circle(index);
			}
	});
	
	function create_circle(index) {
			
		if (index > 41 && index < 63) {
			color = 'purple';
		} else if (index > 62 && index < 84) {
			color = 'yellow';
		} else {
			color = 'white';
		}
		
		var circle = document.getElementsByTagName('canvas')[index].getContext('2d');
		circle.beginPath();
		if (color != 'white') {
			circle.arc(40, 40, 40, 0, 2 * Math.PI, false);
		} else {
			circle.arc(40, 40, 39.5, 0, 2 * Math.PI, false);
		}
		circle.fillStyle = color;
		circle.fill();
	}
	
	$(function mark_playable_squares() { // add 'can_place' class for bottom row
		for (i = 36; i < 43; i++) {
			$('#' + i).addClass('can_place');
		}
	});
	
	function find_landing_square(column_dropped_on) {
		
		for (i = column_dropped_on + 35; i >= column_dropped_on; i -= 7) {
			var iterated_square = $('#' + i);
			var iterated_square_num = iterated_square.attr('id');
			
			if (iterated_square.hasClass('can_place')) {				
				if (iterated_square_num > 35) {
					return ['503px', iterated_square_num];
				} else if (iterated_square_num > 28) {
					return ['419px', iterated_square_num];
				} else if (iterated_square_num > 21) {
					return ['335px', iterated_square_num];
				} else if (iterated_square_num > 14) {
					return ['251px', iterated_square_num];
				} else if (iterated_square_num > 7) {
					return ['167px', iterated_square_num];
				} else {
					return ['83px', iterated_square_num];
				}
			}
		}
	}
	
	function check_for_win(color, square) {
		
		function four_in_a_row_check() {
			if ($('#' + i).hasClass(color)) {
				win_count += 1;
				if (win_count == 4) { return true; }
			} else {
				win_count = 0;
			}
		}
		
		function check_horiz_win(color, square) {
			win_count = 0;
			for (i = square; i < square + 7; i += 1) {
				if (four_in_a_row_check()) {
					return true;	
				}
			}
		}
		
		// check for vertical win
		var original_square = square;
		while (square > 7) {
			square -= 7;
		}
		for (i = square; i < 43; i += 7) {
			if (four_in_a_row_check()) {
				return true;
			}
		}
		var square = original_square;
		
		// check for horizontal win
		var left_squares = [1, 8, 15, 22, 29, 36];
		var in_array = jQuery.inArray(square, left_squares);
		
		if (in_array > -1) {
			if (check_horiz_win(color, square)) {
				return true;
			}
		} else {
			while (result = jQuery.inArray(square, left_squares) == -1) {
				square -= 1;
				if (result = jQuery.inArray(square, left_squares) !== -1) {
					if (check_horiz_win(color, square)) {
						return true;	
					}
				}
			}
		}
		
		// check for diagonal win
		win_count = 0;
		var square = original_square;
		var top_left_bottom_right = [];
		
		//check from top left to bottom right first		
		while ((square > 8 && square < 43)) { // get squares left of current one
			var square = square - 8;
			var iterated_square = $('#' + (square));
			var id = parseInt(iterated_square.attr('id'));		
			if  (iterated_square.hasClass(color)) {
				top_left_bottom_right.push(id);
			}		
		}
		var square = original_square;
		top_left_bottom_right.push(parseInt($('#' + (square)).attr('id'))); // add current square to array
		
		while ((square > 0 && square < 35) && $('#' + square).hasClass(color)) { // get squares right of current one
			var square = square + 8;
			var iterated_square = $('#' + (square));
			var id = parseInt(iterated_square.attr('id'));		
			if  (iterated_square.hasClass(color)) {
				top_left_bottom_right.push(id);
			}
		}
		
		top_left_bottom_right.sort(function(a,b) { return a-b } ); // sort numerically ascending
		
		for (j = 0; j < top_left_bottom_right.length; j++) {
			i = top_left_bottom_right[j];
			if (four_in_a_row_check()) {
				return true;
			}
		}
		
		// now check from bottom left to top right
		win_count = 0;
		var square = original_square;
		var bottom_left_top_right = [];
			
		while ((square > 7 && square < 43)) { // get squares right of current one	
			var square = square - 6;
			var iterated_square = $('#' + (square));
			var id = parseInt(iterated_square.attr('id'));		
			if  (iterated_square.hasClass(color)) {
				bottom_left_top_right.push(id);
			}	
		}
		var square = original_square;
		bottom_left_top_right.push(parseInt($('#' + (square)).attr('id'))); // add current square to array
		
		while ((square > 0 && square < 35) && $('#' + square).hasClass(color)) { // get squares left of current one
			var square = square + 6;
			var iterated_square = $('#' + (square));
			var id = parseInt(iterated_square.attr('id'));		
			if  (iterated_square.hasClass(color)) {
				bottom_left_top_right.push(id);
			}	
		}
		
		bottom_left_top_right.sort(function(a,b) { return a-b } ); // sort numerically ascending
		
		for (j = 0; j < bottom_left_top_right.length; j++) {
			i = bottom_left_top_right[j];
			if (four_in_a_row_check()) {
				return true;
			}
		}
		return false; // no horizontal, vertical or diagonal win found
	}
	
	function congratulate(color) {
		
		if (color == 'purple_chip') {
			var letters = ['P','U','R','P','L','E','W','I','N','S'];
		} else {
			var letters = ['Y','E','L','L','O','W','W','I','N','S'];
		}
		var tiles = [9, 10, 11, 12, 13, 23, 24, 25, 26, 27];
		
		setTimeout(function() {
			
			$('canvas').css('visibility','hidden');
			$('.chip_holder').css('background-color','white');
			
			for (i = 0; i < 10; i++) {
				$('#' + tiles[i]).html('<h1>' + letters[i] + '</h1>');
			}
		}, 500);
		
		setTimeout(function() { window.location = document.URL; }, 2000);
	}
	
	$('.draggable').draggable({
		cancel: '.played',
		snap: ".droppable", 
		snapMode: "inner",
		snapTolerance: 40,
		containment: 'document',
		cursor: 'pointer',
		stack: 'canvas',
		axis: 'x',
		revert: 'invalid'
	});
		
	$('.droppable').droppable({
			
        drop: function(event, ui) {
        	
        	$('canvas.last_played').removeClass('last_played');
			
			if ($(ui.draggable)) {
				
				var current_color = $(ui.draggable).hasClass('purple_chip') ? 'purple_chip' : 'yellow_chip';
				var next_color = $(ui.draggable).hasClass('purple_chip') ? 'yellow_chip' : 'purple_chip';
				
				$('.' + current_color).draggable({ disabled: true });
				$('.' + next_color).draggable({ disabled: false });
				
				var drop_square_number = parseInt($(this).attr('id'));
				var landing_square_results = find_landing_square(drop_square_number);
				
				var distance          = landing_square_results[0];
				var square_to_land_on = parseInt(landing_square_results[1]);
				
				$(ui.draggable).animate(
					{ top:distance },
					300,
					'linear', 
					function() {
					piece_drop.play();
					}
				);
				
				$('#' + square_to_land_on).removeClass('can_place').addClass('cannot_place ' + current_color);
				$('#' + (square_to_land_on - 7)).addClass('can_place');
				
				if ($('#' + square_to_land_on).attr('id') < 8) {
					$(this).droppable({ disabled: true });
				}
				
				var result = check_for_win(current_color, square_to_land_on);
				
				if (result == true) {
					congratulate(current_color);
				}
				
				
       		}
       			
        	}
		});
	
	$('#reset').click(function() {
		window.location = document.URL;
	});	
});