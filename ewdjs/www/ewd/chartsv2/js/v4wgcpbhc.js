/*
*  v4wgcpbhc.js - Growth Charts Pediatric Boy
*
*  Written by DL Wicksell <dlw@linux.com>
*  Copyright © 2013 Fourth Watch Software, LC
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
*  Growth Chart Pediatric Boy Head Circumference and Weight-for-Length
*/

var createBoysCircWeight = function(patName, patRec, patDOB, circ, wghtLen) {

    var paper = new Raphael('growth-chart', 810, 1072); 
    
    function print(x, y, text, fontSize) {
        var textAnchor = paper.text(x, y, text).attr("font-size", fontSize);
        textAnchor.attr("text-anchor", "start");
    }
    
    function circPoint(month, value, fill, stroke, size) {
        var xOffset = 152;
        var yOffset = 1174;
    
        var x  = month * 20.7 + xOffset;
        var y  = yOffset - value * 19.3;
    
        if ((0 <= month) && (month <= 24) && (131.8 <= y) && (y <= 614.3)) {
            paper.circle(x, y, size).attr({"fill": fill, "stroke": stroke});
        }
    }
    
    function wghtLenPoint(length, weight, fill, stroke, size) {
        var xOffset = -187;
        var yOffset = 930;
    
        var x  = length * 7.6 + xOffset;
        var y  = yOffset - weight * 23.2;
    
        if ((0 <= length) && (length <= 110.5) && (363.92 <= y) && (y <= 930)) {
            paper.circle(x, y, size).attr({"fill": fill, "stroke": stroke});
        }
    }
    

    paper.rect(0, 0, 810, 1072, 10).attr("fill", "#fff"); 
        
    paper.image("images/gc_boys_pcirc.png", 10, 10, 789, 1058);
    
    paper.rect(82, 982, 653, 66).attr({"fill": "#fff", "stroke-width": 0});
    paper.rect(512, 70, 225, 4).attr({"fill": "#fff", "stroke-width": 0});
    paper.rect(638, 92, 110, 4).attr({"fill": "#fff", "stroke-width": 0});
    
    var date = new Date().toDateString();

    print(350, 1030, date, 16);


    print(520, 74, patName, 16);

    print(645, 94, patRec, 16);


    for(key in circ) {
	var x = key;
	var y = circ[key];

	if(x === "" || y === "") continue;

	circPoint(x, y, "#f33", "#888", 3);
    }

    for(key in wghtLen) {
	var x = key;
	var y = wghtLen[key];

	if(x === "" || y === "") continue;

	wghtLenPoint(x, y, "#3f3", "#888", 3);
    }

}
