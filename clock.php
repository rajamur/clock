<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Real-Time Clock by DJP</title>
	<!-- 

		Real-time, high accuracy clock
		  by Doug Johnson

		Input parameters:

			tz = Time Zone (Linux-style, e.g. America/Denver)
			sz = Font size, defaults to 12
			fmt = 12 or 24
			offset = time offset in seconds; positive number to advance (60, -30)
			lbl = Label text
			clr = Real-time Clock Text Color (#ff0000)
			cdclr = Countdown Text Color (#cfcfcf)
			labelcolor = Label color (#777777)
			cd60 = Countdown color for 60 seconds (#ffff00)
			cd30 = Countdown color for 30 seconds (#ffa500)
			cd10 = Countdown color for 10 seconds (#ff0000)
			cdover = Countdown color for 10 seconds past expired (#afafaf)
			overbg = Background color when countdown expires (#606060ff)
			font = font family name
			fonturl = external font to load
			expire = Text to display when countdown reaches zero, '+' (&43) for time over, or '0' for 00:00:00
			tenths = Show tenths of a second (0/1)
			countdown = number of seconds to count down from 
			mini = turn mini-clock during countdown off/on (0/[1])
			lz = show leading zeros (00:--:--) for hour for countdown (0/[1])

		Keyboard shortcuts:

			1-9, 0 = Set countdown time in minutes
			Shift + 1-9, 0 = Set countdown time in 5-minute increments
			Ctrl + 1-9, 0 = Set countdown time in 30-minute increments
			Shift + Ctrl + 0-9, 0 = Set countdown time in hour increments
			p/space = pause/unpause countdown
			r = reset countdown to last start time
			c = return to real-time clock
			d = enter countdown time
			h = toggle 12/24 hour
			up/down = change clock font size
			s = start count-up timer
			t = toggle tenths of a second on/off
			q = toggle mini clock on/off

	-->
	<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
	<style>
		@font-face {
			font-family: 'SevenSegment';
			/*src: url(fonts/DSEG7Classic-Bold.woff); */
			src: url(fonts/digital-7mono.ttf);
		}
		@font-face {
			font-family: 'Repetition';
			src: url(fonts/repet___.ttf);
		}
		@font-face {
			font-family: 'PennStation';
			src: url(fonts/PennStation.ttf);
		}
		@keyframes flash {
			0%, 49% { opacity: 1; }
			50%, 100% { opacity: 0.5; }
		}
		body { 
			padding: 0; 
			background-color: black;
			color: silver;
			color: #777777;
			font-size: 0.9vw;
			font-family: "Roboto", Helvetica, sans-serif;
			font-weight: 400;
			margin: 0;
		}
		input, select, button {
			font-size: 0.9vw;
			font-family: "Roboto", Helvetica, sans-serif;
			background-color: #222;
			color: silver;
			border: 1px solid gray;
		}
		#clockdiv {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
			margin: 0;
			padding: 6px;
			box-sizing: border-box;
		}
		#clocklabel { 
			text-align: center;
			height: 1em;
			font-size: 6.3vw; 
			display: block;
			color: #777777;;
			font-family: "Roboto", Helvetica, sans-serif;
			margin: 0.5em 0;
			width: 100%;
			padding: 0;
		}
		#clocktext { 
			text-align: center;
			height: 1em;
			font-size: 18vw; 
			width: 8em;
			display: block;
			color: #ff0000;
			font-family: 'SevenSegment', monospace, monospace;
			font-feature-settings: "tnum";
			font-variant-numeric: tabular-nums lining-nums;
			font-weight: 400;
			width: 100%;
			margin: 0;
			padding: 0;
		}
		#clockdiv.countdown #clocktext {
			color: #cfcfcf;
		}
		#clocktext.paused {
			/* color: #777777 !important; */
			opacity: 40%;
		}
/*		#clockdiv.oneminute {
			background-color: black;
		}
		#clockdiv.thirtyseconds {
			background-color: black;
		} */
		#clockdiv.tenseconds {
			/* background-color: black; */
			animation: flash 0.5s infinite;
		}
		body.over,body.over10 {
			background-color: #600000ff;
		}
		#clockdiv.oneminute #clocktext {
			color: #ffff00;
		}
		#clockdiv.thirtyseconds #clocktext {
			color: #ffa500;
		}
		#clockdiv.tenseconds #clocktext {
			color: #ff0000;
		}
		#clockdiv.over, #clockdiv.over10 #clocktext {
			color: #afafaf;
		}
		#clockdiv.over10 {
			animation: flash 0.5s infinite;
		}
		#smallclock {
			position: absolute;
			right: 3vw;
			bottom: 3vw;
			font-size: 6vw;
			display: block;
			color: #ff0000;
			font-family: 'SevenSegment', monospace, monospace;
			font-feature-settings: "tnum";
			font-variant-numeric: tabular-nums lining-nums;
			font-weight: 400;
			display: none;
		}
		.seloption {
			white-space: nowrap;
			margin: 0.25em 1em 0.25em 0; 
			display: inline-block;
		}
		#info-popup
		{
			display: none; 
			position: absolute;
			background-color: #222; 
			color: silver;
			border: 1px solid gray; 
			z-index: 1000;
			padding: 1em;
		}
		.key {
			display: inline-block;
			border: 1px solid gray;
			padding: 2px 6px;
			font-family: monospace;
			background-color: #333;
			border-radius: 3px;
			font-weight: 500;
		}
	</style>
