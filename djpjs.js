//
// DJP JS Library
// Updated May 18, 2020
//

var DJPPageLoadTime = (new Date).getTime();
var DJPRefreshList = [];
var DJPUpdateEvents = [];

function DJPAutoUpdateElement(id, list)
{
	id = djaxgetobject(id);
	let ent = { 'id' : id.id, 'listtype' : list, 'lastupdate' : DJPPageLoadTime, 'type' : 'element' };
	DJPRefreshList.push(ent);
	//DJPRegisterUpdate(list, DJPPageLoadTime);
}

function DJPAutoUpdatePage(list)
{
	let ent = { 'id' : null, 'listtype' : list, 'lastupdate' : DJPPageLoadTime, 'type' : 'page' };
	DJPRefreshList.push(ent);
	//DJPRegisterUpdate(list, DJPPageLoadTime);
}

function DJPAutoUpdateDiv(list, div, url)
{
	div = djaxgetobject(div);
	let ent = { 'id' : div.id, 'listtype' : list, 'lastupdate' : DJPPageLoadTime, 'type' : 'div', 'url' : url };
	DJPRefreshList.push(ent);
	//DJPRegisterUpdate(list, DJPPageLoadTime);
}

function DJPCheckRefresh()
{
	let i;
	let ctime = (new Date).getTime();
	for (i=0; i<DJPRefreshList.length; i++)
	{
		let ent = DJPRefreshList[i];
		let lskey = 'DJPListUpdate:'+ent.listtype;
		let lu = localStorage.getItem(lskey);
		if (ent.type=='element' && lu && lu>ent.lastupdate && lu<ctime-4000)
		{
			ent.lastupdate = ctime;
			DJPRefreshList[i] = ent;
			let req = { 'listtype' : ent.listtype, 'id' : ent.id, 'value' : pelv(ent.id) };
			djaxqueuejson('AutoUpdateList:'+ent.id, 'updatedlists.php', req);
		}
		else if (ent.type=='page' && lu && lu>ent.lastupdate && lu<ctime)
		{
			ent.lastupdate = ctime;
			DJPRefreshList[i] = ent;
			location.reload();
		}
		else if (ent.type=='div' && lu && lu>ent.lastupdate && lu<ctime-4000)
		{
			ent.lastupdate = ctime;
			DJPRefreshList[i] = ent;
			djaxUpdate(ent.url, ent.id);
		}
		if (lu && lu<ctime-30000)
		{
			localStorage.removeItem(lskey);
		}
	}
}

function DJPRegisterUpdate(list, timestamp)
{
	if (!timestamp)
		timestamp = (new Date).getTime();
	let lskey = 'DJPListUpdate:'+list;
	localStorage.removeItem(lskey);
	localStorage.setItem(lskey, timestamp);
}

function DJPFormSubmitUpdate(evt)
{
	let i;
	for(i=0; i<DJPUpdateEvents.length; i++)
	{
		let ent = DJPUpdateEvents[i];
		if (evt.target == ent.form)
			DJPRegisterUpdate(ent.list);
	}
}

function DJPRegisterForm(formobj, list)
{
	let updateevent = { 'form' : pel(formobj), 'list' : list }
	DJPUpdateEvents.push(updateevent);
	pel(formobj).addEventListener('submit', DJPFormSubmitUpdate);
}

var DJPPageLoadInterval = setInterval(DJPCheckRefresh, 250);

function DJPRenewCSRF()
{
	let csrfid = pelv('csrfid');
	if (csrfid)
	{
		djaxUpdate('csrfrenew.php?id='+encodeURIComponent(csrfid),null,null);
	}
}

var DJPRenewCSRFInterval = setInterval(DJPRenewCSRF, 50*60*1000);

function getObjectPosition(obj)
{
	obj = djaxgetobject(obj);
	let nx = obj.offsetLeft;
	let ny = obj.offsetTop;
	let co = obj;
	while (co.offsetParent)
	{
		co = co.offsetParent;
		nx += co.offsetLeft;
		ny += co.offsetTop;
	}
	return { x1: nx, y1: ny, x2: nx + obj.offsetWidth, y2: ny + obj.offsetHeight };
}

