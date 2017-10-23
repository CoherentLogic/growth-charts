/*
*  v4wgcwh.js - Growth Charts Adult Woman Height
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
// Growth Chart Woman Height
var createWomanHeightChart = function(patName, patRec, patDOB, height) {
    var paper   = new Raphael(document.getElementById('growth-chart'), 840, 1040); 
    var xoffset = 60;
    var yoffset = 120;
    var rect    = paper.rect(0, 0, 780, 1000, 10).attr("fill","#fff"); 
    
    var factor  = .525
    
    function line(month1, value1, month2, value2) {
        var x1  = month1*factor + (xoffset - 70);
        var y1  = 1300 + yoffset - (value1 * 6);
        var x2  = month2*factor + (xoffset - 70);
        var y2  = 1300 + yoffset - (value2 * 6);
        var pt = paper.path("M" + x1 + " " + y1 + "L" + x2 + " " + y2 + "Z")
        
        pt.attr("fill", "#f33");
        pt.attr("stroke", "#789"); 
    }
    //To add functionality, later we must code point to show the exact point info.   
    function point(month, value) {
        var x  = month*factor + xoffset - 0;
        var y  = 1300 + yoffset - (value * 6);
        if ((0 < month) && (month <= 12*100) &&
            (120 < y)   && (y <= 940)) {
            var pt = paper.circle( x, y, 3);
            pt.attr("fill", "#f33");
            pt.attr("stroke", "#888"); 
        }
    }
    
    function text(month, value, t) {
        var x  = month*factor + xoffset;
        var y  = (1300 + yoffset) - (value * 6);
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
    text(50*12, 72, "Year");
    
    
    for (row = 0;  row <= 820;  row += 10) { // Horizontal lines
        var path=paper.path("M" + (xoffset + 0) + " " + (row + yoffset) +
                            "L" + (xoffset + 630) + " " + (row + yoffset) + " Z");
        if (row % 25 == 0) {
            path.attr({stroke: "#888"});
            paper.text(666 + xoffset, row + yoffset, "" +Math.round(((850 - row) / 6)+75) );
        } else {
            path.attr({stroke: "#BBB"});
        }
    } 
    text(106*12,79.5,"cm");
    text(111*12,79.5,"in");
    text(111*12,216.6,"85.4");
    text(111*12,208.4,"81.9");
    text(111*12,200,"78.7");
    text(111*12,191.6,"75.6");
    text(111*12,183.2,"72.1");
    text(111*12,175,"68.9");
    text(111*12,166.6,"65.8");
    text(111*12,158.4,"62.2");
    text(111*12,150,"59.1");
    text(111*12,141.6,"56");
    text(111*12,133.3,"52.4");
    text(111*12,125,"49.2");
    text(111*12,116.6,"46.1");
    text(111*12,108.3,"42.5");
    text(111*12,100,"39.4");
    text(111*12,91.6,"36.2");
    text(111*12,83.4,"32.7");
    

    var date = new Date().toDateString();
        
        // Dummy up a chart
    text(50*12,233, patName);
    text(91.4*12,228,"Today: " + date);
    text(90.0*12,225,"Chart: Adult Woman Height");
    text(10.6*12,228,"Medical Record: " + patRec);
    text(7.3*12,225,"Born: " + patDOB);

    for(key in height) {
	var x = key;
	var y = height[key];

	if(x === "" || y === "") continue;

	point(x, y);
    }

}


/*
 *  $RCSfile$
 */
