
console.log("in popup.js");

// Provided a referenced to a callback function, finds the URL of the
// current tab and routes it to the callback function.
function getCurrentUrl(callback)
{
	chrome.runtime.sendMessage({func: "get_url"},function(response)
	{
		callback(String(response.data));
	});
}

function getHttpXml(url)
{
	var xml_http = new XMLHttpRequest();
	xml_http.open("GET",url,false);
	xml_http.send(null);
	return xml_http.responseText;
}

// callback for getCurrentUrl
function processUrl(url)
{
    let cleaned_url=url.split("/").join("&slash;");

    let server_ip="http://127.0.0.1";
    let server_port="5002";

    let built_url=server_ip+":"+server_port+"/count/"+cleaned_url;

    console.log(built_url);

    let results=getHttpXml(built_url);
    console.log(results);

	var text = document.body.innerHTML; // get all inner html on page
	var links = text.split("<a"); // split on " "
	var new_text = ""; // to hold wrapped links

    for(let i=0; i<links.length; i+=1){
        console.log(links[i]);
    }


	//document.body.innerHTML = new_text;

}

// Call getCurrentUrl function with the processUrl function being called
// after getCurrentUrl has called callback. The value provided to callback
// by getCurrentUrl will be routed as the input to processUrl
getCurrentUrl(processUrl);