function SetRelativePosition(obj, relativeto, xoffset, yoffset)
{
	if (xoffset===undefined)
		xoffset = 0;
	if (yoffset===undefined)
		yoffset = 0;
	obj = djaxgetobject(obj);
	relativeto = djaxgetobject(relativeto);
	let co = relativeto;
	let nx = co.offsetLeft;
	let ny = co.offsetTop;
	while (co.offsetParent)
	{
		co = co.offsetParent;
		nx += co.offsetLeft;
		ny += co.offsetTop;
	}
	console.log('nx1 '+nx+' ny1 '+ny);
	co = obj;
	nx += xoffset;
	ny += yoffset;
	while (co.offsetParent)
	{
		co = co.offsetParent;
		nx -= co.offsetLeft;
		ny -= co.offsetTop;
	}
	console.log('nx2 '+nx+' ny2 '+ny);
	obj.style.left = nx+'px';
	obj.style.top = ny+'px';
}

// Simulates PHP's date function
Date.prototype.format = function(format) {
	var returnStr = '';
	var replace = Date.replaceChars;
	for (var i = 0; i < format.length; i++) 
	{
		let curChar = format.charAt(i);
		if (i - 1 >= 0 && format.charAt(i - 1) == "\\") 
			returnStr += curChar;
		else if (replace[curChar]) 
			returnStr += replace[curChar].call(this);
		else if (curChar != "\\")
			returnStr += curChar;
	}
	return returnStr;
};

Date.prototype.formatUTC = function(format) {
	var returnStr = '';
	var replace = Date.replaceCharsUTC;
	for (var i = 0; i < format.length; i++) 
	{
		let curChar = format.charAt(i);
		if (i - 1 >= 0 && format.charAt(i - 1) == "\\") 
			returnStr += curChar;
		else if (replace[curChar]) 
			returnStr += replace[curChar].call(this);
		else if (curChar != "\\")
			returnStr += curChar;
	}
	return returnStr;
};

Date.replaceChars = {
	shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

	// Day
	d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
	D: function() { return Date.replaceChars.shortDays[this.getDay()]; },
	j: function() { return this.getDate(); },
	l: function() { return Date.replaceChars.longDays[this.getDay()]; },
	N: function() { return this.getDay() + 1; },
	S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
	w: function() { return this.getDay(); },
	z: function() { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now
	// Week
	W: function() { var d = new Date(this.getFullYear(), 0, 1); return Math.ceil((((this - d) / 86400000) + d.getDay() + 1) / 7); }, // Fixed now
	// Month
	F: function() { return Date.replaceChars.longMonths[this.getMonth()]; },
	m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
	M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },
	n: function() { return this.getMonth() + 1; },
	t: function() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 0).getDate() }, // Fixed now, gets #days of date
	// Year
	L: function() { var year = this.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },	// Fixed now
	o: function() { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear();}, //Fixed now
	Y: function() { return this.getFullYear(); },
	y: function() { return ('' + this.getFullYear()).substr(2); },
	// Time
	a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
	A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
	B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
	g: function() { return this.getHours() % 12 || 12; },
	G: function() { return this.getHours(); },
	h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
	H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
	i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
	s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
	u: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ? '0' : '')) + m; },
	// Timezone
	e: function() { return null; },
	I: function() {
			let DST = null;
			for (let i = 0; i < 12; ++i) {
				let d = new Date(this.getFullYear(), i, 1);
				let offset = d.getTimezoneOffset();
				if (DST === null) 
					DST = offset;
				else if (offset < DST) 
				{ DST = offset; break; }
				else if (offset > DST) 
					break;
			}
			return (this.getTimezoneOffset() == DST) | 0;
		},
	O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
	P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00'; },
	T: function() { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setMonth(m); return result;},
	Z: function() { return -this.getTimezoneOffset() * 60; },
	// Full Date/Time
	c: function() { return this.format("Y-m-d\\TH:i:sP"); },
	r: function() { return this.toString(); },
	U: function() { return this.getTime() / 1000; }
};

