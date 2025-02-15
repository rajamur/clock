//
// DJax - by Doug Johnson
// Last updated Nov 26, 2018
//

function DJNodeScriptReplace(node) 
{
	if ( DJNodeScriptIs(node) === true ) 
	{
		node.parentNode.replaceChild( DJNodeScriptClone(node) , node );
	}
	else 
	{
		i = 0;
		children = node.childNodes;
		while ( i < children.length ) 
		{
			DJNodeScriptReplace( children[i++] );
		}
	}

	return node;
}

function DJNodeScriptIs(node) 
{
	return node.tagName === 'SCRIPT';
}

function DJNodeScriptClone(node)
{
	script  = document.createElement("script");
	script.text = node.innerHTML;
	for( i = node.attributes.length-1; i >= 0; i-- ) 
	{
		script.setAttribute( node.attributes[i].name, node.attributes[i].value );
	}
	return script;
}

function djax(url, onsuccess, onfail)
{
	try
	{
		xmlHttp=new XMLHttpRequest();
	}
	catch (e)
	{
		try
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			try
			{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)
			{
				return false;
			}
		}
	}
	xmlHttp.onreadystatechange=function()
	{
		if (this.readyState==4)
		{
			if (this.status==200)
			{
				if (typeof onsuccess !== 'undefined' && onsuccess !== null)
					onsuccess(this);
			}
			else
			{
				if (typeof onfail !== 'undefined' && onfail !== null)
					onfail(this);
			}
		}
	}
	xmlHttp.open("GET",url,true);
	xmlHttp.send(null);
}

function djaxpost(url, data, onsuccess, onfail, mimetype)
{
	if (mimetype === undefined)
		mimetype = 'application/x-www-form-urlencoded';
	try
	{
		xmlHttp=new XMLHttpRequest();
	}
	catch (e)
	{
		try
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			try
			{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)
			{
				return false;
			}
		}
	}
	xmlHttp.onreadystatechange=function()
	{
		if (this.readyState==4)
		{
			if (this.status==200)
			{
				if (typeof onsuccess !== 'undefined' && onsuccess !== null)
					onsuccess(this);
			}
			else
			{
				if (typeof onfail !== 'undefined' && onfail !== null)
					onfail(this);
			}
		}
	}
	xmlHttp.open("POST", url, true);
	xmlHttp.setRequestHeader("Content-type", mimetype);
	xmlHttp.send(data);
}

function djaxobj(url, onsuccess, onfail, obj)
{
	try
	{
		xmlHttp=new XMLHttpRequest();
	}
	catch (e)
	{
		try
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			try
			{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)
			{
				return false;
			}
		}
	}
	xmlHttp.onreadystatechange=function()
	{
		if (this.readyState==4)
		{
			if (this.status==200)
			{
				if (typeof onsuccess !== 'undefined' && onsuccess !== null)
					onsuccess(this, obj);
			}
			else
			{
				if (typeof onfail !== 'undefined' && onfail !== null)
					onfail(this, obj);
			}
		}
	}
	xmlHttp.open("GET",url,true);
	xmlHttp.send(null);
}

function djaxpostobj(url, data, onsuccess, onfail, obj, mimetype)
{
	if (mimetype === undefined)
		mimetype = 'application/x-www-form-urlencoded';
	try
	{
		xmlHttp=new XMLHttpRequest();
	}
	catch (e)
	{
		try
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			try
			{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)
			{
				return false;
			}
		}
	}
	xmlHttp.onreadystatechange=function()
	{
		if (this.readyState==4)
		{
			if (this.status==200)
			{
				if (typeof onsuccess !== 'undefined' && onsuccess !== null)
					onsuccess(this, obj);
			}
			else
			{
				if (typeof onfail !== 'undefined' && onfail !== null)
					onfail(this, obj);
			}
		}
	}
	xmlHttp.open("POST", url, true);
	xmlHttp.setRequestHeader("Content-type", mimetype);
	xmlHttp.send(data);
}

function djaxUpdate(url, divobj, hideobj)
{
	div = document.getElementById(divobj);
	if (div!=null)
	{
		div.style.opacity=0.5;
	}
	if (hideobj!=null)
	{
		hideobj = document.getElementById(hideobj);
		if (hideobj!=null)
		{
			hideobj.style.display='';
			hideobj.style.opacity=1.0;
		}
	}
	try
	{
		xmlHttp=new XMLHttpRequest();
	}
	catch (e)
	{
		try
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			try
			{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)
			{
				return false;
			}
		}
	}
	xmlHttp.onreadystatechange=function()
	{
		if (xmlHttp.readyState==4 && xmlHttp.status==200)
		{
			if (div!=null)
			{
				div.innerHTML = xmlHttp.responseText;
				if (div.style.display=='none')
					div.style.display = '';
				DJNodeScriptReplace(div);
				div.style.opacity=1.0;
			}
			if (hideobj!=null)
			{
				hideobj.style.display='none';
			}
		}
	}
	xmlHttp.open("GET",url,true);
	xmlHttp.send(null);
}

