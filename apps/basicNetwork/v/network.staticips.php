<div class='pageTitle'>Network: Static IPs</div>

<!--
 DHCP Leases
 ARP List
 Static Addresses?
-->

<div class='controlBox'><span class='controlBoxTitle'>Static Devices</span>
	<div class='controlBoxContent'>
		<table id='list' class='listTable'></table>
		<input type='button' value='Add' id='add'>
		<input type='button' value='Save' onclick='saveStaticList();'>
		<input type='button' value='Cancel' onclick='cancelStaticList();'>
	</div>
</div>

<script type='text/ecmascript' src='/libs/jquery.dataTables.min.js'></script>
<script type='text/ecmascript' src='/libs/jquery.jeditable.min.js'></script>
<script type='text/ecmascript'>

 var lt =  $('#list').dataTable({
	'bPaginate': false,
	'bInfo': false,
	'bFilter': false,
	'sAjaxDataProp': 'staticips',
	'sAjaxSource': 'php/bin.network.staticips.php',
	'aoColumns': [
		{ 'sTitle': 'MAC',      'mData':'mac',          'sClass': 'plainText'   },
		{ 'sTitle': 'Address',  'mData':'ip',  'sClass': 'plainText'   },
		{ 'sTitle': 'Name',     'mData':'hostname',       'sClass': 'plainText'  }

	],
	'fnRowCallback': function(nRow, aData, iDisplayIndex, iDisplayIndexFull){
		$(nRow).find('.plainText').editable(
			function(value, settings){ return value; },
			{
				'onblur':'submit',
				'event': 'dblclick',
				'placeholder' : '(Click to edit)',
			}
		);
	}	
});

$('#add').click( function (e) {
	e.preventDefault();
	lt.fnAddData(
		{
			"mac": null, 
			"ip": null, 
			"hostname": null
		}
	);
});


</script>
