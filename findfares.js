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
    	var node_data = node.data;
    	console.log(node_data, (new RegExp('Bucharest')).test(node_data));
        for (var city_first in first_word_dictionary) {
        	if (first_word_dictionary.hasOwnProperty(city_first)) {
        		/*
        		Possibilities:
        		San => [San Francisco, San Diego, San Jose]

        		Portland => [Portland]
        		 */
        		var first_word_regex = new RegExp('\bBucharest\b');

        		if (first_word_regex.test(node_data)) {
        			console.log(first_word_regex);
        			
        			var start_offset = node.data.search(first_word_regex) + city_first.length;

        			for (var c = 0; c < first_word_dictionary[city_first].length; c++) {
        				var city_info = first_word_dictionary[city_first][c];
    					
    					// if there's only one word in the city name
    					// we know there's only one entry in the first_word_dictionary[city_first] array
    					if (city_info.City === city_first) {
    						wrapMatchInNode(node, first_word_regex);

    						delete first_word_dictionary[city_first];
    						break;
    					}
    					else if(first_word_dictionary[city_first].length > 1) {
    						var has_replaced = false;

    						var full_name_regex = new RexExp('\b' + first_word_dictionary[city_first].join('\b[\s\n\r]+\b') + '\b');

    						if (node_data.substring(start_offset).search(first_word_regex) === 0) {
    							wrapMatchInNode(node, first_word_regex);

	    						delete first_word_dictionary[city_first][i];
	    						continue;
    						}
    					}
        			}
		        }
        	}
        }
    }
}

function wrapMatchInNode(textNode, match_regex) {
 
	var temp = document.createElement('div');

	temp.innerHTML = textNode.data.replace(match_regex, '<span style="display:inline-block">$&<a href="http://tnooz.local/lookup?$&">&#9992;</a></span>');

	// temp.innerHTML is now:
	// "n    This order's reference number is <a href="/order/RF83297">RF83297</a>.n"
	// |_______________________________________|__________________________________|___|
	//                     |                                      |                 |
	//                 TEXT NODE                             ELEMENT NODE       TEXT NODE

	// Extract produced nodes and insert them
	// before original textNode:
	while (temp.firstChild) {
	    console.log(textNode.parentNode);
	    textNode.parentNode.insertBefore(temp.firstChild, textNode);
	}
	// Logged: 3,1,3

	// Remove original text-node:
	textNode.parentNode.removeChild(textNode);
}

function getParagraphs() {}