function djaxpostUpdate(url, data, divobj, hideobj)
{
	div = document.getElementById(divobj);
	div.style.opacity=0.5;
	hideobj = document.getElementById(hideobj);
	if (hideobj!=null)
	{
		hideobj.style.display='';
		hideobj.style.opacity=1.0;
	}
	try
	{
		xmlHttp=new XMLHttpRequest();
	}
	catch (e)
	{
		try
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			try
			{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)
			{
				return false;
			}
		}
	}
	xmlHttp.onreadystatechange=function()
	{
		if (xmlHttp.readyState==4)
		{
			if (xmlHttp.status==200)
			{
				div.innerHTML = xmlHttp.responseText;
				if (div.style.display=='none')
					div.style.display = '';
				x = div.getElementsByTagName("script");   
				for(i=0;i<x.length;i++)  
				{  
					eval(x[i].text);  
				}
			} else {
				div.innerHTML = 'Server returned '+xmlHttp.status+' response.<br>'+xmlHttp.responseText;
			}
			div.style.opacity=1.0;
			if (hideobj!=null)
			{
				hideobj.style.display='none';
			}
		}
	}
	xmlHttp.open("POST",url,true);
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlHttp.send(data);
}

function djaxClipboard(url, format)
{
	try
	{
		xmlHttp=new XMLHttpRequest();
	}
	catch (e)
	{
		try
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			try
			{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)
			{
				return false;
			}
		}
	}
	xmlHttp.onreadystatechange=function()
	{
		if (xmlHttp.readyState==4)
		{
			window.clipboardData.setData(format,xmlHttp.responseText);
		} 
	}
	xmlHttp.open("GET",url,true);
	xmlHttp.send(null);
}

Array.prototype.remove = function(from, to) 
{
	rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

if (!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function(elt)
	{
		len = this.length;
		from = Number(arguments[1]) || 0;
		from = (from < 0)
			 ? Math.ceil(from)
			 : Math.floor(from);
		if (from < 0)
			from += len;
		for (; from < len; from++)
		{
			if (from in this && this[from] === elt)
				return from;
		}
		return -1;
	};
}

function djShowHide(name, vis)
{
	obj = document.getElementById(name);
	if (obj)
	{
		obj.style.display = (vis ? '' : 'none');
		return true;
	} else {
		return false;
	}
}

function djDisplayStyle(name, vis)
{
	obj = document.getElementById(name);
	if (obj)
	{
		obj.style.display = vis;
		return true;
	} else {
		return false;
	}
}

function djHide(name)
{
	obj = document.getElementById(name);
	if (obj)
	{
		obj.style.display = 'none';
		return true;
	} else {
		return false;
	}
}

function djShow(name)
{
	obj = document.getElementById(name);
	if (obj)
	{
		obj.style.display = 'initial';
		return true;
	} else {
		return false;
	}
}

function djShowBlock(name)
{
	obj = document.getElementById(name);
	if (obj)
	{
		obj.style.display = 'block';
		return true;
	} else {
		return false;
	}
}

function djSetCookie(c_name,value,expiredays)
{
	exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toUTCString());
}

function djDeleteCookie(c_name)
{
	djSetCookie(c_name,'',-1);
}

function djGetCookie(c_name)
{
	if (document.cookie.length>0)
	{
		c_start=document.cookie.indexOf(c_name + "=");
		if (c_start!=-1)
		{
			c_start=c_start + c_name.length+1;
			c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1) c_end=document.cookie.length;
			return unescape(document.cookie.substring(c_start,c_end));
		}
	}
	return "";
}

var djaxrequests = [];
var djaxprocessedrequests = [];
var djaxreqid = 0;
var djaxmaxreq = 8;
var djaxtimeout = 30000;
var djaxvalidatejsonmimetype = true;
var djaxdebugmode = false;
var djaxaddjsonprops = true;

var djaxoncreate = null;
var djaxonqueueing = null;
var djaxonqueue = null;
var djaxonsending = null;
var djaxonsent = null;
var djaxonreceive = null;
var djaxonerror = null;

