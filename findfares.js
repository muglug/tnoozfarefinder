var ip_location_url = 'https://freegeoip.net/json/';

var ip_request = new XMLHttpRequest();
ip_request.open('GET', ip_location_url, true);

ip_request.onload = function() {
  if (ip_request.status >= 200 && ip_request.status < 400) {
    processLocation(JSON.parse(ip_request.responseText));
  }
  else {
    alert('could not reach ip location url');
  }
};
ip_request.onerror = function() {
  alert('could not reach ip location url');
};

ip_request.send();

function processLocation(json) {
	var city = json.city;
	var country_code = json.country_code;

	var latitude = json.latitude;
	var longitude = json.longitude;
}

function processText(airport_locations) {
	var paragraphs = document.querySelectorAll('p');

	[].forEach.call(paragraphs, function(p) {
		var textNodes = p.childNodes;
		
		traverseChildNodes(p);
	});
}

function traverseChildNodes(node) {
 
    var next;
 
    if (node.nodeType === 1 && node.tagName !== 'A' && node.tagName !== 'SPAN') {
        if (node = node.firstChild) {
            do {
                // Recursively call traverseChildNodes
                // on each child node
                next = node.nextSibling;
                traverseChildNodes(node);
            } while(node = next);
        }
 
    }
    else if (node.nodeType === 3) {
        // (Text node)
 
        if (/\bBucharest\b/.test(node.data)) {
            wrapMatchesInNode(node)
        }
    }
}


function wrapMatchesInNode(textNode) {
 
	var temp = document.createElement('div');

	temp.innerHTML = textNode.data.replace(/\bBucharest\b/g, '<span style="display:inline-block">$&<a href="http://tnooz.local/lookup?$&">&#9992;</a></span>');

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

processText([]);

function getParagraphs() {}