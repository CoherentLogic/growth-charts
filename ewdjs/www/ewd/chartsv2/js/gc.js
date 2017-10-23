
function GrowthCharts(patientRec) {
    var self = this;

    this.ageInMonths = patientRec.AGE;
    this.ageCategory = patientRec.AGECAT;
    this.bmi = patientRec.BMI || [];
    this.circ = patientRec.CIRC || [];
    this.dob = patientRec.DOB;
    this.dod = patientRec.DOD;
    this.height = patientRec.HEIGHT || [];
    this.lengthWeight = patientRec.LENWGHT || [];
    this.mrn = patientRec.MEDREC;
    this.sex = patientRec.SEX.toLowerCase();
    this.weight = patientRec.WEIGHT || [];
    this.name = patientRec.name;

    console.log(this);

    function resetRootElement() {
	$("#growth-chart").empty();
	$("#growth-chart").removeClass("male-canvas");
	$("#growth-chart").removeClass("female-canvas");
    }

    function afterDraw() {

    }


    var charts = {
	"Pediatric Head Circumference/Weight": {
	    ageCategories: ["Pediatric", "Adolescent", "Adult"],
	    male: function () {
		resetRootElement();
		createBoysCircWeight(self.name, self.mrn, self.dob, self.circ, self.lengthWeight);
	    },
	    female: function () {
		resetRootElement();		
		createGirlsCircWeight(self.name, self.mrn, self.dob, self.circ, self.lengthWeight);
	    }
	},
	"Pediatric Length/Weight": {
	    ageCategories: ["Pediatric", "Adolescent", "Adult"],
	    male: function () {
		resetRootElement();
		createBoysLengthWeight(self.name, self.mrn, self.dob, self.length, self.weight);
	    },
	    female: function () {
		resetRootElement();
		createGirlsLengthWeight(self.name, self.mrn, self.dob, self.length, self.weight);
	    }
	},
	"Adolescent BMI": {
	    ageCategories: ["Adolescent", "Adult"],
	    male: function () {
		resetRootElement();
		createMaleBmiChart(self.name, self.mrn, self.dob, self.bmi);
	    },
	    female: function () {
		resetRootElement();
		createFemaleBmiChart(self.name, self.mrn, self.dob, self.bmi);
	    }
	},
	"Adolescent Length/Weight": {
	    ageCategories: ["Adolescent", "Adult"],
	    male: function () {
		resetRootElement();
		createMaleLengthWeight(self.name, self.mrn, self.dob, self.length, self.weight);
	    },
	    female: function () {
		resetRootElement();
		createFemaleLengthWeight(self.name, self.mrn, self.dob, self.length, self.weight);
	    }
	},
	"Adult BMI": {
	    ageCategories: ["Adult"],
	    male: function () {
		resetRootElement();
		$("#growth-chart").addClass("male-canvas");
		createMenBmiChart(self.name, self.mrn, self.dob, self.bmi, self.circ);
	    },
	    female: function () {
		resetRootElement();
		$("#growth-chart").addClass("female-canvas");
		console.log("calling createWomanBmiChart()");
		createWomanBmiChart(self.name, self.mrn, self.dob, self.bmi, self.circ);
	    }
	},
	"Adult Height": {
	    ageCategories: ["Adult"],
	    male: function () {
		resetRootElement();
		$("#growth-chart").addClass("male-canvas");
		createMenHeightChart(self.name, self.mrn, self.dob, self.height);
	    },
	    female: function () {
		resetRootElement();
		$("#growth-chart").addClass("female-canvas");
		createWomanHeightChart(self.name, self.mrn, self.dob, self.height);
	    }
	},
	"Adult Weight": {
	    ageCategories: ["Adult"],
	    male: function () {
		resetRootElement();
		$("#growth-chart").addClass("male-canvas");
		createMenWeightChart(self.name, self.mrn, self.dob, self.weight);
	    },
	    female: function () {
		resetRootElement();
		$("#growth-chart").addClass("female-canvas");
		createWomanWeightChart(self.name, self.mrn, self.dob, self.weight);
	    }
	}	
    };

    this.charts = {};

    for(key in charts) {
	var chart = charts[key];
	if(chart.ageCategories.includes(this.ageCategory)) {
	    this.charts[key] = chart[this.sex];
	}
    }
    
    return this;
}