function djaxpad(str, chars)
{
	if (typeof str!='string')
		str = str.toString();
	while (str.length<chars)
		str = '0'+str;
	return str;
}

function djaxlog(msg, force)
{
	if (djaxdebugmode || force)
	{
		dt = new Date();
		console.log('DJAX '+djaxpad(dt.getHours(),2)+':'+djaxpad(dt.getMinutes(),2)+':'+djaxpad(dt.getSeconds(),2)+'.'+djaxpad(dt.getMilliseconds(),3)
			+' Q'+djaxrequests.length+',C'+djaxprocessedrequests.length
			+' : '+msg);
	}
}

function pel(obj)
{
	return djaxgetobject(obj);
}

function pelv(obj)
{
	el = djaxgetobject(obj);
	if (el && el.value)
		return el.value;
	else if (el)
		return null;
	else
		return false;
}

function djaxgetobject(obj)
{
	if (obj && typeof obj == 'string')
	{
		obj = document.getElementById(obj);
		if (!obj)
		{
			obj = document.getElementsByName(obj);
			if (obj)
				obj = obj[0];
		}
	}
	return obj;
}

function djaxqueuejson(objtype, url, obj, onsuccess, onfail, onabandon, onsend, disableobj, autoqueue, delay)
{
	req = djaxqueue(objtype, url, 'post', obj, null, onsuccess, onfail, onabandon, onsend, disableobj, autoqueue, true, delay);
}

function djaxqueue(objtype, url, verb, data, pageelement, onsuccess, onfail, onabandon, onsend, disableobj, autoqueue, json, delay)
{
	djaxreqid++;
	if (autoqueue == undefined)
		autoqueue = true;
	if (json)
	{
		if (djaxaddjsonprops)
		{
			data.djaxsequence = djaxreqid;
			data.djaxcreatedate = new Date();
			csrfobj = document.getElementById('csrfid');
			if (csrfobj && !data.csrfid)
				data.csrfid = csrfobj.value;
		}
	}
	pageelement = djaxgetobject(pageelement);
	disableobj = djaxgetobject(disableobj);
	let queuedate = new Date();
	let senddate = new Date();
	if (delay)
		senddate.setSeconds(senddate.getSeconds() + delay/1000);
	let req = { 
		'objtype' : objtype, 
		'url' : url, 
		'verb' : verb,
		'data' : data,
		'id' : djaxreqid, 
		'json' : json,
		'pageelement' : pageelement,
		'disableobj' : disableobj,
		'onsuccess' : onsuccess,
		'onfail' : onfail,
		'onabandon' : onabandon,
		'onsend' : onsend,
		'status' : 'new',
		'delay' : delay,
		'queued' : queuedate,
		'senddate' : senddate,
		'sent' : null
	};
	if (djaxoncreate)
		djaxoncreate(req);
	djaxlog(req.objtype+':'+req.id+' created');
	if (disableobj)
	{
		disableobj.disabled = true;
		disableobj.style.opacity = 0.5;
	}
	if (autoqueue)
		window.setTimeout( function() { djaxaddtoqueue(req); }, 100 );
	return req;
}

function djaxaddtoqueue(req, servicequeue)
{
	if (servicequeue === undefined)
		servicequeue = true;
	i=0;
	doqueue = true;
	now = new Date();
	if (req.objtype)
	{
		while (i<djaxrequests.length)
		{
			preq = djaxrequests[i];
			if (preq.objtype == req.objtype && preq.id<req.id && (preq.status=='pending' || preq.status=='new') && (req.senddate<=preq.senddate))
			{
				djaxlog(preq.objtype+':'+preq.id+' abandoned; superceded by '+req.objtype+':'+req.id);
				djaxdoabandon(preq, 'Superceded');
				djaxrequests.splice(i,1);
			}
			else if (preq.objtype == req.objtype && preq.id>req.id)
			{
				doqueue = false;
				i++;
			}
			else
				i++;
		}
	}
	if (doqueue)
	{
		req.status = 'pending';
		djaxlog(req.objtype+':'+req.id+' queued');
		if (djaxonqueueing)
			djaxonqueueing(req);
		djaxrequests.push(req);
		if (servicequeue)
			djaxservicequeue();
	}
	else
		djaxdoabandon(req, 'Newer request already queued');
}

function djaxrequeue(req, servicequeue, delay)
{
	djaxreqid++;
	senddate = new Date();
	if (delay)
		senddate.setSeconds(senddate.getSeconds() + delay/1000);
	req.id = djaxreqid;
	req.queued = new Date();
	req.sent = senddate;
	req.status='new';
	djaxlog(req.objtype+':'+req.id+' Requeued');
	djaxaddtoqueue(req, servicequeue);
}