Date.replaceCharsUTC = {
	shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

	// Day
	d: function() { return (this.getUTCDate() < 10 ? '0' : '') + this.getUTCDate(); },
	D: function() { return Date.replaceChars.shortDays[this.getUTCDay()]; },
	j: function() { return this.getUTCDate(); },
	l: function() { return Date.replaceChars.longDays[this.getUTCDay()]; },
	N: function() { return this.getUTCDay() + 1; },
	S: function() { return (this.getUTCDate() % 10 == 1 && this.getUTCDate() != 11 ? 'st' : (this.getUTCDate() % 10 == 2 && this.getUTCDate() != 12 ? 'nd' : (this.getUTCDate() % 10 == 3 && this.getUTCDate() != 13 ? 'rd' : 'th'))); },
	w: function() { return this.getUTCDay(); },
	z: function() { var d = new Date(this.getUTCFullYear(),0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now
	// Week
	W: function() { var d = new Date(this.getUTCFullYear(), 0, 1); return Math.ceil((((this - d) / 86400000) + d.getDay() + 1) / 7); }, // Fixed now
	// Month
	F: function() { return Date.replaceChars.longMonths[this.getUTCMonth()]; },
	m: function() { return (this.getUTCMonth() < 9 ? '0' : '') + (this.getUTCMonth() + 1); },
	M: function() { return Date.replaceChars.shortMonths[this.getUTCMonth()]; },
	n: function() { return this.getUTCMonth() + 1; },
	t: function() { var d = new Date(); return new Date(d.getUTCFullYear(), d.getUTCMonth(), 0).getUTCDate() }, // Fixed now, gets #days of date
	// Year
	L: function() { var year = this.getUTCFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },	// Fixed now
	o: function() { var d  = new Date(this.valueOf());  d.setUTCDate(d.getUTCDate() - ((this.getUTCDay() + 6) % 7) + 3); return d.getUTCFullYear();}, //Fixed now
	Y: function() { return this.getUTCFullYear(); },
	y: function() { return ('' + this.getUTCFullYear()).substr(2); },
	// Time
	a: function() { return this.getUTCHours() < 12 ? 'am' : 'pm'; },
	A: function() { return this.getUTCHours() < 12 ? 'AM' : 'PM'; },
	B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
	g: function() { return this.getUTCHours() % 12 || 12; },
	G: function() { return this.getUTCHours(); },
	h: function() { return ((this.getUTCHours() % 12 || 12) < 10 ? '0' : '') + (this.getUTCHours() % 12 || 12); },
	H: function() { return (this.getUTCHours() < 10 ? '0' : '') + this.getUTCHours(); },
	i: function() { return (this.getUTCMinutes() < 10 ? '0' : '') + this.getUTCMinutes(); },
	s: function() { return (this.getUTCSeconds() < 10 ? '0' : '') + this.getUTCSeconds(); },
	u: function() { var m = this.getUTCMilliseconds(); return (m < 10 ? '00' : (m < 100 ? '0' : '')) + m; },
	// Timezone
	e: function() { return null; },
	I: function() {
			let DST = null;
			for (let i = 0; i < 12; ++i) {
				let d = new Date(this.getUTCFullYear(), i, 1);
				let offset = d.getTimezoneOffset();
				if (DST === null) 
					DST = offset;
				else if (offset < DST) 
				{ DST = offset; break; }
				else if (offset > DST) 
					break;
			}
			return (this.getTimezoneOffset() == DST) | 0;
		},
	O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
	P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00'; },
	T: function() { var m = this.getUTCMonth(); this.setUTCMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setUTCMonth(m); return result;},
	Z: function() { return -this.getTimezoneOffset() * 60; },
	// Full Date/Time
	c: function() { return this.format("Y-m-d\\TH:i:sP"); },
	r: function() { return this.toString(); },
	U: function() { return this.getTime() / 1000; }
};

var djactivedatetimer = null;
var djactivedates = [];

function djpAddActiveDate(dateval, inpast, relto)
{
	if (inpast === undefined) inpast = true;
	relto = relto===undefined ? null : new Date(relto);
	let id = 'djpactdate['+Math.floor(Math.random()*1000000000)+']';
	adobj = { 'id': id, 'date' : new Date(dateval), 'inpast' : inpast, 'asutc' : false };
	djactivedates.push(adobj);
	if (djactivedatetimer === null)
		djactivedatetimer = setInterval(djpActiveDateUpdate, 5000);
	document.write('<span id="'+id+'"></span>');
	djpActiveDateUpdateDate(adobj);
}

function djpActiveDateUpdate()
{
	for(let i=0; i<djactivedates.length; i++)
	{
		djpActiveDateUpdateDate(djactivedates[i]);
	}
}

function djpActiveDateUpdateDate(obj)
{
	let elem = document.getElementById(obj.id);
	if (elem)
	{
		let relto = obj.relto ? obj.relto : new Date();
		let sameday = relto.format('Y-m-d')==obj.date.format('Y-m-d');
		let datepart = obj.date.format('Y-m-d');
		let curdate = relto.format('Y-m-d');
		let yesterday = new Date(new Date(curdate).getTime()-1).format('Y-m-d');
		let weekago = new Date(new Date(curdate).getTime()-86400000*6).format('Y-m-d');
		let weekfn = new Date(new Date(curdate).getTime()+86400000*6-1).format('Y-m-d');
		let diff = (relto.getTime() - obj.date.getTime())/1000;
		let str = obj.date.format('Y-m-d H:i:s');
		if (diff>-60 && diff<60)
			str = 'Just Now';
		else if (diff>0 && diff<3600)
			str = Math.floor(diff/60)+'m ago';
		else if (diff<0 && diff>-3600)
			str = Math.floor(-diff/60)+'m from now';
		else if (diff>=3600 && diff<86400)
			str = Math.floor(diff/3600)+'h ago';
		else if (diff<=-3600 && diff>-86400)
			str = Math.floor(-diff/3600)+'h from now';
		else if (diff>0 && datepart==yesterday)
			str = 'Yesterday '+obj.date.format('g:ia');
		else if (diff>0 && diff<86400*7 && obj.inpast)
			str = obj.date.format('D g:ia');
		else if (diff<0 && diff>-86400*7 && !obj.inpast)
			str = obj.date.format('D g:ia');
		else if (diff>0 && diff<86400*365 && obj.inpast)
			str = obj.date.format('M j');
		else if (diff<0 && diff<-86400*365 && !obj.inpast)
			str = obj.date.format('M j');
		else 
			str = obj.date.format('M j, Y');
		elem.innerHTML = str;
	}
}

function djpDateToTimeZoneParts(dt, tzone)
{
	if (dt)
	{
		if (typeof(dt)!='Date')
			dt = new Date(dt);
		let str = dt.toLocaleString('en-gb-u-ca-gregory', {formatMatcher: 'basic', timeZone: tzone });
		let parts1 = str.split(' ');
		if (parts1.length==2)
		{
			let parts2 = parts1[0].trim(',').split('/');
			let parts3 = parts1[1].split(':');
			let obj = {
				year: parseInt(parts2[2]),
				month: parseInt(parts2[1]),
				day: parseInt(parts2[0]),
				hour: parseInt(parts3[0]),
				minute: parseInt(parts3[1]),
				second: parseInt(parts3[2]),
				millisecond: dt.getMilliseconds()
			};
			obj.date = new Date(obj.year, obj.month-1, obj.day, obj.hour, obj.minute, obj.second, obj.millisecond);
			obj.time = obj.date.getTime();
			obj.dayofweek = obj.date.getDay();
			return obj;
		}
		else
			return false;
	}
	else
		return false;
}

function djpOutDateTimeString(dt)
{
	if (dt)
	{
		if (typeof(dt)!='Date')
			dt = new Date(dt);
		let str = dt.toLocaleString();
		document.write(str);
	}
}

function djpOutDateString(dt)
{
	if (dt)
	{
		if (typeof(dt)!='Date')
			dt = new Date(dt);
		let str = dt.toLocaleDateString();
		document.write(str);
	}
}

function djpOutTimeString(dt)
{
	if (dt)
	{
		if (typeof(dt)!='Date')
			dt = new Date(dt);
		let str = dt.toLocaleTimeString();
		document.write(str);
	}
}

function djpFormatDate(dt, tzone, format)
{
	if (dt)
	{
		var returnStr = '';
		var ldate = djpDateToTimeZoneParts(dt, tzone);
		var replace = djpDatereplaceChars;
		for (var i = 0; i < format.length; i++) 
		{
			let curChar = format.charAt(i);
			if (i - 1 >= 0 && format.charAt(i - 1) == "\\") 
				returnStr += curChar;
			else if (replace[curChar]) 
				returnStr += replace[curChar].call(ldate);
			else if (curChar != "\\")
				returnStr += curChar;
		}
		return returnStr;
	}
	else
		return null;
}

djpDatereplaceChars = {
	shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

	// Day
	d: function() { return (this.day < 10 ? '0' : '') + this.day; },
	D: function() { return Date.replaceChars.shortDays[this.dayofweek]; },
	j: function() { return this.day; },
	l: function() { return Date.replaceChars.longDays[this.dayofweek]; },
	N: function() { return this.dayofweek + 1; },
	S: function() { return (this.day % 10 == 1 && this.day != 11 ? 'st' : (this.day % 10 == 2 && this.day != 12 ? 'nd' : (this.day % 10 == 3 && this.day != 13 ? 'rd' : 'th'))); },
	w: function() { return this.dayofweek; },
	z: function() { var d = new Date(this.year,0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now
	// Week
	W: function() { var d = new Date(this.year, 0, 1); return Math.ceil((((this - d) / 86400000) + d.dayofweek + 1) / 7); }, // Fixed now
	// Month
	F: function() { return Date.replaceChars.longMonths[this.month-1]; },
	m: function() { return (this.month <= 9 ? '0' : '') + (this.month + 0); },
	M: function() { return Date.replaceChars.shortMonths[this.month-1]; },
	n: function() { return this.month + 0; },
	t: function() { var d = new Date(); return new Date(d.year, d.month, 0).day }, // Fixed now, gets #days of date
	// Year
	L: function() { var year = this.year; return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },	// Fixed now
	o: function() { var d  = new Date(this);  d.setDate(d.day - ((this.dayofweek + 6) % 7) + 3); return d.year;}, //Fixed now
	Y: function() { return this.year; },
	y: function() { return ('' + this.year).substr(2); },
	// Time
	a: function() { return this.hour < 12 ? 'am' : 'pm'; },
	A: function() { return this.hour < 12 ? 'AM' : 'PM'; },
	//B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
	g: function() { return this.hour % 12 || 12; },
	G: function() { return this.hour; },
	h: function() { return ((this.hour % 12 || 12) < 10 ? '0' : '') + (this.hour % 12 || 12); },
	H: function() { return (this.hour < 10 ? '0' : '') + this.hour; },
	i: function() { return (this.minute < 10 ? '0' : '') + this.minute; },
	s: function() { return (this.second < 10 ? '0' : '') + this.second; },
	u: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ? '0' : '')) + m; },
	// Timezone
	e: function() { return null; },
	// Full Date/Time
	c: function() { return this.format("Y-m-d\\TH:i:sP"); },
	r: function() { return this.toString(); },
	U: function() { return this.getTime() / 1000; }
};

function hent(str) 
{
	let tel = document.createElement('SPAN');
	tel.textContent = str;
	return tel.innerHTML;
}

function djStrReplace(orig, find, replace)
{
	return orig.split(find).join(replace);
}

function djGetTimeZoneName( timezone, date ) 
{
	const asof = date ?? new Date();
	let opts = {};
	if (timezone)
		opts.timeZone = timezone;
	const short = asof.toLocaleDateString(undefined, opts);
	opts.timeZoneName = 'long';
	const full = asof.toLocaleDateString(undefined, opts);

	const shortIndex = full.indexOf(short);
	if (shortIndex >= 0) 
	{
		const trimmed = full.substring(0, shortIndex) + full.substring(shortIndex + short.length);
		return trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '');
	} else {
	  return full;
	}
}

