var ip_location_url = 'https://freegeoip.net/json/';
var airport_locations_url = 'airport_locations.json';

var ip_request = new XMLHttpRequest();
ip_request.open('GET', ip_location_url, true);

var current_location = null,
	airport_locations = null;

ip_request.onload = function() {
  if (ip_request.status >= 200 && ip_request.status < 400) {
    processCurrentLocation(JSON.parse(ip_request.responseText));
  }
  else {
    alert('could not reach ip location url');
  }
};
ip_request.onerror = function() {
  alert('could not reach ip location url');
};

ip_request.send();

var airport_locations_request = new XMLHttpRequest();
airport_locations_request.open('GET', airport_locations_url, true);

airport_locations_request.onload = function() {
	if (airport_locations_request.status >= 200 && airport_locations_request.status < 400) {
		processAirportLocations(JSON.parse(airport_locations_request.responseText));
	}
	else {
		alert('could not reach ip location url');
	}
};
airport_locations_request.onerror = function() {
  alert('could not reach ip location url');
};

airport_locations_request.send();

function processCurrentLocation(json) {
	current_location = {
		city: json.city,
		country_code: json.country_code,
		latitude: json.latitude,
		longitude: json.longitude
	};
}

function doEverything() {
	if (current_location && airport_locations) {

	}
}

function processAirportLocations(cities) {
	var popular_dictionary = [];
	var first_word_dictionary = [];

	cities.forEach(function (city_info) {
		if (!popular_dictionary[city_info.City]) {
			popular_dictionary[city_info.City] = city_info;
		}
	});

	for (var city_name in popular_dictionary) {
		if (popular_dictionary.hasOwnProperty(city_name)) {
			var first_word = popular_dictionary[city_name].City.split(' ').shift();

			if (!first_word_dictionary[first_word]) {
				first_word_dictionary[first_word] = [];
			}

			first_word_dictionary[first_word].push(popular_dictionary[city_name]);
		}
	}

	var paragraphs = document.querySelectorAll('p');

	[].forEach.call(paragraphs, function(p) {
		var textNodes = p.childNodes;
		
		traverseChildNodes(p, first_word_dictionary);
	});
}

function traverseChildNodes(node, first_word_dictionary) {
 
    var next;
 
    if (node.nodeType === 1 && node.tagName !== 'A' && node.tagName !== 'SPAN') {
        if (node = node.firstChild) {
            do {
                // Recursively call traverseChildNodes
                // on each child node
                next = node.nextSibling;
                traverseChildNodes(node, first_word_dictionary);
            } while(node = next);
        }
 
    }
    else if (node.nodeType === 3) {
    	var matching_regexes = [];
    	var node_data = node.data;

    	for (var city_first in first_word_dictionary) {

        	if (first_word_dictionary.hasOwnProperty(city_first)) {
        		/*
        		Possibilities:
        		San => [San Francisco, San Diego, San Jose]

        		Portland => [Portland]
        		 */
        		var lookahead = '(?=([\\s\\n\\r]+[a-z]|[\\s\\n\\r]*$|,))';
        		
    			// if there's only one word in the city name
    			// we know there's only one entry in the first_word_dictionary[city_first] array
    			if (first_word_dictionary[city_first].length === 1) {
    				var first_word_regex = new RegExp('\\b' + city_first + lookahead);

	        		if (first_word_regex.test(node_data)) {  
        				var city_info = first_word_dictionary[city_first][0];

        				matching_regexes.push(first_word_regex);

						delete first_word_dictionary[city_first];
    				}
    			}
    			else {
    				var first_word_regex = new RegExp('\\b' + city_first + '\\b');

	        		if (first_word_regex.test(node_data)) {    

	    				for (var c = 0; c < first_word_dictionary[city_first].length; c++) {
	        				var city_info = first_word_dictionary[city_first][c];
	    						
							var has_replaced = false;

							var full_name_regex = new RegExp('\\b' + city_info.City.split(' ').join('[\\s\\n\\r]+') + lookahead);

							if (full_name_regex.test(node_data)) {
								matching_regexes.push(full_name_regex);

	    						first_word_dictionary[city_first].splice(c, 1);
	    						c--;
							}
	        			}
	        		}
    			}
        	}
        }

        if (matching_regexes.length) {
        	wrapMatchesInNode(node, matching_regexes);
        }
    }
}

function wrapMatchesInNode(textNode, matching_regexes) {
 
	var temp = document.createElement('div');

	temp.innerHTML = textNode.data;

	matching_regexes.forEach(function(matching_regex) {
		temp.innerHTML = temp.innerHTML.replace(matching_regex, '<span style="display:inline-block">$&<a href="http://tnooz.local/lookup?$&">&#9992;</a></span>');
	});
	
	while (temp.firstChild) {
	    textNode.parentNode.insertBefore(temp.firstChild, textNode);
	}

	textNode.parentNode.removeChild(textNode);
}

function getParagraphs() {}