
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

function get_link_count(url){
	let cleaned_url=url.split("/").join("&slash;");
    let server_ip="http://127.0.0.1";
    let server_port="5002";
	let built_url=server_ip+":"+server_port+"/count/"+cleaned_url;	
	let results=getHttpXml(built_url);
	try{
		return JSON.parse(results)['count'];
	} catch {
		return "0";
	}
}

// callback for getCurrentUrl
function processUrl(url)
{
    // let cleaned_url=url.split("/").join("&slash;");
    // let server_ip="http://127.0.0.1";
    // let server_port="5002";
    // let built_url=server_ip+":"+server_port+"/count/"+cleaned_url;
    // console.log(built_url);
    // let results=getHttpXml(built_url);
    // console.log(results);

	var html = document.body.innerHTML; // get all inner html on page
	var links = html.split("<a"); // split on " "
	var new_html = links[0]; // to hold wrapped links

    for(let i=1; i<links.length; i+=1){
		let cur=links[i];
		//console.log(cur);
		let start_idx=cur.indexOf("href=\"")+6;
		if (start_idx==5){
			start_idx=cur.indexOf("href =\"")+7;
			if (start_idx==6){
				new_html+="<a "+cur;
				continue;
			}
		}
		let end_idx=cur.indexOf("\"",start_idx);
		if (end_idx==-1){
			new_html+="<a "+cur;
			continue;
		}
		let cur_url=cur.slice(start_idx,end_idx);
		let count=get_link_count(cur_url);
		new_html+="<a title=\"Linked to by "+count+" pages\" "+cur;
    }
	document.body.innerHTML = new_html;
}

// Call getCurrentUrl function with the processUrl function being called
// after getCurrentUrl has called callback. The value provided to callback
// by getCurrentUrl will be routed as the input to processUrl
getCurrentUrl(processUrl);