function GetElementPosition(el)
{
	el = djaxgetobject(el);
	if (el)
	{
		let pos = {x : el.offsetLeft, y : el.offsetTop};
		while (el = el.offsetParent)
		{
			pos.x += (el.offsetLeft);
			pos.y += (el.offsetTop);
		}
		return pos;
	}
	else
		return false;
}

function GetElementSize(el)
{
	el = djaxgetobject(el);
	if (el)
	{
		let pos = {x : el.offsetWidth, y : el.offsetHeight};
		return pos;
	}
	else
		return false;
}

function GetElementPagePosition(el)
{
	el = djaxgetobject(el);
	if (el)
	{
		let pos = {x : el.offsetLeft, y : el.offsetTop};
		while (el = el.offsetParent)
		{
			pos.x += (el.offsetLeft - el.scrollLeft + el.clientLeft);
			pos.y += (el.offsetTop - el.scrollTop + el.clientTop);
		}
		return pos;
	}
	else
		return false;
}

function GetElementScrollOffset(el)
{
	let oel = el = djaxgetobject(el);
	if (el)
	{
		let pos = {x: 0, y: 0};
		while (el = el.parentElement)
		{
			pos.x += el.scrollLeft;
			pos.y += el.scrollTop;
		}
		return pos;
	}
	else
		return null;
}