</head>
<body>
	<div id="clockdiv" onClick="ClockClick();">
		<div id="clocktextdiv">
			<div id="clocktext"></div>
			<div id="clocklabel">the program is on the way please be paitent</div>
		</div>
	</div>
	<div id="headerbar" style="position: fixed; top: 0; left: 0; right: 0; height: 3em; background-color: rgba(0,0,0,0.8); display: none; ">
		<div id="setup" style="padding: 0.5em 1em;">
			<form method="GET">
				<input type="hidden" name="localtimezone" id="localtimezone" value="">
				<input type="hidden" name="font" id="font" value="'SevenSegment', monospace">
				<span class="seloption">Time Zone: <select  name="tz" id="tz" size="1" style="width: 10em;" title="Time Zone used for clock">
	<option value="" selected="selected">Local Time Zone</option>
	<option value="Africa/Abidjan">Africa/Abidjan</option>
	<option value="Africa/Accra">Africa/Accra</option>
	<option value="Africa/Addis_Ababa">Africa/Addis_Ababa</option>
	<option value="Africa/Algiers">Africa/Algiers</option>
	<option value="Africa/Asmara">Africa/Asmara</option>
	<option value="Africa/Bamako">Africa/Bamako</option>
	<option value="Africa/Bangui">Africa/Bangui</option>
	<option value="Africa/Banjul">Africa/Banjul</option>
	<option value="Africa/Bissau">Africa/Bissau</option>
	<option value="Africa/Blantyre">Africa/Blantyre</option>
	<option value="Africa/Brazzaville">Africa/Brazzaville</option>
	<option value="Africa/Bujumbura">Africa/Bujumbura</option>
	<option value="Africa/Cairo">Africa/Cairo</option>
	<option value="Africa/Casablanca">Africa/Casablanca</option>
	<option value="Africa/Ceuta">Africa/Ceuta</option>
	<option value="Africa/Conakry">Africa/Conakry</option>
	<option value="Africa/Dakar">Africa/Dakar</option>
	<option value="Africa/Dar_es_Salaam">Africa/Dar_es_Salaam</option>
	<option value="Africa/Djibouti">Africa/Djibouti</option>
	<option value="Africa/Douala">Africa/Douala</option>
	<option value="Africa/El_Aaiun">Africa/El_Aaiun</option>
	<option value="Africa/Freetown">Africa/Freetown</option>
	<option value="Africa/Gaborone">Africa/Gaborone</option>
	<option value="Africa/Harare">Africa/Harare</option>
	<option value="Africa/Johannesburg">Africa/Johannesburg</option>
	<option value="Africa/Juba">Africa/Juba</option>
	<option value="Africa/Kampala">Africa/Kampala</option>
	<option value="Africa/Khartoum">Africa/Khartoum</option>
	<option value="Africa/Kigali">Africa/Kigali</option>
	<option value="Africa/Kinshasa">Africa/Kinshasa</option>
	<option value="Africa/Lagos">Africa/Lagos</option>
	<option value="Africa/Libreville">Africa/Libreville</option>
	<option value="Africa/Lome">Africa/Lome</option>
	<option value="Africa/Luanda">Africa/Luanda</option>
	<option value="Africa/Lubumbashi">Africa/Lubumbashi</option>
	<option value="Africa/Lusaka">Africa/Lusaka</option>
	<option value="Africa/Malabo">Africa/Malabo</option>
	<option value="Africa/Maputo">Africa/Maputo</option>
	<option value="Africa/Maseru">Africa/Maseru</option>
	<option value="Africa/Mbabane">Africa/Mbabane</option>
	<option value="Africa/Mogadishu">Africa/Mogadishu</option>
	<option value="Africa/Monrovia">Africa/Monrovia</option>
	<option value="Africa/Nairobi">Africa/Nairobi</option>
	<option value="Africa/Ndjamena">Africa/Ndjamena</option>
	<option value="Africa/Niamey">Africa/Niamey</option>
	<option value="Africa/Nouakchott">Africa/Nouakchott</option>
	<option value="Africa/Ouagadougou">Africa/Ouagadougou</option>
	<option value="Africa/Porto-Novo">Africa/Porto-Novo</option>
	<option value="Africa/Sao_Tome">Africa/Sao_Tome</option>
	<option value="Africa/Tripoli">Africa/Tripoli</option>
	<option value="Africa/Tunis">Africa/Tunis</option>
	<option value="Africa/Windhoek">Africa/Windhoek</option>
	<option value="America/Adak">America/Adak</option>
	<option value="America/Anchorage">America/Anchorage</option>
	<option value="America/Anguilla">America/Anguilla</option>
	<option value="America/Antigua">America/Antigua</option>
	<option value="America/Araguaina">America/Araguaina</option>
	<option value="America/Argentina/Buenos_Aires">America/Argentina/Buenos_Aires</option>
	<option value="America/Argentina/Catamarca">America/Argentina/Catamarca</option>
	<option value="America/Argentina/Cordoba">America/Argentina/Cordoba</option>
	<option value="America/Argentina/Jujuy">America/Argentina/Jujuy</option>
	<option value="America/Argentina/La_Rioja">America/Argentina/La_Rioja</option>
	<option value="America/Argentina/Mendoza">America/Argentina/Mendoza</option>
	<option value="America/Argentina/Rio_Gallegos">America/Argentina/Rio_Gallegos</option>
	<option value="America/Argentina/Salta">America/Argentina/Salta</option>
	<option value="America/Argentina/San_Juan">America/Argentina/San_Juan</option>
	<option value="America/Argentina/San_Luis">America/Argentina/San_Luis</option>
	<option value="America/Argentina/Tucuman">America/Argentina/Tucuman</option>
	<option value="America/Argentina/Ushuaia">America/Argentina/Ushuaia</option>
	<option value="America/Aruba">America/Aruba</option>
	<option value="America/Asuncion">America/Asuncion</option>
	<option value="America/Atikokan">America/Atikokan</option>
	<option value="America/Bahia">America/Bahia</option>
	<option value="America/Bahia_Banderas">America/Bahia_Banderas</option>
	<option value="America/Barbados">America/Barbados</option>
	<option value="America/Belem">America/Belem</option>
	<option value="America/Belize">America/Belize</option>
	<option value="America/Blanc-Sablon">America/Blanc-Sablon</option>
	<option value="America/Boa_Vista">America/Boa_Vista</option>
	<option value="America/Bogota">America/Bogota</option>
	<option value="America/Boise">America/Boise</option>
	<option value="America/Cambridge_Bay">America/Cambridge_Bay</option>
	<option value="America/Campo_Grande">America/Campo_Grande</option>
	<option value="America/Cancun">America/Cancun</option>
	<option value="America/Caracas">America/Caracas</option>
	<option value="America/Cayenne">America/Cayenne</option>
	<option value="America/Cayman">America/Cayman</option>
	<option value="America/Chicago">America/Chicago</option>
	<option value="America/Chihuahua">America/Chihuahua</option>
	<option value="America/Ciudad_Juarez">America/Ciudad_Juarez</option>
	<option value="America/Costa_Rica">America/Costa_Rica</option>
	<option value="America/Creston">America/Creston</option>
	<option value="America/Cuiaba">America/Cuiaba</option>
	<option value="America/Curacao">America/Curacao</option>
	<option value="America/Danmarkshavn">America/Danmarkshavn</option>
	<option value="America/Dawson">America/Dawson</option>
	<option value="America/Dawson_Creek">America/Dawson_Creek</option>
	<option value="America/Denver">America/Denver</option>
	<option value="America/Detroit">America/Detroit</option>
	<option value="America/Dominica">America/Dominica</option>
	<option value="America/Edmonton">America/Edmonton</option>
	<option value="America/Eirunepe">America/Eirunepe</option>
	<option value="America/El_Salvador">America/El_Salvador</option>
	<option value="America/Fort_Nelson">America/Fort_Nelson</option>
	<option value="America/Fortaleza">America/Fortaleza</option>
	<option value="America/Glace_Bay">America/Glace_Bay</option>
	<option value="America/Goose_Bay">America/Goose_Bay</option>
	<option value="America/Grand_Turk">America/Grand_Turk</option>
	<option value="America/Grenada">America/Grenada</option>
	<option value="America/Guadeloupe">America/Guadeloupe</option>
	<option value="America/Guatemala">America/Guatemala</option>
	<option value="America/Guayaquil">America/Guayaquil</option>
	<option value="America/Guyana">America/Guyana</option>
	<option value="America/Halifax">America/Halifax</option>
	<option value="America/Havana">America/Havana</option>
	<option value="America/Hermosillo">America/Hermosillo</option>
	<option value="America/Indiana/Indianapolis">America/Indiana/Indianapolis</option>
	<option value="America/Indiana/Knox">America/Indiana/Knox</option>
	<option value="America/Indiana/Marengo">America/Indiana/Marengo</option>
	<option value="America/Indiana/Petersburg">America/Indiana/Petersburg</option>
	<option value="America/Indiana/Tell_City">America/Indiana/Tell_City</option>
	<option value="America/Indiana/Vevay">America/Indiana/Vevay</option>
	<option value="America/Indiana/Vincennes">America/Indiana/Vincennes</option>
	<option value="America/Indiana/Winamac">America/Indiana/Winamac</option>
	<option value="America/Inuvik">America/Inuvik</option>
	<option value="America/Iqaluit">America/Iqaluit</option>
	<option value="America/Jamaica">America/Jamaica</option>
	<option value="America/Juneau">America/Juneau</option>
	<option value="America/Kentucky/Louisville">America/Kentucky/Louisville</option>
	<option value="America/Kentucky/Monticello">America/Kentucky/Monticello</option>
	<option value="America/Kralendijk">America/Kralendijk</option>
	<option value="America/La_Paz">America/La_Paz</option>
	<option value="America/Lima">America/Lima</option>
	<option value="America/Los_Angeles">America/Los_Angeles</option>
	<option value="America/Lower_Princes">America/Lower_Princes</option>
	<option value="America/Maceio">America/Maceio</option>
	<option value="America/Managua">America/Managua</option>
	<option value="America/Manaus">America/Manaus</option>
	<option value="America/Marigot">America/Marigot</option>
	<option value="America/Martinique">America/Martinique</option>
	<option value="America/Matamoros">America/Matamoros</option>
	<option value="America/Mazatlan">America/Mazatlan</option>
	<option value="America/Menominee">America/Menominee</option>
	<option value="America/Merida">America/Merida</option>
	<option value="America/Metlakatla">America/Metlakatla</option>
	<option value="America/Mexico_City">America/Mexico_City</option>
	<option value="America/Miquelon">America/Miquelon</option>
	<option value="America/Moncton">America/Moncton</option>
	<option value="America/Monterrey">America/Monterrey</option>
	<option value="America/Montevideo">America/Montevideo</option>
	<option value="America/Montserrat">America/Montserrat</option>
	<option value="America/Nassau">America/Nassau</option>
	<option value="America/New_York">America/New_York</option>
	<option value="America/Nome">America/Nome</option>
	<option value="America/Noronha">America/Noronha</option>
	<option value="America/North_Dakota/Beulah">America/North_Dakota/Beulah</option>
	<option value="America/North_Dakota/Center">America/North_Dakota/Center</option>
	<option value="America/North_Dakota/New_Salem">America/North_Dakota/New_Salem</option>
	<option value="America/Nuuk">America/Nuuk</option>
	<option value="America/Ojinaga">America/Ojinaga</option>
	<option value="America/Panama">America/Panama</option>
	<option value="America/Paramaribo">America/Paramaribo</option>
	<option value="America/Phoenix">America/Phoenix</option>
	<option value="America/Port-au-Prince">America/Port-au-Prince</option>
	<option value="America/Port_of_Spain">America/Port_of_Spain</option>
	<option value="America/Porto_Velho">America/Porto_Velho</option>
	<option value="America/Puerto_Rico">America/Puerto_Rico</option>
	<option value="America/Punta_Arenas">America/Punta_Arenas</option>
	<option value="America/Rankin_Inlet">America/Rankin_Inlet</option>
	<option value="America/Recife">America/Recife</option>
	<option value="America/Regina">America/Regina</option>
	<option value="America/Resolute">America/Resolute</option>
	<option value="America/Rio_Branco">America/Rio_Branco</option>
	<option value="America/Santarem">America/Santarem</option>
	<option value="America/Santiago">America/Santiago</option>
	<option value="America/Santo_Domingo">America/Santo_Domingo</option>
	<option value="America/Sao_Paulo">America/Sao_Paulo</option>
	<option value="America/Scoresbysund">America/Scoresbysund</option>
	<option value="America/Sitka">America/Sitka</option>
	<option value="America/St_Barthelemy">America/St_Barthelemy</option>
	<option value="America/St_Johns">America/St_Johns</option>
	<option value="America/St_Kitts">America/St_Kitts</option>
	<option value="America/St_Lucia">America/St_Lucia</option>
	<option value="America/St_Thomas">America/St_Thomas</option>
	<option value="America/St_Vincent">America/St_Vincent</option>
	<option value="America/Swift_Current">America/Swift_Current</option>
	<option value="America/Tegucigalpa">America/Tegucigalpa</option>
	<option value="America/Thule">America/Thule</option>
	<option value="America/Tijuana">America/Tijuana</option>
	<option value="America/Toronto">America/Toronto</option>
	<option value="America/Tortola">America/Tortola</option>
	<option value="America/Vancouver">America/Vancouver</option>
	<option value="America/Whitehorse">America/Whitehorse</option>
	<option value="America/Winnipeg">America/Winnipeg</option>
	<option value="America/Yakutat">America/Yakutat</option>
	<option value="Antarctica/Casey">Antarctica/Casey</option>
	<option value="Antarctica/Davis">Antarctica/Davis</option>
	<option value="Antarctica/DumontDUrville">Antarctica/DumontDUrville</option>
	<option value="Antarctica/Macquarie">Antarctica/Macquarie</option>
	<option value="Antarctica/Mawson">Antarctica/Mawson</option>
	<option value="Antarctica/McMurdo">Antarctica/McMurdo</option>
	<option value="Antarctica/Palmer">Antarctica/Palmer</option>
	<option value="Antarctica/Rothera">Antarctica/Rothera</option>
	<option value="Antarctica/Syowa">Antarctica/Syowa</option>
	<option value="Antarctica/Troll">Antarctica/Troll</option>
	<option value="Antarctica/Vostok">Antarctica/Vostok</option>
	<option value="Arctic/Longyearbyen">Arctic/Longyearbyen</option>
	<option value="Asia/Aden">Asia/Aden</option>
	<option value="Asia/Almaty">Asia/Almaty</option>
	<option value="Asia/Amman">Asia/Amman</option>
	<option value="Asia/Anadyr">Asia/Anadyr</option>
	<option value="Asia/Aqtau">Asia/Aqtau</option>
	<option value="Asia/Aqtobe">Asia/Aqtobe</option>
	<option value="Asia/Ashgabat">Asia/Ashgabat</option>
	<option value="Asia/Atyrau">Asia/Atyrau</option>
	<option value="Asia/Baghdad">Asia/Baghdad</option>
	<option value="Asia/Bahrain">Asia/Bahrain</option>
	<option value="Asia/Baku">Asia/Baku</option>
	<option value="Asia/Bangkok">Asia/Bangkok</option>
	<option value="Asia/Barnaul">Asia/Barnaul</option>
	<option value="Asia/Beirut">Asia/Beirut</option>
	<option value="Asia/Bishkek">Asia/Bishkek</option>
	<option value="Asia/Brunei">Asia/Brunei</option>
	<option value="Asia/Chita">Asia/Chita</option>
	<option value="Asia/Choibalsan">Asia/Choibalsan</option>
	<option value="Asia/Colombo">Asia/Colombo</option>
	<option value="Asia/Damascus">Asia/Damascus</option>
	<option value="Asia/Dhaka">Asia/Dhaka</option>
	<option value="Asia/Dili">Asia/Dili</option>
	<option value="Asia/Dubai">Asia/Dubai</option>
	<option value="Asia/Dushanbe">Asia/Dushanbe</option>
	<option value="Asia/Famagusta">Asia/Famagusta</option>
	<option value="Asia/Gaza">Asia/Gaza</option>
	<option value="Asia/Hebron">Asia/Hebron</option>
	<option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
	<option value="Asia/Hong_Kong">Asia/Hong_Kong</option>
	<option value="Asia/Hovd">Asia/Hovd</option>
	<option value="Asia/Irkutsk">Asia/Irkutsk</option>
	<option value="Asia/Jakarta">Asia/Jakarta</option>
	<option value="Asia/Jayapura">Asia/Jayapura</option>
	<option value="Asia/Jerusalem">Asia/Jerusalem</option>
	<option value="Asia/Kabul">Asia/Kabul</option>
	<option value="Asia/Kamchatka">Asia/Kamchatka</option>
	<option value="Asia/Karachi">Asia/Karachi</option>
	<option value="Asia/Kathmandu">Asia/Kathmandu</option>
	<option value="Asia/Khandyga">Asia/Khandyga</option>
	<option value="Asia/Kolkata">Asia/Kolkata</option>
	<option value="Asia/Krasnoyarsk">Asia/Krasnoyarsk</option>
	<option value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur</option>
	<option value="Asia/Kuching">Asia/Kuching</option>
	<option value="Asia/Kuwait">Asia/Kuwait</option>
	<option value="Asia/Macau">Asia/Macau</option>
	<option value="Asia/Magadan">Asia/Magadan</option>
	<option value="Asia/Makassar">Asia/Makassar</option>
	<option value="Asia/Manila">Asia/Manila</option>
	<option value="Asia/Muscat">Asia/Muscat</option>
	<option value="Asia/Nicosia">Asia/Nicosia</option>
	<option value="Asia/Novokuznetsk">Asia/Novokuznetsk</option>
	<option value="Asia/Novosibirsk">Asia/Novosibirsk</option>
	<option value="Asia/Omsk">Asia/Omsk</option>
	<option value="Asia/Oral">Asia/Oral</option>
	<option value="Asia/Phnom_Penh">Asia/Phnom_Penh</option>
	<option value="Asia/Pontianak">Asia/Pontianak</option>
	<option value="Asia/Pyongyang">Asia/Pyongyang</option>
	<option value="Asia/Qatar">Asia/Qatar</option>
	<option value="Asia/Qostanay">Asia/Qostanay</option>
	<option value="Asia/Qyzylorda">Asia/Qyzylorda</option>
	<option value="Asia/Riyadh">Asia/Riyadh</option>
	<option value="Asia/Sakhalin">Asia/Sakhalin</option>
	<option value="Asia/Samarkand">Asia/Samarkand</option>
	<option value="Asia/Seoul">Asia/Seoul</option>
	<option value="Asia/Shanghai">Asia/Shanghai</option>
	<option value="Asia/Singapore">Asia/Singapore</option>
	<option value="Asia/Srednekolymsk">Asia/Srednekolymsk</option>
	<option value="Asia/Taipei">Asia/Taipei</option>
	<option value="Asia/Tashkent">Asia/Tashkent</option>
	<option value="Asia/Tbilisi">Asia/Tbilisi</option>
	<option value="Asia/Tehran">Asia/Tehran</option>
	<option value="Asia/Thimphu">Asia/Thimphu</option>
	<option value="Asia/Tokyo">Asia/Tokyo</option>
	<option value="Asia/Tomsk">Asia/Tomsk</option>
	<option value="Asia/Ulaanbaatar">Asia/Ulaanbaatar</option>
	<option value="Asia/Urumqi">Asia/Urumqi</option>
	<option value="Asia/Ust-Nera">Asia/Ust-Nera</option>
	<option value="Asia/Vientiane">Asia/Vientiane</option>
	<option value="Asia/Vladivostok">Asia/Vladivostok</option>
	<option value="Asia/Yakutsk">Asia/Yakutsk</option>
	<option value="Asia/Yangon">Asia/Yangon</option>
	<option value="Asia/Yekaterinburg">Asia/Yekaterinburg</option>
	<option value="Asia/Yerevan">Asia/Yerevan</option>
	<option value="Atlantic/Azores">Atlantic/Azores</option>
	<option value="Atlantic/Bermuda">Atlantic/Bermuda</option>
	<option value="Atlantic/Canary">Atlantic/Canary</option>
	<option value="Atlantic/Cape_Verde">Atlantic/Cape_Verde</option>
	<option value="Atlantic/Faroe">Atlantic/Faroe</option>
	<option value="Atlantic/Madeira">Atlantic/Madeira</option>
	<option value="Atlantic/Reykjavik">Atlantic/Reykjavik</option>
	<option value="Atlantic/South_Georgia">Atlantic/South_Georgia</option>
	<option value="Atlantic/St_Helena">Atlantic/St_Helena</option>
	<option value="Atlantic/Stanley">Atlantic/Stanley</option>
	<option value="Australia/Adelaide">Australia/Adelaide</option>
	<option value="Australia/Brisbane">Australia/Brisbane</option>
	<option value="Australia/Broken_Hill">Australia/Broken_Hill</option>
	<option value="Australia/Darwin">Australia/Darwin</option>
	<option value="Australia/Eucla">Australia/Eucla</option>
	<option value="Australia/Hobart">Australia/Hobart</option>
	<option value="Australia/Lindeman">Australia/Lindeman</option>
	<option value="Australia/Lord_Howe">Australia/Lord_Howe</option>
	<option value="Australia/Melbourne">Australia/Melbourne</option>
	<option value="Australia/Perth">Australia/Perth</option>
	<option value="Australia/Sydney">Australia/Sydney</option>
	<option value="Europe/Amsterdam">Europe/Amsterdam</option>
	<option value="Europe/Andorra">Europe/Andorra</option>
	<option value="Europe/Astrakhan">Europe/Astrakhan</option>
	<option value="Europe/Athens">Europe/Athens</option>
	<option value="Europe/Belgrade">Europe/Belgrade</option>
	<option value="Europe/Berlin">Europe/Berlin</option>
	<option value="Europe/Bratislava">Europe/Bratislava</option>
	<option value="Europe/Brussels">Europe/Brussels</option>
	<option value="Europe/Bucharest">Europe/Bucharest</option>
	<option value="Europe/Budapest">Europe/Budapest</option>
	<option value="Europe/Busingen">Europe/Busingen</option>
	<option value="Europe/Chisinau">Europe/Chisinau</option>
	<option value="Europe/Copenhagen">Europe/Copenhagen</option>
	<option value="Europe/Dublin">Europe/Dublin</option>
	<option value="Europe/Gibraltar">Europe/Gibraltar</option>
	<option value="Europe/Guernsey">Europe/Guernsey</option>
	<option value="Europe/Helsinki">Europe/Helsinki</option>
	<option value="Europe/Isle_of_Man">Europe/Isle_of_Man</option>
	<option value="Europe/Istanbul">Europe/Istanbul</option>
	<option value="Europe/Jersey">Europe/Jersey</option>
	<option value="Europe/Kaliningrad">Europe/Kaliningrad</option>
	<option value="Europe/Kirov">Europe/Kirov</option>
	<option value="Europe/Kyiv">Europe/Kyiv</option>
	<option value="Europe/Lisbon">Europe/Lisbon</option>
	<option value="Europe/Ljubljana">Europe/Ljubljana</option>
	<option value="Europe/London">Europe/London</option>
	<option value="Europe/Luxembourg">Europe/Luxembourg</option>
	<option value="Europe/Madrid">Europe/Madrid</option>
	<option value="Europe/Malta">Europe/Malta</option>
	<option value="Europe/Mariehamn">Europe/Mariehamn</option>
	<option value="Europe/Minsk">Europe/Minsk</option>
	<option value="Europe/Monaco">Europe/Monaco</option>
	<option value="Europe/Moscow">Europe/Moscow</option>
	<option value="Europe/Oslo">Europe/Oslo</option>
	<option value="Europe/Paris">Europe/Paris</option>
	<option value="Europe/Podgorica">Europe/Podgorica</option>
	<option value="Europe/Prague">Europe/Prague</option>
	<option value="Europe/Riga">Europe/Riga</option>
	<option value="Europe/Rome">Europe/Rome</option>
	<option value="Europe/Samara">Europe/Samara</option>
	<option value="Europe/San_Marino">Europe/San_Marino</option>
	<option value="Europe/Sarajevo">Europe/Sarajevo</option>
	<option value="Europe/Saratov">Europe/Saratov</option>
	<option value="Europe/Simferopol">Europe/Simferopol</option>
	<option value="Europe/Skopje">Europe/Skopje</option>
	<option value="Europe/Sofia">Europe/Sofia</option>
	<option value="Europe/Stockholm">Europe/Stockholm</option>
	<option value="Europe/Tallinn">Europe/Tallinn</option>
	<option value="Europe/Tirane">Europe/Tirane</option>
	<option value="Europe/Ulyanovsk">Europe/Ulyanovsk</option>
	<option value="Europe/Vaduz">Europe/Vaduz</option>
	<option value="Europe/Vatican">Europe/Vatican</option>
	<option value="Europe/Vienna">Europe/Vienna</option>
	<option value="Europe/Vilnius">Europe/Vilnius</option>
	<option value="Europe/Volgograd">Europe/Volgograd</option>
	<option value="Europe/Warsaw">Europe/Warsaw</option>
	<option value="Europe/Zagreb">Europe/Zagreb</option>
	<option value="Europe/Zurich">Europe/Zurich</option>
	<option value="Indian/Antananarivo">Indian/Antananarivo</option>
	<option value="Indian/Chagos">Indian/Chagos</option>
	<option value="Indian/Christmas">Indian/Christmas</option>
	<option value="Indian/Cocos">Indian/Cocos</option>
	<option value="Indian/Comoro">Indian/Comoro</option>
	<option value="Indian/Kerguelen">Indian/Kerguelen</option>
	<option value="Indian/Mahe">Indian/Mahe</option>
	<option value="Indian/Maldives">Indian/Maldives</option>
	<option value="Indian/Mauritius">Indian/Mauritius</option>
	<option value="Indian/Mayotte">Indian/Mayotte</option>
	<option value="Indian/Reunion">Indian/Reunion</option>
	<option value="Pacific/Apia">Pacific/Apia</option>
	<option value="Pacific/Auckland">Pacific/Auckland</option>
	<option value="Pacific/Bougainville">Pacific/Bougainville</option>
	<option value="Pacific/Chatham">Pacific/Chatham</option>
	<option value="Pacific/Chuuk">Pacific/Chuuk</option>
	<option value="Pacific/Easter">Pacific/Easter</option>
	<option value="Pacific/Efate">Pacific/Efate</option>
	<option value="Pacific/Fakaofo">Pacific/Fakaofo</option>
	<option value="Pacific/Fiji">Pacific/Fiji</option>
	<option value="Pacific/Funafuti">Pacific/Funafuti</option>
	<option value="Pacific/Galapagos">Pacific/Galapagos</option>
	<option value="Pacific/Gambier">Pacific/Gambier</option>
	<option value="Pacific/Guadalcanal">Pacific/Guadalcanal</option>
	<option value="Pacific/Guam">Pacific/Guam</option>
	<option value="Pacific/Honolulu">Pacific/Honolulu</option>
	<option value="Pacific/Kanton">Pacific/Kanton</option>
	<option value="Pacific/Kiritimati">Pacific/Kiritimati</option>
	<option value="Pacific/Kosrae">Pacific/Kosrae</option>
	<option value="Pacific/Kwajalein">Pacific/Kwajalein</option>
	<option value="Pacific/Majuro">Pacific/Majuro</option>
	<option value="Pacific/Marquesas">Pacific/Marquesas</option>
	<option value="Pacific/Midway">Pacific/Midway</option>
	<option value="Pacific/Nauru">Pacific/Nauru</option>
	<option value="Pacific/Niue">Pacific/Niue</option>
	<option value="Pacific/Norfolk">Pacific/Norfolk</option>
	<option value="Pacific/Noumea">Pacific/Noumea</option>
	<option value="Pacific/Pago_Pago">Pacific/Pago_Pago</option>
	<option value="Pacific/Palau">Pacific/Palau</option>
	<option value="Pacific/Pitcairn">Pacific/Pitcairn</option>
	<option value="Pacific/Pohnpei">Pacific/Pohnpei</option>
	<option value="Pacific/Port_Moresby">Pacific/Port_Moresby</option>
	<option value="Pacific/Rarotonga">Pacific/Rarotonga</option>
	<option value="Pacific/Saipan">Pacific/Saipan</option>
	<option value="Pacific/Tahiti">Pacific/Tahiti</option>
	<option value="Pacific/Tarawa">Pacific/Tarawa</option>
	<option value="Pacific/Tongatapu">Pacific/Tongatapu</option>
	<option value="Pacific/Wake">Pacific/Wake</option>
	<option value="Pacific/Wallis">Pacific/Wallis</option>
	<option value="UTC">UTC</option>