function djaxreqcount(reqtype)
{
	result = 0;
	for(i=0; i<djaxrequests.length; i++)
	{
		req = djaxrequests[i];
		if (!reqtype || req.status == reqtype)
			result++;
	}
	return result;
}

function djaxservicequeue()
{
	activereq = djaxreqcount('active');
	pendreq = djaxreqcount('pending');
	remain = djaxmaxreq - activereq;
	now = new Date();
	if (pendreq>0 && remain>0)
	{
		for(i=0; i<djaxrequests.length; i++)
		{
			req = djaxrequests[i];
			if (req.status == 'pending' && (req.senddate<=now))
			{
				djaxlog(req.objtype+':'+req.id+' sending');
				try
				{
					req.status = 'sending';
					if (req.onsend)
						req.onsend(req);
					if (djaxonsending)
						djaxonsending(req);
					djaxlog(req.objtype+':'+req.id+' sending to '+req.url);
					if (req.json && djaxaddjsonprops)
					{
						req.data.djaxsenddate = new Date();
						req.data.djaxcreatedate = req.queued;
					}
					if (req.verb.toLowerCase() == 'post')
					{
						djaxlog('posting');
						if (req.json)
							djaxpostobj(req.url, JSON.stringify(req.data), djaxsuccess, djaxfail, req, 'application/json');
						else
							djaxpostobj(req.url, req.data, djaxsuccess, djaxfail, req);
					}
					else
						djaxobj(req.url, djaxsuccess, djaxfail, req);
					if (djaxonsent)
						djaxonsent(req);
					req.status = 'active';
					req.sent = new Date();
					remain--;
					if (remain<=0)
						break;
				}
				catch(e)
				{
					djaxlog('DJAX Error servicing queue: '+e.message);
				}
			}
		}
	}
}

function djaxremovefromqueue(req)
{
	i=0;
	while (i<djaxrequests.length)
	{
		treq = djaxrequests[i];
		if (treq == req)
			djaxrequests.splice(i,1);
		else if (treq.objtype && treq.objtype==req.objtype && treq.id<req.id && (treq.status=='active' || treq.status=='pending'))
		{
			djaxlog(treq.objtype+':'+treq.id+' abandoned: superceded by '+req.objtype+':'+req.id);
			djaxdoabandon(treq, 'Superceded');
			djaxrequests.splice(i,1);
		}
		else
			i++;
	}
}

function djaxinqueue(req)
{
	result = false;
	for(i=0; i<djaxrequests.length; i++)
	{
		if (djaxrequests[req]==req)
		{
			result = true;
			break;
		}
	}
	return result;
}

function djaxalreadyprocessed(req, includecurrent)
{
	result = false;
	for(i=0; i<djaxprocessedrequests.length; i++)
	{
		treq = djaxprocessedrequests[i];
		if (treq==req)
		{
			result = true;
			break;
		}
		if (treq.objtype && treq.objtype==req.objtype && (treq.id>req.id || (includecurrent && treq.id==req.id)))
		{
			result = true;
			break;
		}
	}
	return result;
}

function djaxislatest(req)
{
	highestid = null;
	for(i=0; i<djaxrequests.length; i++)
	{
		treq = djaxrequests[i];
		if (treq.objtype && treq.objtype == req.objtype && req.id>=highestid && req.status!='pending')
			highestid = treq.id;
	}
	return (highestid===null) || (req.id==highestid);
}

function djaxdosuccess(obj, req)
{
	try
	{
		if (req.onsuccess)
		{
			req.onsuccess(obj, req)
		}
	}
	catch(e)
	{
		djaxlog(req.objtype+':'+req.id+' onsuccess error: '+e.message, true);
	}
}

function djaxdofail(obj, req, msg)
{
	try
	{
		if (req.onfail)
		{
			req.onfail(obj, req, msg);
		}
	}
	catch(e)
	{
		djaxlog(req.objtype+':'+req.id+' onfail error: '+e.message, true);
	}
}

function djaxdoabandon(req, msg)
{
	try
	{
		if (req.onabandon)
		{
			req.onabandon(req, msg);
		}
	}
	catch(e)
	{
		djaxlog(req.objtype+':'+req.id+' onabandon error: '+e.message, true);
	}
}