function SetElementPagePosition(el, x, y)
{
	let oel = el = djaxgetobject(el);
	if (el)
	{
		let pos = {x: x, y: y};
		while (el = el.offsetParent)
		{
			pos.x -= (el.offsetLeft - el.scrollLeft + el.clientLeft);
			pos.y -= (el.offsetTop - el.scrollTop + el.clientTop);
		}
		oel.style.left = (pos.x)+'px';
		oel.style.top = (pos.y)+'px';
		return true;
	}
	else
		return false;
}

function SetElementPagePositionRight(el, x, y)
{
	let oel = el = djaxgetobject(el);
	if (el)
	{
		let pos = {x: (x - oel.offsetWidth), y: y};
		while (el=el.offsetParent)
		{
			pos.x -= (el.offsetLeft - el.scrollLeft + el.clientLeft);
			pos.y -= (el.offsetTop - el.scrollTop + el.clientTop);
		}
		oel.style.left = (pos.x)+'px';
		oel.style.top = (pos.y)+'px';
		return true;
	}
	else
		return false;
}

function DJPSwitchToggle(id, userfunc)
{
	let fld = pel(id);
	let state = fld && (fld.value>0);
	DJPSetToggle(id, !state, userfunc);
}

function DJPSetToggle(id, newstate, userfunc)
{
	let btn = pel(id+'-btn');
	let fld = pel(id);
	if (btn)
	{
		btn.classList.remove(newstate ? 'fa-toggle-off' : 'fa-toggle-on');
		btn.classList.add(newstate ? 'fa-toggle-on' : 'fa-toggle-off');
	}
	if (fld)
		fld.value = newstate ? '1' : '0';
	if (userfunc)
		userfunc(id, newstate);
	return newstate;
}

