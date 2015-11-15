if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}

var current_location = null,
	airport_locations = null,
	ip_request,
	airport_locations_request,
	nearest_airports_request,
	container_id = 'tnooz_flightfinder_overlay',
	nearest_airports = null,
	flight_lookup_cache;

function fetchCurrentLocation() {
	if (!current_location && !ip_request) {
		var ip_location_url = 'freegeo_ip.json'; //'https://freegeoip.net/json/';

		ip_request = new XMLHttpRequest();
		ip_request.open('GET', ip_location_url, true);

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
	}
}

function fetchAirportLocations() {
	if (!airport_locations && !airport_locations_request) {
		var airport_locations_url = 'airport_locations.json';

		airport_locations_request = new XMLHttpRequest();
		airport_locations_request.open('GET', airport_locations_url, true);

		airport_locations_request.onload = function() {
			if (airport_locations_request.status >= 200 && airport_locations_request.status < 400) {
				processAirportLocations(JSON.parse(airport_locations_request.responseText));
			}
			else {
				alert('could not reach airport locations url');
			}
		};
		airport_locations_request.onerror = function() {
		  	alert('could not reach airport locations url');
		};

		airport_locations_request.send();
	}
}

function fetchNearestAirports(latitude, longitude) {
	if (!nearest_airports && !nearest_airports_request) {
		var nearest_airports_url = 'nearest_airports.json';

		nearest_airports_request = new XMLHttpRequest();
		nearest_airports_request.open('GET', nearest_airports_url + '?latitude=' + latitude + '&longitude=' + longitude, true);

		nearest_airports_request.onload = function() {
			if (nearest_airports_request.status >= 200 && nearest_airports_request.status < 400) {
				processNearestAirports(JSON.parse(nearest_airports_request.responseText));
			}
			else {
				alert('could not reach airport locations url');
			}
		};
		nearest_airports_request.onerror = function() {
		  	alert('could not reach airport locations url');
		};

		nearest_airports_request.send();
	}
}

function fetchCheapestFlights(from_airport, to_airport) {
	from_airport = from_airport.toLowerCase();
	to_airport = to_airport.toLowerCase();

	var cache_key = from_airport + '_' + to_airport;

	if (!flight_lookup_cache[cache_key]) {
		var flight_lookup = 'http://beta.flightkitty.com/tnooz?from=' + from_airport + '&to=' + to_airport;

		if (cheapest_flights_request) {
			cheapest_flights_request.abort();
		}

		cheapest_flights_request = new XMLHttpRequest();
		cheapest_flights_request.open('GET', nearest_airports_url + '?latitude=' + latitude + '&longitude=' + longitude, true);

		cheapest_flights_request.onload = function() {
			if (cheapest_flights_request.status >= 200 && cheapest_flights_request.status < 400) {
				var obj = JSON.parse(cheapest_flights_request.responseText);
				flight_lookup_cache[cache_key] = obj
				processCheapestFlights(obj);
			}
			else {
				alert('could not reach cheapest flights url');
			}
		};
		cheapest_flights_request.onerror = function() {
		  	alert('could not reach cheapest flights url');
		};

		cheapest_flights_request.send();
	}
	else {
		fetchCheapestFlights(flight_lookup_cache[cache_key]);
	}
}

function processCurrentLocation(json) {
	current_location = {
		city: json.city,
		country_code: json.country_code,
		latitude: json.latitude,
		longitude: json.longitude
	};

	fetchNearestAirports(json.latitude, json.longitude);
	fetchAirportLocations();
}

function processNearestAirports(json) {
	nearest_airports = json;
}

function processCheapestFlights(json) {
	console.log(json);
}

function distance(dx, dy) {
	return Math.sqrt(dx * dx + dy * dy);
}