function djaxsuccess(xmlobj, req)
{
	if (djaxonreceive)
		djaxonreceive(req, xmlobj);
	djaxremovefromqueue(req);
	if (!djaxalreadyprocessed(req))
	{
		djaxprocessedrequests.push(req);
		if (req.status != 'Timeout')
		{
			req.status = 'success';
			dd = new Date() - req.sent;
			djaxlog(req.objtype+':'+req.id+' received in '+dd+'ms');
			contenttype = xmlobj.getResponseHeader('Content-Type');
			if (req.json)
			{
				if (!djaxvalidatejsonmimetype || (contenttype && contenttype.toLowerCase()=='application/json'))
				{
					rt = xmlobj.responseText;
					try
					{
						obj = JSON.parse(rt);
						djaxdosuccess(obj, req);
						if (obj.djax)
							djaxprocessresponse(obj.djax);
					}
					catch(e)
					{
						djaxlog(req.objtype+':'+req.id+' Error parsing return JSON: '+e.message+'\r\n  '+rt);
						djaxdofail(xmlobj, req, 'JSON parse error');
					}
				}
				else if (!req.pageelement)
					djaxdofail(xmlobj, req, 'MIME type error - expecting application/json, received: '+contenttype);
			}
			if (req.pageelement)
				req.pageelement.innerHTML = xmlobj.responseText;
			djaxdosuccess(xmlobj, req);
			if (req.disableobj)
			{
				req.disableobj.disabled = false;
				req.disableobj.style.opacity = 1.0;
			}
		}
		else
		{
			djaxlog(req.objtype+':'+req.id+' response received but abandoned; previously timed out');
		}
	}
	else
	{
		djaxlog(req.objtype+':'+req.id+' response received but abandoned: newer request already processed');
		djaxdoabandon(req, 'Newer request active');
	}
	djaxservicequeue();
}

function djaxfail(xmlobj, req)
{
	if (djaxonerror)
		djaxonerror(req, xmlobj);
	djaxremovefromqueue(req);
	if (!djaxalreadyprocessed(req))
	{
		djaxprocessedrequests.push(req);
		req.status = 'fail';
		dd = new Date() - req.sent;
		djaxlog(req.objtype+':'+req.id+' received in '+dd+'ms');
		djaxdofail(xmlobj, req, xmlobj.status+' '+xmlobj.statusText);
		if (req.disableobj)
		{
			req.disableobj.disabled = false;
			req.disableobj.style.opacity = 1.0;
		}
	}
	else
	{
		djaxlog(req.objtype+':'+req.id+' error received but abandoned: newer request already processed');
		djaxdoabandon(req, 'Newer request active');
	}
	djaxservicequeue();
}

function djaxtimer()
{
	cd = new Date();
	i=0;
	activecount = 0;
	while (i<djaxrequests.length)
	{
		req = djaxrequests[i];
		if (req.status=='active')
		{
			activecount++;
			td = cd-req.sent;
			if (djaxtimeout>0 && td>=djaxtimeout)
			{
				req.status='Timeout';
				djaxdoabandon(req,'Timeout');
			}
			else
				i++;
		}
		else
			i++;
	}
	djaxservicequeue();
}

function djexecutefunctionbyname(functionName, context, args) 
{
	namespaces = functionName.split(".");
	func = namespaces.pop();
	for (i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].apply(context, args);
}

function getselectedradiobutton(name)
{
	tags = document.getElementsByName(name);
	selected = null;
	if (tags)
	{
		for (i=0, len=tags.length; i<len; i++)
		{
			t = tags[i];
			if (t.checked)
			{
				selected=t;
				break;
			}
		}
	}
	return selected;
}

function getselectedradiovalue(name)
{
	sel = getselectedradiobutton(name);
	return sel ? sel.value : null;
}

function clearradioselection(name)
{
	tags = document.getElementsByName(name);
	if (tags)
	{
		for (i=0, len=tags.length; i<len; i++)
		{
			t = tags[i];
			t.checked = false;
		}
	}
}

