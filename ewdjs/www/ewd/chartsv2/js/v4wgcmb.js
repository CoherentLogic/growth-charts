/*
*  v4wgcmb.js - Growth Charts Adult Men BMI
*
*  Written by Kevin Lapin <kmlapin@fourthwatchsoftware.com>
*         and LD Landis   <ldl@linux.com>
*         and DL Wicksell <dlw@linux.com>
*
*  Copyright © 2011 Fourth Watch Software, LC
*
*  This program is free software: you can redistribute it and/or modify
*  it under the terms of the GNU Affero General Public License (AGPL)
*  as published by the Free Software Foundation, either version 3 of
*  the License, or (at your option) any later version.
*
*  This program is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
*  GNU Affero General Public License for more details.
*
*  You should have received a copy of the GNU Affero General Public License
*  along with this program. If not, see http://www.gnu.org/licenses/.
*
*  $Source$
*  $Revision$
*/
//Growth Chart Adult Men BMI
var createMenBmiChart = function(patName, patRec, patDOB, bmi, circ) {
    var paper   = new Raphael(document.getElementById('growth-chart'), 840, 1040);
    var xoffset = 60;
    var yoffset = 120;
    var rect    = paper.rect(0, 0, 780, 1000, 10).attr("fill","#fff");

    var factor  = .525

    function line(month1, value1, month2, value2) {
        var x1  = month1*factor + (xoffset - 70);
        var y1  = 950 + yoffset - (value1 * 25);
        var x2  = month2*factor + (xoffset - 70);
        var y2  = 950 + yoffset - (value2 * 25);
        var pt  = paper.path("M" + x1 + " " + y1 + "L" + x2 + " " + y2 + "Z")
            
        pt.attr("fill", "#f33");
        pt.attr("stroke", "#789");
    }

    function point(month, value) {
        var x  = month*factor + xoffset;
        var y  = 950 + yoffset - (value * 25);

        if ((0 < month) && (month <= 12*100) &&
            (120 < y)   && (y <= 940)) {
            var pt = paper.circle( x, y, 3);
            pt.attr("fill", "#f33");
            pt.attr("stroke", "#888");

        }
    }

    function text(month, value, t) {
        var x  = month*factor + xoffset;
        var y  = (950 + yoffset) - (value * 25);
        var pt = paper.text( x, y, "" + t).attr("fill", "#f33");
            
        pt.attr("stroke", "#444");
    }
    var row, col, month;

    for (month = 0*12;  month <= 100*12;  month+=24) { // Vertical lines
        var path = paper.path("M" + (month*factor + xoffset) + " " +  yoffset +                        
                              "L" + (month*factor + xoffset) + " " + (yoffset + 820)
                              + "Z");
        if (month % 48 == 0) {
            path.attr({stroke: "#888"});
            paper.text((month*factor + xoffset), 840 + yoffset, "" + month/12);
        } else {
            path.attr({stroke: "#BBB"});
        }
    }
    text(50*12, 3.25, "Year");


    for (row = 0;  row <= 820;  row += 10) { // Horizontal lines
        var path=paper.path("M" + (xoffset + 0) + " " + (row + yoffset) +
                            "L" + (xoffset + 630) + " " + (row + yoffset) + " Z");
        if (row % 25 == 0) {
            path.attr({stroke: "#888"});
            paper.text(666 + xoffset, row + yoffset, "" + (((850 - row) / 25) +4) );
        } else {
            path.attr({stroke: "#BBB"});
        }
    }

        
    var date = new Date().toDateString();

    // Dummy up a chart
    text(50*12,42, patName);
    text(91.5*12,40,"Today: " + date);
    text(91*12,39,"Chart: Adult Male BMI");
    text(11.4*12,40,"Medical Record: " + patRec);
    text(7.6*12,39,"Born: " + patDOB);

    for(key in bmi) {
	var x = key;
	var y = bmi[key];

	if(x === "" || y === "") continue;

	point(x, y);
    }

}


/*
 *  $RCSfile$
 */