function processAirportLocations(cities) {
	var popular_dictionary = [];
	var first_word_dictionary = [];

	cities.forEach(function (city_info) {
		if(distance(city_info.Lat - current_location.latitude, city_info.Long - current_location.longitude) > 3) {
			if (!popular_dictionary[city_info.City]) {
				popular_dictionary[city_info.City] = city_info;
			}
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

		var links = p.querySelectorAll('a.tnooz_flightfinder_icon');

		[].forEach.call(links, function(a) {
			a.addEventListener('mouseover', hoverLocation);
			a.addEventListener('mouseout', leaveLocation);
		});
	});

	airport_locations = popular_dictionary;
}

function traverseChildNodes(node, first_word_dictionary) {
 
    var next;
 
    if (node.nodeType === 1 && node.tagName === 'P') {
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

function hoverLocation() {
	if (window.getSelection().type !== 'None' && !window.getSelection().isCollapsed) {
		console.log('things are selected', window.getSelection());
		return;
	}

	var container_div = document.getElementById(container_id);
	this.classList.add('hovered');

	var location = this.getAttribute('data-location');

	var city_info = airport_locations[location];

	insertAfter(container_div, this);

	if (nearest_airports) {
		renderOverlayContent(city_info);
	}
}

function leaveLocation() {
	var boundRect = this.getBoundingClientRect();
	if (window.event.clientX < boundRect.left ||
		window.event.clientX > boundRect.right ||
		window.event.clientY < boundRect.bottom) {
		this.classList.remove('hovered');
	}
}

function getParents(elem) {
    var parents = [];

    for ( ; elem && elem !== document; elem = elem.parentNode ) {
		parents.push( elem );
    }

    return parents;
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function wrapMatchesInNode(textNode, matching_regexes) {
 
	var temp = document.createElement('div');

	temp.innerHTML = textNode.data;

	matching_regexes.forEach(function(matching_regex) {
		temp.innerHTML = temp.innerHTML.replace(matching_regex, '<span style="display:inline-block">$&<a href="javascript:void(0)" data-location="$&" class="tnooz_flightfinder_icon">&#9992;</a></span>');
	});
	
	while (temp.firstChild) {
	    textNode.parentNode.insertBefore(temp.firstChild, textNode);
	}

	textNode.parentNode.removeChild(textNode);
}

function addStyles() {
	var style = document.createElement('link');

	style.type = 'text/css';
	style.rel = 'stylesheet';
	style.media = 'screen';
	style.href = 'overlay.css';

	document.head.appendChild(style);
}

function renderOverlay() {
	var container_div = document.createElement('div');
	container_div.id = container_id;

	container_div.classList.add('flight_overlay');
	container_div.addEventListener('mouseout', function(e) {
		var to_parents = getParents(e.toElement);
		if(!to_parents.includes(this) && e.toElement !== this) {
			this.previousSibling.classList.remove('hovered');
		}
	});

	document.body.appendChild(container_div);
}

function renderOverlayContent(city_info) {
	var container_div = document.getElementById(container_id);

	container_div.innerHTML = '';

	var header_container = document.createElement('div');
	header_container.classList.add('header_container');

	var current_location_span = document.createElement('span');
	current_location_span.classList.add('current_location');

	var destination_select = document.createElement('select');
	var from_select = document.createElement('select');

	current_location_span.textContent = current_location.city;

	var from_span = document.createElement('span');
	from_span.classList.add('from');
	from_span.textContent = 'From ';

	var to_span = document.createElement('span');
	to_span.classList.add('to');
	to_span.textContent = ' to ';

	var current_div = document.createElement('div');
	var destination_div = document.createElement('div');

	var destination_span = document.createElement('span');
	destination_span.classList.add('destination');

	destination_span.textContent = city_info.City;

	if (city_info.CountryCode !== current_location.country_code) {
		destination_span.textContent += ', ' + city_info.Country;
	}

	current_div.appendChild(from_span);
	current_div.appendChild(current_location_span);

	destination_div.appendChild(to_span);
	destination_div.appendChild(destination_span);

	if (nearest_airports.length > 1) {
		nearest_airports.forEach(function(airport) {
			var option = document.createElement('option');
			option.text = airport;
			if (current_location.preferred_airport === airport) {
				option.selected = true;
			}
			from_select.appendChild(option);
		});

		current_div.appendChild(from_select);

		from_select.addEventListener('change', function() {
			current_location.preferred_airport = this.value;
			processCheapestFlights(this.value, city_info.Airports.length > 1 ? destination_select.value : city_info.Airports[0]);
		});
	}
	else {
		var location_airport_span = document.createElement('span');
		location_airport_span.textContent = ' (' + nearest_airports[0] + ')';
		current_div.appendChild(location_airport_span);
	}

	if (city_info.Airports.length > 1) {
		city_info.Airports.forEach(function(airport) {
			console.log(airport);
			var option = document.createElement('option');
			option.text = airport;
			if (city_info.preferred_airport === airport) {
				option.selected = true;
			}
			destination_select.appendChild(option);
		});

		destination_span.appendChild(destination_select);

		destination_select.addEventListener('change', function() {
			city_info.preferred_airport = this.value;
			processCheapestFlights(nearest_airports.length > 1 ? from_select.value : nearest_airports[0], this.value);
		});
	}
 	else {
 		var destination_airport_span = document.createElement('span');
		destination_airport_span.textContent = ' (' + city_info.Airports[0] + ')';
		destination_div.appendChild(destination_airport_span);
 	}

	header_container.appendChild(current_div);
	header_container.appendChild(destination_div);

	container_div.appendChild(header_container);


}

fetchCurrentLocation();
addStyles();
renderOverlay();