function djaxprocessresponse(obj)
{
	let cmds;
	if (Array.isArray(obj))
		cmds = obj;
	else
		cmds = [obj];
	djaxlog("Processing "+cmds.length+" DJAX commands..");
	for(let i=0; i<cmds.length; i++)
	{
		let ent = cmds[i];
		switch (ent.command)
		{
			case 'update':
				if (ent.id)
				{
					djaxlog("Updating "+ent.id);
					let el = document.getElementById(ent.id);
					if (el)
					{
						if (ent.outerHTML)
							el.outerHTML = ent.outerHTML;
						if (ent.innerHTML)
							el.innerHTML = ent.innerHTML;
						if (ent.enable)
							el.disabled = false;
						else if (ent.disable)
							el.disabled = true;
						if (ent.display)
							el.style.display = ent.display;
					}
					else
						djaxlog("Page Element "+ent.id+" specified in AJAX response 'update' can't be found", true);
				}
				else
					djaxlog("Update command given with no id", true);
				break;
			case 'delete':
				if (ent.id)
				{
					djaxlog("Deleting "+ent.id);
					try
					{
						let el = document.getElementById(ent.id);
						if (el)
							el.remove();
						else
							djaxlog("Page Element "+ent.id+" specified in AJAX response 'delete' can't be found", true);
					}
					catch (e)
					{
						djaxlog("Error processing page element "+ent.id+" in AJAX response: " + e.message, true);
					}
				}
				else
					djaxlog("Delete command given with no id", true);
				break;
			case 'insert':
				if (ent.id)
				{
					djaxlog("Inserting into "+ent.id);
					try
					{
						let el = document.getElementById(ent.id);
						if (el)
							el.insertAdjacentHTML(ent.where ? ent.where : 'beforebegin', ent.outerHTML);
						else
							djaxlog("Page Element "+ent.id+" specified in AJAX response 'insert' can't be found", true);
					}
					catch (e)
					{
						djaxlog("Error processing page element "+ent.id+" in AJAX response: " + e.message, true);
					}
				}
				else
					djaxlog("Insert command given with no id", true);
				break;
			case 'enable':
				if (ent.id)
				{
					djaxlog("Enable "+ent.id);
					try
					{
						let el =document.getElementById(ent.id);
						if (el)
							el.disabled = false;
						else
							djaxlog("Page Element "+ent.id+" specified in AJAX response 'enable' can't be found", true);
					}
					catch (e)
					{
						djaxlog("Error processing page element "+ent.id+" in AJAX response: " + e.message, true);
					}
				}
				else
					djaxlog("Enable command given with no id", true);
				break;
			case 'disable':
				if (ent.id)
				{
					djaxlog("Disable "+ent.id);
					try
					{
						let el =document.getElementById(ent.id);
						if (el)
							el.disabled = true;
						else
							djaxlog("Page Element "+ent.id+" specified in AJAX response 'disable' can't be found", true);
					}
					catch (e)
					{
						djaxlog("Error processing page element "+ent.id+" in AJAX response: " + e.message, true);
					}
				}
				else
					djaxlog("Disable command given with no id", true);
				break;
			case 'enabled':
				if (ent.id)
				{
					djaxlog("Enabled "+ent.id);
					try
					{
						let el =document.getElementById(ent.id);
						if (el)
							el.disabled = !ent.value;
						else
							djaxlog("Page Element "+ent.id+" specified in AJAX response 'enabled' can't be found", true);
					}
					catch (e)
					{
						djaxlog("Error processing page element "+ent.id+" in AJAX response: " + e.message, true);
					}
				}
				else
					djaxlog("Enalbed command given with no id", true);
				break;
			case 'style':
				if (ent.id)
				{
					djaxlog("Set Style "+ent.id);
					try
					{
						let el =document.getElementById(ent.id);
						if (el)
							el.style.cssText = ent.style;
						else
							djaxlog("Page Element "+ent.id+" specified in AJAX response 'style' can't be found", true);
					}
					catch (e)
					{
						djaxlog("Error processing page element "+ent.id+" in AJAX response: " + e.message, true);
					}
				}
				else
					djaxlog("Style command given with no id", true);
				break;
			case 'class':
				if (ent.id)
				{
					djaxlog("Set Class "+ent.id);
					try
					{
						let el =document.getElementById(ent.id);
						if (el)
							el.className = ent.class;
						else
							djaxlog("Page Element "+ent.id+" specified in AJAX response 'class' can't be found", true);
					}
					catch (e)
					{
						djaxlog("Error processing page element "+ent.id+" in AJAX response: " + e.message, true);
					}
				}
				else
					djaxlog("Class command given with no id", true);
				break;
			case 'attribute':
				if (ent.id && ent.attribute)
				{
					djaxlog("Set Attribute "+ent.id);
					try
					{
						let el =document.getElementById(ent.id);
						if (el)
							el.setAttribute(ent.attribute, ent.value);
						else
							djaxlog("Page Element "+ent.id+" specified in AJAX response 'attribute' can't be found", true);
					}
					catch (e)
					{
						djaxlog("Error processing page element "+ent.id+" in AJAX response: " + e.message, true);
					}
				}
				else
					djaxlog("Attribute command missing id or attribute", true);
				break;
			case 'display':
				if (ent.id)
				{
					djaxlog("Set Display "+ent.id);
					try
					{
						let el =document.getElementById(ent.id);
						if (el)
							el.style.display = ent.value;
						else
							djaxlog("Page Element "+ent.id+" specified in AJAX response 'display' can't be found", true);
					}
					catch (e)
					{
						djaxlog("Error processing page element "+ent.id+" in AJAX response: " + e.message, true);
					}
				}
				else
					djaxlog("Display command given with no id", true);
				break;
			case 'value':
				if (ent.id)
				{
					djaxlog("Set Value "+ent.id);
					try
					{
						let el =document.getElementById(ent.id);
						if (el)
							el.value = ent.value;
						else
							djaxlog("Page Element "+ent.id+" specified in AJAX response 'value' can't be found", true);
					}
					catch (e)
					{
						djaxlog("Error processing page element "+ent.id+" in AJAX response: " + e.message, true);
					}
				}
				else
					djaxlog("Value command given with no id", true);
				break;
			case 'valueifempty':
				if (ent.id)
				{
					djaxlog("Set Value If Empty "+ent.id);
					try
					{
						let el =document.getElementById(ent.id);
						if (el)
						{
							if (!el.value)
								el.value = ent.value;
						}
						else
							djaxlog("Page Element "+ent.id+" specified in AJAX response 'valueifempty' can't be found", true);
					}
					catch (e)
					{
						djaxlog("Error processing page element "+ent.id+" in AJAX response: " + e.message, true);
					}
				}
				else
					djaxlog("Value command given with no id", true);
				break;
			case 'valueunmodified':
				if (ent.id)
				{
					djaxlog("Set ValueIfUnmodified "+ent.id);
					try
					{
						let el =document.getElementById(ent.id);
						if (el)
						{
							if (ent.value==ent.oldvalue)
								el.value = ent.value;
							else
								djaxlog("Page Element "+ent.id+" not updated; modified by user", false);
						}
						else
							djaxlog("Page Element "+ent.id+" specified in AJAX response 'valueunmodified' can't be found", true);
					}
					catch (e)
					{
						djaxlog("Error processing page element "+ent.id+" in AJAX response: " + e.message, true);
					}
				}
				else
					djaxlog("Value command given with no id", true);
				break;
			case 'show':
				if (ent.id)
				{
					djaxlog("Show "+ent.id);
					try
					{
						let el =document.getElementById(ent.id);
						if (el)
							el.style.display = '';
						else
							djaxlog("Page Element "+ent.id+" specified in AJAX response 'show' can't be found", true);
					}
					catch (e)
					{
						djaxlog("Error processing page element "+ent.id+" in AJAX response: " + e.message, true);
					}
				}
				else
					djaxlog("Show command given with no id", true);
				break;
			case 'showblock':
				if (ent.id)
				{
					djaxlog("ShowBlock "+ent.id);
					try
					{
						let el =document.getElementById(ent.id);
						if (el)
							el.style.display = 'block';
						else
							djaxlog("Page Element "+ent.id+" specified in AJAX response 'showblock' can't be found", true);
					}
					catch (e)
					{
						djaxlog("Error processing page element "+ent.id+" in AJAX response: " + e.message, true);
					}
				}
				else
					djaxlog("ShowBlock command given with no id", true);
				break;
			case 'hide':
				if (ent.id)
				{
					djaxlog("Hide "+ent.id);
					try
					{
						let el =document.getElementById(ent.id);
						if (el)
							el.style.display = 'none';
						else
							djaxlog("Page Element "+ent.id+" specified in AJAX response 'hide' can't be found", true);
					}
					catch (e)
					{
						djaxlog("Error processing page element "+ent.id+" in AJAX response: " + e.message, true);
					}
				}
				else
					djaxlog("Hide command given with no id", true);
				break;
			case 'function':
				if (ent.name)
				{
					djaxlog("Executing function "+ent.name);
					try
					{
						djexecutefunctionbyname(ent.name, window, ent.args);
					}
					catch(e)
					{
						djaxlog("Error calling function from DJAX: "+e.message+ " in " + ent.name, true);
					}
				}
				else
					djaxlog("Function command given with no function name", true);
				break;
			case 'variable':
				if (ent.name)
				{
					djaxlog("Setting variable "+ent.name);
					try
					{
						window[ent.name] = ent.value;
					}
					catch(e)
					{
						djaxlog("Error setting variable from DJAX: "+e.message+" IN "+ent.name, true);
					}
				}
				else
					djaxlog("Variable command given with no name", true);
				break;
			case 'compare':
				djaxlog("Comparing values");
				let val1;
				let val2;
				if (ent.var1)
					val1 = window[ent.var1];
				else
					val1 = ent.val1;
				if (ent.var2)
					val2 = window[ent.var2];
				else
					val2 = ent.val2;
				if (ent.equal && val1==val2)
					djaxprocessresponse(ent.equal);
				if (ent.notequal && val1!=val2)
					djaxprocessresponse(ent.notequal);
				if (ent.less && val1<val2)
					djaxprocessresponse(ent.less);
				if (ent.lessequal && val1<=val2)
					djaxprocessresponse(ent.lessequal);
				if (ent.greater && val1>val2)
					djaxprocessresponse(ent.greater);
				if (ent.greaterequal && val1>=val2)
					djaxprocessresponse(ent.greaterequal);
				break;
			case 'execute':
				if (ent.code)
				{
					djaxlog("Executing code...");
					if (ent.code)
					{
						try
						{
							eval(ent.code);
						}
						catch(e)
						{
							djaxlog("Error executing code from DJAX: "+e.message+ " in " + ent.code, true);
						}
					}
					else
						djaxlog("Execute command given with no code", true);
				}
				break;
			case 'alert':
				if (ent.text)
				{
					djaxlog("Showing alert...");
					alert(ent.text);
				}
				else
					djaxlog("Alert command given with no text", true);
				break;
			case 'updateurl':
				if (ent.url)
				{
					history.replaceState(null, ent.title ? ent.title : document.title, ent.url);
				}
				else
					djaxlog("Update URL command given with no URL", true);
				break;
			case 'redirect':
				if (ent.url)
				{
					document.location.href = ent.url;
				}
				else
					djaxlog("Redirect command given with no URL", true);
				break;
		}
	}
}