</select>
</span>
				<span class="seloption">Fmt: <select  name="fmt" id="fmt" size="1" title="Select 12 or 24-hour format">
	<option value="12" selected="selected">12h</option>
	<option value="24">24h</option>
</select>
</span>
				<span class="seloption">Sz: <input type="number" name="sz" id="sz" value="18" step="any" style="width: 3em; text-align: right;" title="Font size, default is 12">
</span>
				<span class="seloption">+/-: <input type="number" name="offset" id="offset" value="0" step="1" style="width: 4em; text-align: right;" title="Time offset in seconds; + to advance, - to roll back">
 sec</span>
				<span class="seloption"><input type="color" name="clr" id="clr" size="6" value="#ff0000" title="Clock text color">
</span>
				<span class="seloption">Label: <input type="text" name="label" id="label" size="12" value="the program is on the way please be paitent" title="Clock label, or 'TZ' for time zone name">
</span>
				<span class="seloption">Count To: <input type="datetime-local" name="reftime" id="reftime" data-datetype="datetime" value="" title="Reference Date/Time for Count Up/Down (Optional)" size="20" pattern="[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])T[0-2][0-9]:[0-5][0-9]:[0-5][0-9]" placeholder="YYYY-MM-DDTHH:MM:SS">
</span>
				<span class="seloption">
					Mins: <select  name="countdowntime" id="countdowntime" size="1" title="Quick Count-Down Times">
	<option value="" selected="selected"></option>
	<option value="0.5">0:30</option>
	<option value="1">1:00</option>
	<option value="2">2:00</option>
	<option value="3">3:00</option>
	<option value="4">4:00</option>
	<option value="5">5:00</option>
	<option value="6">6:00</option>
	<option value="7">7:00</option>
	<option value="8">8:00</option>
	<option value="9">9:00</option>
	<option value="10">10:00</option>
	<option value="15">15:00</option>
	<option value="20">20:00</option>
	<option value="25">25:00</option>
	<option value="30">30:00</option>
	<option value="45">45:00</option>
	<option value="60">60:00</option>
	<option value="90">90:00</option>
	<option value="120">2 hr</option>
	<option value="180">3 hr</option>
	<option value="240">4 hr</option>
	<option value="300">5 hr</option>
	<option value="360">6 hr</option>
	<option value="420">7 hr</option>
	<option value="480">8 hr</option>
	<option value="540">9 hr</option>
	<option value="600">10 hr</option>
	<option value="720">12 hr</option>
	<option value="900">15 hr</option>
	<option value="1080">18 hr</option>
	<option value="1440">24 hr</option>