function DJPFindTop(el)
{
	let elp = GetElementPagePosition(el);
	if (elp)
		return elp.y;
	else
		return false;
}

function DJPFindTop2(el)
{
	let elp = GetElementPosition(el);
	if (elp)
		return elp.y;
	else
		return false;
}

function DJPScrollToTop(el, offset = 0)
{
	let ppos = GetElementPagePosition(el);
	window.scroll( { left: 0, top: ppos.y - offset, behavior: 'smooth'} );
}

function DJPScrollToPosition( offset )
{
	window.scroll( { left: 0, top: offset, behavior: 'smooth'} );
}

function EmToPixels( em )
{
	return em*Number(  // Casts numeric strings to number
	  getComputedStyle(  // takes element and returns CSSStyleDeclaration object
		document.body,null) // use document.body to get first "styled" element
			.fontSize  // get fontSize property
			 .replace(/[^\d\.]/g, '')  // simple regex that will strip out non-numbers
	);
}

function DJPScrollToTopEm(el, offset = 0)
{
	let ppos = GetElementPagePosition(el);
	window.scroll( { left: 0, top: ppos.y - EmToPixels(offset), behavior: 'smooth'} );
}

function DaysBetweenDates(date1, date2)
{
	let dt1 = new Date(date1);
	let dt2 = new Date(date2);
	return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) / 86400.0 / 1000.0);
}

function ScrollToResolver(elem) 
{
	let jump = parseInt((elem.getBoundingClientRect().top-80) * 0.2);
	if (jump<0)
	{
		document.body.scrollTop += jump;
		document.documentElement.scrollTop += jump;
		if (!elem.lastjump || elem.lastjump > Math.abs(jump)) 
		{
			elem.lastjump = Math.abs(jump);
			setTimeout(function() { ScrollToResolver(elem);}, 25);
		} else {
			elem.lastjump = null;
		}
	}
}