function djaxformtoobj(formobj, obj)
{
	formobj = djaxgetobject(formobj);
	els = formobj.elements;
	if (!obj || typeof obj != 'array')
		obj = [];
	for (i=0; i<els.length; i++)
	{
		let el =els[i];
		eln = el.nodeName.toLowerCase();
		elt = el.type.toLowerCase();
		if (eln=='input' && (elt=='checkbox' || elt=='radio') && el.name)
		{
			if (el.checked)
			{
				newel = { "name" : el.name, "value" : el.value };
				obj.push(newel);
			}
		}
		else if ((eln == 'input' || eln == 'select' || eln == 'textarea') && elt != 'submit' && el.name)
		{
			newel = { "name" : el.name, "value" : el.value };
			obj.push(newel);
		}
	}
	return obj;
}

function djaxformtoobj2(formobj)
{
	let obj = {};
	djaxformtoobj3(formobj, obj);
	return obj;
}

function djaxformtoobj3(formobj, obj)
{
	formobj = djaxgetobject(formobj);
	els = formobj.elements;
	if (!obj || typeof obj != 'object')
		obj = {};
	for (i=0; i<els.length; i++)
	{
		let el =els[i];
		eln = el.nodeName.toLowerCase();
		elt = el.type.toLowerCase();
		if (eln=='input' && (elt=='checkbox' || elt=='radio') && el.name)
		{
			if (el.checked)
			{
				obj[el.name] = el.value;
			}
		}
		else if ((eln == 'input' || eln == 'select' || eln == 'textarea') && elt != 'submit' && el.name)
		{
			obj[el.name] = el.value;
		}
	}
}

function djaxobjtoformdata(obj)
{
	str = "";
	for(i=0; i<obj.length; i++)
	{
		str = str + (str.length>0 ? '&' : '') + encodeURIComponent(obj[i].name) + '=' + encodeURIComponent(obj[i].value);
	}
	return str;
}

function djaxformsubmit(formobj, pageelement, alturl, json, submitbtn)
{
	formobj = djaxgetobject(formobj);
	submitbtn = djaxgetobject(submitbtn);
	pageelement = djaxgetobject(pageelement);
	method = formobj.method ? formobj.method : 'get';
	formdata = djaxformtoobj(formobj);
	formdata._isajaxform = 1;
	if (submitbtn && submitbtn.name)
		formdata.submitbutton = submitbtn.name;
	if (method=='get' || !json)
		formdata = djaxobjtoformdata(formdata);
	url = alturl ? alturl : (formobj.action ? formobj.action : document.location.href);
	if (method == 'get')
	{
		url = url + (url.indexOf('?') ? '&' : '?') + formdata;
		formdata = null;
	}
	req = djaxqueue(pageelement.id, url, method, formdata, pageelement, null, null, null, null, pageelement, true, json);
	return req;
}

var djaxtimerobj = setInterval(djaxtimer, 500);