</select>
					<button type="button" onClick="SelectCountDownTime(this);">Go</button>
				</span>
				<input type="submit" name="" id="" value="View">
				<span class="seloption"><button type="button" onClick="ResetClock();" title="Return to Real-Time Clock">Reset</button></span>
				<div id="info-icon" style="display: inline-block; border: 1px solid gray; border-radius: 1em; text-align: center; width: 1.2em; background-color: #222; color: silver;" title="Tips">i</div>
			</form>
		</div>
	</div>
	<div id="info-popup">
		<h4 style="margin-top: 0;">Keyboard Shortcuts</h4>
		<ul>
			<li><span class="key">c</span> - Show real-time clock</li>
			<li><span class="key">s</span> - Start count-up timer</li>
			<li><span class="key">d</span> - Enter countdown time (hh:mm:ss)</li>
			<li><span class="key">r</span> - Restart countdown</li>
			<li><span class="key">p</span>/<span class="key">SPACE</span> - Pause countdown</li>
			<li><span class="key">t</span> - Toggle tenths on/off</li>
			<li><span class="key">h</span> - Toggle 12/24 hour format</li>
			<li><span class="key">q</span> - Toggle mini-clock during countdown</li>
			<li><span class="key">z</span> - Toggle leading hour zeroes on countdown</li>
			<li><span class="key">Digit</span> - Set countdown time (minutes)</li>
			<li><span class="key">&#x21E7; Digit</span> - Set countdown time (&times;5 min)</li>
			<li><span class="key">&#x2303; Digit</span> - Set countdown time (&times; 30 min)</li>
			<li><span class="key">&#x21E7;&#x2303; Digit</span> - Set countdown time (hours)</li>
			<li><span class="key">-/=</span> - Adjust countdown by 5 seconds (+/-)</li>
			<li><span class="key">&#x21E7; -/=</span> - Adjust countdown by 30 seconds</li>
			<li><span class="key">&#x2303; -/=</span> - Adjust countdown by 60 seconds</li>
			<li><span class="key">Arrow Up/Down</span> - Adjust font size</li>
		</ul>
		<p style="margin-bottom: 0; opacity: 0.6;">
			<i>Digit 0</i> key is treated as ten rather than zero.
			<br>&#x21E7; = Shift Key, &#x2303; = Ctrl Key
		</p>
	</div>
	<div id="smallclock">SmallClock</div>
	<script src="djpjs.js"></script>
	<script src="djax190217.js"></script>
	<script>

	let reftime = 1739595684.8928;
	let baseref = reftime;
	let timeoffset = performance.now();
	let timesetat = new Date().getTime();
	let driftfactor = 1.0;
	let baseoffset = timeoffset;
	var hrfmt = 12;
	var formatter = null;
	var timezone = '';
	var timeformat = 'h:i:s';
	SetFormatter();
	let offset = 0;
	let requestoffset = 0;
	let timevalid = true;
	let firstsync = true;
	let lastresync = null;
	let countup = false;
	let miniclock = 1;
	let fontsize = 18;
	var leadingzero = true;
	var tenths = false;
	let updowntime = null;
	var postmessageurl = null;
	let expireoption = "+";

	let pausestart = null;
	let pauseoffset = 0;
	
	if (pel('clocklabel').textContent.toLowerCase()=='tz')
	{
		pel('clocklabel').textContent = djGetTimeZoneName(timezone);
	}

	
	lastclassname = null;
	lastdisplayedtime = null;

	let lastdisplayupdate = null;

	const infoIcon = document.getElementById('info-icon');
	const infoPopup = document.getElementById('info-popup');

	infoIcon.addEventListener('mouseenter', () => {
		const iconRect = infoIcon.getBoundingClientRect();
		infoPopup.style.top = `${iconRect.bottom}px`;
		infoPopup.style.right = `${window.innerWidth - iconRect.right}px`;
		infoPopup.style.display = 'block';
	});

	infoIcon.addEventListener('mouseleave', () => {
		infoPopup.style.display = 'none';
	});



	function GetCurrentTime()
	{
		let now = performance.now();
		return reftime*1000.0 + (now-timeoffset)*driftfactor + offset*1000.0;		
	}

	function GetCurrentSecondsRemaining()
	{
		if (!updowntime)
		{
			return null;
		}

		let ctime = new Date().getTime();
		let currenttime = GetCurrentTime();

		let currentpause = (pausestart ? (ctime-pausestart) : 0) + pauseoffset;
		let secoffset = Math.floor(currenttime/1000.0 - updowntime - currentpause / 1000.0);		
		return secoffset;
	}

	function UpdateTime()
	{
		let now = performance.now();
		let currenttime = GetCurrentTime();

		let ctime = new Date().getTime();
		let tdiff = ((ctime-now)-(timesetat-timeoffset));
		if (Math.abs(tdiff)>250000 && timevalid)
		{
			console.log("Time drift -- resetting! ", ctime, now, timesetat, timeoffset, tdiff);
			timevalid = false;
			StartResync();
		}
		
		if (timevalid && now - lastdisplayupdate > 10000 && lastresync - now > 60000) // more than 10 seconds since last update
		{
			console.log("Time not updated in 10 seconds -- resetting!", ctime, now, lastdisplayedtime);
			//timevalid = false;
			StartResync();
		}
		lastdisplayupdate = now;

		let classname = null;
		let newtime;

		let dobj = new Date(currenttime);
		//pel('clocktext').textContent = formatter.format(dobj);
		let timestr = '--:--:--';
		if (timevalid)
		{
			try
			{
				timestr =timezone ? djpFormatDate(dobj, timezone, timeformat) : dobj.format(timeformat);
				if (tenths)
				{
					let tv = Math.floor((currenttime/1000.0 - Math.floor(currenttime/1000.0)) * 10);
					timestr += '.' + tv;
				}
			}
			catch (ex)
			{
				timestr = formatter.format(dobj).substr(0,8);
			}
		}
		if (miniclock && updowntime)
		{
			pel('smallclock').textContent = timestr;
			pel('smallclock').style.display = 'block';
		}
		else
		{
			pel('smallclock').style.display = 'none';
		}

		if (updowntime)
		{
			let currentpause = (pausestart ? (ctime-pausestart) : 0) + pauseoffset;
			let secoffset = currenttime/1000.0 - updowntime - currentpause / 1000.0 -0.05;
			let s2t = SecsToTime(Math.abs(secoffset));
			if (!leadingzero && s2t.substr(0,3)=='00:')
			{
				s2t = s2t.substr(3);
			}
			newtime = (secoffset > 0 ? '+' : '-') + s2t;
			if (!countup)
			{
				if (secoffset > 0)
				{
					if (expireoption == '0')
					{
						newtime = '00:00:00';
						secoffset = 0;
					}
					else if (expireoption && expireoption != '+' && expireoption !='up')
					{
						newtime = expireoption;
					}
				}
				if (secoffset>=-10 && secoffset<0)
				{
					classname = 'tenseconds';
				}
				else if (secoffset>=-30 && secoffset<0)
				{
					classname = 'thirtyseconds';
				}
				else if (secoffset>=-60 && secoffset<0)
				{
					classname = 'oneminute';
				}
				else if (secoffset>0 && secoffset<10)
				{
					classname = 'over10';
					document.body.classList.add("over10");
				}
				else if (secoffset>0)
				{
					classname = 'over';
					document.body.classList.add("over");
				}
			}
			pel('clockdiv').classList.add('countdown');
		}
		else
		{
			let dobj = new Date(currenttime);
			//pel('clocktext').textContent = formatter.format(dobj);
			if (timevalid)
			{
				newtime = timestr;
			}
			else
			{
				newtime = '--:--:--';
			}
			pel('clockdiv').classList.remove('countdown');
		}
		pel('clocktext').textContent = newtime;
		if (newtime != lastdisplayedtime)
		{
			lastdisplayedtime = newtime;
			if (postmessageurl && window.parent)
			{
				try
				{
					window.parent.postMessage({ type: 'clocktime', time: newtime, currenttime: currenttime }, postmessageurl);
				}
				catch 
				{
				}
			}
		}
		if (classname!=lastclassname)
		{
			pel('clockdiv').classList.remove("oneminute");
			pel('clockdiv').classList.remove("thirtyseconds");
			pel('clockdiv').classList.remove("tenseconds");
			pel('clockdiv').classList.remove("over");
			pel('clockdiv').classList.remove("over10");
			document.body.classList.remove("over");
			document.body.classList.remove("over10");
			if (classname)
			{
				pel('clockdiv').classList.add(classname);
			}
			lastclassname = classname;
		}
	}

	lastcountdowntime = null;

	function SetCountdownTime(secs, setlast = true)
	{
		let now = performance.now();
		let currenttime = reftime * 1000 + (now-timeoffset)* driftfactor + offset * 1000;
		let countto = currenttime + secs * 1000;
		if (setlast)
			lastcountdowntime = secs;
		pauseoffset = 0;
		pausestart = null;
		countup = false;
		UpdatePauseStatus();
		updowntime = countto / 1000;
		let dobj = new Date(countto);
		pel('reftime').value = timezone ? djpFormatDate(dobj, timezone, 'Y-m-d\\TH:i:00') : dobj.format('Y-m-d\\TH:i:00');
	}

	function SetCountUp()
	{
		let now = performance.now();
		let currenttime = reftime*1000 + (now-timeoffset)* driftfactor + offset*1000;
		updowntime = currenttime / 1000;
		pauseoffset = 0;
		pausestart = null;
		countup = true;
		UpdatePauseStatus();
	}

	function SelectCountDownTime()
	{
		let el = pel('countdowntime');
		let val = el.value;
		if (val>0)
		{
			SetCountdownTime(val*60);
			// el.value = null;
		}
		else
		{
			ResetClock();
		}
		HideHeader();
	}

	function ResyncTime(newreftime)
	{
		let tempoffset = performance.now();
		let synctime = tempoffset - requestoffset;
		let newoffset = tempoffset;

		timesetat = new Date().getTime();

		let prevtime = reftime*1000.0 + (newoffset-timeoffset)*driftfactor;
		let newtime = newreftime*1000.0;

		reftime = newreftime;
		timeoffset = newoffset;

		let timeerror = newtime - prevtime;
		driftfactor = (prevtime>baseoffset) ? (newtime-baseoffset + 0.0) / (prevtime-baseoffset + 0.0) : 1.0;
		
		if (firstsync)
		{
			firstsync = false;
			baseref = reftime;
			baseoffset = newoffset;
			driftfactor = 1.0;
		}

		timevalid = true;

		console.log('Resync. Current time error: ', timeerror, ' ms, New Drift Factor: ', driftfactor, ' Sync roundtrip: ', synctime, 'ms');
	}

	function StartResync()
	{
		// console.log("Starting resync ", requestoffset);
		requestoffset = performance.now();
		lastresync = performance.now();
		//function djaxqueuejson(objtype, url, obj, onsuccess, onfail, onabandon, onsend, disableobj, autoqueue, delay)
		djaxqueuejson('clocksync', 'clock.php', { reftime: reftime, offset: timeoffset, runtime: performance.now()}, null, null, null, SetRequestOffset);
	}

	function SetRequestOffset()
	{
		requestoffset = performance.now();
	}

	function ClockClick()
	{
		let el = pel('headerbar');
		el.style.display = (el.style.display=='none' ? 'block' : 'none');
	}

	function HideHeader()
	{
		pel('headerbar').style.display = 'none';
	}

	function SecsToTime(rsec)
	{
		neg = (rsec<0) ? '-' : '';
		rsec = Math.abs(rsec);
		let hr = Math.floor(rsec/3600);
		let mn = Math.floor(rsec/60) % 60;
		let sc = Math.floor(rsec) % 60;
		let str = neg+(((hr<10) ? '0' : '') + hr + ':' + ((mn<10) ? '0' : '') + mn + ':' + ((sc<10) ? '0' : '') + sc);
		if (tenths)
		{
			let tv = Math.floor((rsec - Math.floor(rsec)) * 10);
			str += '.' + tv;
		}
		return str;
	}

	function ResetClock()
	{
		updowntime = null;
		pel('reftime').value = '';
		HideHeader();
	}

	function KeyDown(event)
	{
		const focusedElement = document.activeElement;
		const eltype = focusedElement ? focusedElement.tagName.toLowerCase() : '';
		if (eltype === 'input' || eltype === 'button' || eltype=='textarea') return;

		// Escape key
		if (event.key == 'Escape')  
		{
			HideHeader();
			event.preventDefault();
		}
		// respond to the P or p keys	
		else if ((event.key == 'p' || event.key == 'P' || event.key == ' ') && updowntime)  // pause/unpause countdown
		{
			if (pausestart)
			{
				pauseoffset += (new Date().getTime() - pausestart);
				pausestart = null;
			}
			else
			{
				pausestart = new Date().getTime();
			}
			UpdatePauseStatus();
			event.preventDefault();
		}
		// respond to the R key
		else if (event.key == 'r' || event.key == 'R') // reset countdown to last start time
		{
			if (lastcountdowntime > 0)
			{
				let priorpause = pausestart;
				SetCountdownTime(lastcountdowntime, false);
				if (priorpause)
					pausestart = new Date().getTime();				
				event.preventDefault();
			}
		}
		// respond to C to return to real-time clock
		else if (event.key == 'c' || event.key == 'C') // return to real-time clock with C key
		{
			ResetClock();
			event.preventDefault();
		}
		else if (event.key == 's' || event.key == 'S') // start count-up timer
		{
			SetCountUp();
			event.preventDefault();
		}
		else if (event.key == 't' || event.key == 'T') // toggle tenths on/off
		{
			tenths = !tenths;
			event.preventDefault();
		}
		else if (event.key == 'q' || event.key == 'Q') // toggle mini-clock
		{
			miniclock = !miniclock;
			event.preventDefault();
		}
		else if ((event.key == 'd' || event.key == 'D') && !event.altKey && !event.shiftKey && !event.ctrlKey) // specify countdown time 
		{
			let timestr = prompt('Enter countdown time in hh:mm:ss format');
			let secs = parseTimeString(timestr);
			if (secs)
			{
				SetCountdownTime(secs);
			}
			event.preventDefault();
		}
		else if ((event.key == 'm' || event.key == 'M') && !event.altKey && !event.shiftKey && !event.ctrlKey) // specify target time of day
		{
			let timestr = prompt('Enter time of day in hh:mm:ss format (24hr)');
			let secs = parseTimeString(timestr);
			if (secs)
			{
				let startofday = getStartOfDayTimestamp(timezone ? timezone : localzone);;
				let now = new Date().getTime();
				let target = startofday + secs*1000;
				console.log("Start of day: ", startofday, " Now: ", now, " Target: ", target, " Seconds: ", secs, " TimeStr: ", timestr, " Timezone: ", timezone, " Localzone: ", localzone);
				SetCountdownTime((target - now) / 1000.0, false);
			}
			event.preventDefault();
		}
		else if (event.key == 'h' || event.key == 'H') // toggle between 12 and 24 hour format
		{
			hrfmt = (hrfmt == '24' ? '12' : '24');
			pel('fmt').value = hrfmt;
			SetFormatter();
			event.preventDefault();
		}
		else if (event.key == 'z' || event.key == 'Z') // toggle leading zero on countdown
		{
			leadingzero = !leadingzero;
			event.preventDefault();
		}
		// respond to number keys 
		else if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))
		{
			let mins = event.keyCode < 96 ? (event.keyCode - 48) : (event.keyCode - 96);
			if (mins == 0) mins = 10;
			let multiplier = 1.0;
			if (event.shiftKey && event.ctrlKey)
				multiplier = 60.0;
			else if (event.shiftKey)
				multiplier = 5.0;
			else if (event.ctrlKey)
				multiplier = 30.0;
			let priorpause = pausestart;
			SetCountdownTime((mins * 60.0) * multiplier);
			if (priorpause)
				pausestart = new Date().getTime();
			event.preventDefault();
		}
		// respond to the plus symbol
		else if ((event.key == '+' || event.key == '=' || event.key == 'NumPadAdd') && updowntime)
		{
			let currentremain = GetCurrentSecondsRemaining();
			let adjustment = 5;
			if (event.shiftKey)
				adjustment = 30;
			else if (event.ctrlKey)
				adjustment = 60;
			SetCountdownTime((-currentremain) + adjustment, false);
			event.preventDefault();
		}
		// respond to the minus symbol
		else if ((event.key == '-' || event.key == '_' || event.key == 'NumpadSubtract') && updowntime)
		{
			let currentremain = GetCurrentSecondsRemaining();
			let adjustment = 5;
			if (event.shiftKey)
				adjustment = 30;
			else if (event.ctrlKey)
				adjustment = 60;
			SetCountdownTime((-currentremain) - adjustment, false);
			event.preventDefault();
		}
		else if (event.key == 'ArrowUp') // up arrow
		{
			fontsize += 0.333;
			pel('clocktext').style.fontSize = fontsize + 'vw';
			pel('sz').value = fontsize;
			event.preventDefault();
		}
		else if (event.key == 'ArrowDown') // down arrow
		{
			fontsize -= 0.333;
			pel('clocktext').style.fontSize = fontsize + 'vw';
			pel('sz').value = fontsize;
			event.preventDefault();
		}
		else
		{
			console.log("Unrecognized Key: ", event.key, event.keyCode, event.code);
		}
		UpdatePauseStatus();
	}

	function UpdatePauseStatus()
	{
		let el = pel('clocktext');
		if (pausestart && updowntime)
		{
			el.classList.add('paused');
		}
		else
		{
			el.classList.remove('paused');
		}
	}

	function parseTimeString(timeString) 
	{
    // Split the time string by colons.
		const parts = timeString.split(':').map(Number);

		// Initialize hours, minutes, and seconds to zero.
		let hours = 0, minutes = 0, seconds = 0;

		// Assign values based on the length of the parts array.
		if (parts.length === 3) 
		{
			[hours, minutes, seconds] = parts;
		} 
		else if (parts.length === 2) 
		{
			[minutes, seconds] = parts;
		} 
		else if (parts.length === 1) 
		{
			[seconds] = parts;
		}

		// Calculate total seconds.
		return hours * 3600 + minutes * 60 + seconds;
	}

	function SetFormatter()
	{
		formatter = hrfmt == '24' 
			? new Intl.DateTimeFormat('en-uk', {hour: '2-digit', minute: '2-digit', second: '2-digit'})
			: new Intl.DateTimeFormat('en-us', {hour: '2-digit', minute: '2-digit', second: '2-digit'});
		timeformat = hrfmt == '24' ? 'H:i:s' : 'h:i:s';
	}

	function getStartOfDayTimestamp(timeZone) 
	{
		// Create a new Date object for the current date.
		const now = new Date();

		// Get the current date in the specified time zone.
		const dateStr = now.toLocaleString('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });
		
		// Parse the date string to get a date object at the start of the day.
		const [month, day, year] = dateStr.split('/');
		const startOfDay = new Date(`${year}-${month}-${day}T00:00:00`).getTime();

		// Convert the timestamp to milliseconds.
		return startOfDay;
	}

	window.addEventListener('keydown', KeyDown);

	let localzone = pel('localtimezone').value = Intl.DateTimeFormat().resolvedOptions().timeZone;

	window.setInterval(UpdateTime, 50); // every 50 milliseconds
	window.setInterval(StartResync, 10*60*1000); // every 10 minutes
	window.setTimeout(StartResync, 1*60*1000);  // after 1 minute
	window.setTimeout(StartResync, 10*1000);  // after 10 seconds
	timevalid = false;
	StartResync();


	</script>
</body>
</html>