function DJPUpdateRecommendedFields()
{
	let els = document.getElementsByClassName('recommended');
	for(let i=0; i<els.length; i++)
	{
		let el = els[i];
		if (el.value)
			el.classList.remove('recommendedmissing');
		else
			el.classList.add('recommendedmissing');
	}
}

function DateToISO(date)
{
	return date.getFullYear().toString().padStart(4,'0') + '-' + (date.getMonth()+1).toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0');
}

function DateToUTCISO(date)
{
	return date.getUTCFullYear().toString().padStart(4,'0') + '-' + (date.getUTCMonth()+1).toString().padStart(2,'0') + '-' + date.getUTCDate().toString().padStart(2,'0');
}

Date.prototype.addDays = function(days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate()+days);
	return date;
}

function AddNewLinkURL(secid)
{
	djaxqueuejson('newurl:'+secid, 'djaxfunc.php', {'cmd' : 'geturlid', 'secid' : secid});
}

function AddNewURLLinkDJax(secid, newid)
{
	let id1 = '['+secid+'.newid]';
	let id2 = '['+secid+'.'+newid+']';
	let row = pel('newlinkrow'+id1);
	let descr = pel('newdescr'+id1);
	let url = pel('newurl'+id1);
	let view = pel('newviewopt'+id1);
	let embed = pel('newembed'+id1);
	let newrow = document.createElement('TR');
	newrow.id = 'newlinkrow['+secid+'.'+newid+']';
	newrow.innerHTML = djStrReplace(row.innerHTML,'newid',newid);
	row.parentElement.insertBefore(newrow,row);
	let row2 = pel('newlinkrow'+id2);
	let descr2 = pel('newdescr'+id2);
	let url2 = pel('newurl'+id2);
	let view2 = pel('newviewopt'+id2);
	let embed2 = pel('newembed'+id2);
	let addbtn2 = pel('addlinkbtn'+id2);
	let delbtn2 = pel('dellinkbtn'+id2);
	addbtn2.style.display='none';
	delbtn2.style.display='';
}

function DeleteLinkURL(secid, linkid)
{
	let row = pel('newlinkrow['+secid+'.'+linkid+']');
	if (row)
		row.remove();
	row = pel('linkrow['+linkid+']');
	if (row)
	{
		let delfld = pel('deleteurllink['+linkid+']');
		delfld.value = '1';
		row.remove();
	}
}

function DuplicateObject(oldelement, newid, newelid)
{
	let oldel = pel(oldelement);
	let newel = document.createElement(oldel.tagName);
	newel.innerHTML = djStrReplace(oldel.innerHTML, 'newid', newid);
	oldel.parentElement.insertBefore(newel, oldel);
	newel.id = newelid;
	return { old: oldel, new: newel };
}

function ValidateEmailAddr(field, errorfield)
{
	let req = { emailaddr : pelv(field), 'element' : errorfield };
	djaxqueuejson('emailvalidation', 'emailvalidation.php', req);
	pel(errorfield).style.display='none';
}

function DJPRadioClick(el)
{
	if (el)
	{
		let formname = el.getAttribute('data-formname');
		let bid = el.getAttribute('data-bid');
		let buttons = document.querySelectorAll("[data-formname='"+formname+"']");
		let ff = pel(formname);
		ff.value = bid;
		for (let i=0; i<buttons.length; i++)
		{
			let btn = buttons[i];
			let tbid = btn.getAttribute('data-bid');
			btn.className = 'button-like' + (tbid==bid ? '-selected' : '');
		}
	}
}

djformdatachanged = false;

window.addEventListener('load', RegisterChangeDetection);

function RegisterChangeDetection()
{
	let forms = document.getElementsByTagName('form');
	for(let f=0; f<forms.length; f++)
	{
		let els = forms[f].elements;
		for (let i=0; i<els.length; i++)
		{
			let el =els[i];
			eln = el.nodeName.toLowerCase();
			elt = el.type.toLowerCase();
			if ((eln=='input' || eln=='textarea' || eln=='select') && el.name)
			{
				if (elt!='hidden')
					el.addEventListener('change', ChangeDetectionChanged);
				if (elt=='file')
					el.addEventListener('change', FileSizeCheck);
			}
		}
	}
}

function ChangeDetectionChanged(e)
{
	djformdatachanged = true;
}

