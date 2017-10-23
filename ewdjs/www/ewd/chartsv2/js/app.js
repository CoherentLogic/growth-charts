/*
 * app.js 
 */

EWD.sockets.log = false;

EWD.application = {
    name: 'chartsv2',
    timeout: 3600,
    login: false,
    activeChart: 0,
    patientsTable: null,
    selectedPatient: {
	dfn: null,
	name: ""
    },

    onStartup: function() {

	QueryString = function () {
	    // This function is anonymous, is executed immediately and 
	    // the return value is assigned to QueryString!
	    var query_string = {};
	    var query = window.location.search.substring(1);
	    var vars = query.split("&");
	    for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
		    query_string[pair[0]] = decodeURIComponent(pair[1]);
		    // If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
		    var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
		    query_string[pair[0]] = arr;
		    // If third or later entry with this name
		} else {
		    query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	    } 
	    return query_string;
	}();

	if(QueryString.dfn) {
	    EWD.application.inCPRS = true;
	    EWD.application.dfn = QueryString.dfn;	
	}
	else {
	    EWD.application.inCPRS = false;
	    EWD.application.dfn = null;

	    $('#loginBtn').on('click', function(event) {
	      EWD.sockets.submitForm({
	        fields: {
	          username: $('#username').val(),
	          password: $('#password').val()
	        },
	        messageType: 'EWD.form.login',
	        alertTitle: 'Login Error',
	        toastr: {
	          target: 'loginPanel'
	        },
	        popover: {
	          buttonId: 'loginBtn',
	          container: 'loginPanel',
	          time: 2000
	        }
	      }); 
	    });

	}

	console.log("Starting init cycle on server");

	EWD.sockets.sendMessage({
	    type: "init",
	    params: {
		inCPRS: EWD.application.inCPRS,
		dfn: EWD.application.dfn
	    }
	});

    },

    onMessage: {

	init: function(msg) {
	    console.log("Init cycle complete.");	   

	    if(!EWD.application.inCPRS) {
		$("#loginPanel").modal();
	    }

	},

	loggedInAs: function(msg) {

	},

	loggedIn: function(msg) {

	    EWD.application.patientsTable = $("#patientsTable").DataTable({
		paging: false,
		searching: false,
		info: false		
	    });

	    $("#patInput").keyup(function(e) {
		var prefix = $("#patInput").val();

		EWD.sockets.sendMessage({
		    type: "getPatients",
		    params: {
			prefix: prefix
		    }
		});
	    });

	    if(msg.message.patientPicker) {
		$("#patientSelect").modal();
	    }
	    else {
		getChart(EWD.application.dfn);
	    }
	},

	getPatients: function(msg) {
	    EWD.application.patientsTable.clear();

	    var patients = msg.message;

	    var havePatients = false;

	    for(var dfn in patients) {
		var tableData = '<a href="#" onclick="selectPatient(' + dfn + ', ';
		tableData += "'" + patients[dfn] + "')" + '">' + patients[dfn] + '</a>';

		EWD.application.patientsTable.row.add([tableData]);
		havePatients = true;
	    }

	    if(!havePatients) EWD.application.patientsTable.row.add(['<span style="color:red;">No matching results</span>']);

	    EWD.application.patientsTable.draw();

	},

	getChart: function(msg) {
	    var patient = msg.message;

	    EWD.application.selectedPatient.name = msg.message.PATNAME;
	    patient.name = EWD.application.selectedPatient.name;
	    
	    EWD.application.growthCharts = new GrowthCharts(patient);
	    
	    $("#growth-chart").empty();

	    updateUI();

	    $("#chart-link-0").click();
	}
	
    } /* onMessage: */

}

function getChart(dfn) {
    EWD.sockets.sendMessage({
	type: "getChart",
	params: {
	    dfn: dfn
	}
    });
}

function selectPatient(dfn, name) {
    EWD.application.selectedPatient.dfn = dfn;
    EWD.application.selectedPatient.name = name;

    $("#patientSelect").modal('hide');

    $("#patInput").val('');
    EWD.application.patientsTable.clear();
    EWD.application.patientsTable.row.add(["Begin typing patient's last name."]).draw();

    getChart(dfn);
}

function updateUI() {
    var internalName = EWD.application.growthCharts.name;
    
    var nameParts = internalName.split(",");

    var lastName = nameParts[0];
    var firstName = nameParts[1];

    var name = toTitleCase(firstName + " " + lastName);

    $(".patientName").html(name);

    $("#gender").html(toTitleCase(EWD.application.growthCharts.sex));
    
    var ageInMonths = EWD.application.growthCharts.ageInMonths;

    if(ageInMonths > 24) {
	var age = Math.round(ageInMonths / 12) + " yr.";
    }
    else {
	var age = Math.round(ageInMonths) + " mo.";
    }

    age += " (" + EWD.application.growthCharts.ageCategory + ")";

    $("#age").html(age);
    $("#dob").html(EWD.application.growthCharts.dob);
    $("#dod").html(EWD.application.growthCharts.dod);

    $("#charts-list").empty();

    
    var ctr = 0;

    for(index in EWD.application.growthCharts.charts) {
	var id = "chart-link-" + ctr;

	var html = '<a href="#" id="' + id + '" class="growth-chart-selector list-group-item">' + index + '</a>';
	$("#charts-list").append(html);

	$("#" + id).click(function(e) {	    
	    var chartIdx = $("#" + e.currentTarget.id)[0].innerText;

	    EWD.application.currentChart = chartIdx;
	    document.title = chartIdx + " - Tenzing Growth Charts";
	    
	    EWD.application.growthCharts.charts[chartIdx]();

	    $(".growth-chart-selector").removeClass("active");

	   $("#" + e.currentTarget.id).addClass("active");
	});

	ctr++;
    }


}

function reSelectPatient() 
{
    $("#patientSelect").modal();
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function printCurrentChart() 
{
    var printContents = $("#growth-chart").clone();

    var printWindow = window.open("", "popup","width=1000,height=600,scrollbars=yes,resizable=yes," +  
                "toolbar=no,directories=no,location=no,menubar=no,status=no,left=0,top=0");
    var doc = printWindow.document;
    
    doc.open();
    doc.write($(printContents).html());
    doc.close();

    printWindow.print();


}

function downloadCurrentChart()
{
    var svg = $("#growth-chart").html();
    svg = svg.replace(/\r?\n|\r/g, '').trim();

    var canvas = document.getElementById("pdf-canvas");
    canvg(canvas, svg);

    var imgData = canvas.toDataURL('image/png');
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.addImage(imgData, 'PNG', 40, 40, 75, 75);
    doc.save(EWD.application.currentChart + ".pdf");
}