function FileSizeCheck()
{
	let fc = this.files.length;
	let toobig = "";
	let tsize = 0;
	for(let i=0; i<fc; i++)
	{
		let cfile = this.files[i];
		tsize += cfile.size;
	}
	if (tsize>50*1024*1024)
	{
		alert("Maximum file upload size is 50 megabytes. Please choose smaller or fewer files.");
		this.value = null;
	}
}

function CopyElementToClipboard(el)
{
	let element = pel(el);
	element.select();
	document.execCommand('copy');
}

function IconCheckboxToggle(element)
{
	let el = pel(element);
	let elid = el.id.substr(0,el.id.length-5);
	let formel = pel(elid);
	if (formel)
	{
		formel.checked = !formel.checked;
		if (formel.checked)
			el.classList.add('selected');
		else
			el.classList.remove('selected');
	}
}

function IconCheckboxToggle2(element, checkedclass, uncheckedclass)
{
	let el = pel(element);
	let elid = el.id.substr(0,el.id.length-6);
	let formel = pel(elid);
	if (formel)
	{
		formel.checked = !formel.checked;
		IconCheckboxFieldClicked2(formel, checkedclass, uncheckedclass);
	}
}

function IconCheckboxFieldClicked(element)
{
	let iconel = pel(element.id + '_icon');
	if (iconel)
	{
		if (element.checked)
			iconel.classList.add('selected');
		else
			iconel.classList.remove('selected');
	}
}

function IconCheckboxFieldClicked2(element, checkedclass, uncheckedclass)
{
	let frameel = pel(element.id + '_frame');
	if (frameel)
	{
		if (element.checked)
			frameel.classList.add('selected');
		else
			frameel.classList.remove('selected');
	}
	let iconel = pel(element.id + '_icon');
	if (iconel)
	{
		if (element.checked)
			iconel.className = checkedclass;
		else
			iconel.className = uncheckedclass;
	}
}


function OptionButtonChange(fieldname, newval)
{
	let els = document.querySelectorAll('[data-formgroup="' + fieldname+ '"]');
	for (let i=0; i<els.length; i++)
	{
		let el = els[i];
		let elid = el.id.split('/')[1];
		if (elid!=newval)
		{
			el.classList.remove('button-like-selected');
			el.classList.add('button-like');
		}
		else
		{
			el.classList.remove('button-like');
			el.classList.add('button-like-selected');
		}
	}
	pel(fieldname).value = newval;
}

function changetabview(newview, tabset)
{
	let btnsid = tabset+'_btns';
	let btns = window[btnsid];
	let ctrldown = (window.event.ctrlKey) && newview!='all';
	for(i=0; i<btns.length; i++)
	{
		bn = btns[i];
		let btn = document.getElementById(bn+'btn');
		if (btn)
		{
			if (newview==bn)
			{
				btn.classList.remove('button-like');
				btn.classList.add('button-like-selected');
			}
			else if (!ctrldown)
			{
				btn.classList.remove('button-like-selected');
				btn.classList.add('button-like');
			}
		}
		let div = document.getElementById(bn);
		if (div)
		{
			if (!ctrldown || newview==bn || newview=='all')
				div.style.display = (newview == bn || newview=='all' ? 'block' : 'none');
			if (newview=='all')
			{
				div.classList.remove('pagetab');
				div.classList.add('pagetaball');
			}
			else
			{
				div.classList.remove('pagetaball');
				div.classList.add('pagetab');
			}
		}
	}
	let alldivs = document.getElementsByClassName(tabset+'_showall');
	for(i=0; i<alldivs.length; i++)
	{
		alldivs[i].style.display = (newview=='all' ? 'block' : 'none');
	}
	alldivs = document.getElementsByClassName(tabset+'_hideall');
	for(i=0; i<alldivs.length; i++)
	{
		alldivs[i].style.display = (newview=='all' ? 'none' : 'block');
	}
	let urlparam = window[tabset+'_urlparam'];
	if (urlparam)
	{
		let url = new URL(document.location.href);
		url.searchParams.set(urlparam, newview);
		history.replaceState(null, null, url);
	}
	let onchange = window[tabset+'_onchange'];
	if (onchange)
	{
		window[onchange](newview);
	}
}
