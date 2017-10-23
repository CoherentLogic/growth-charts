/*
*  v4wgcpblw.js - Growth Charts Pediatric Boy
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
*  Growth Chart Pediatric Boy Length-for-age and Weight-for-age
*/

var createBoysLengthWeight = function(patName, patRec, patDOB, length, weight) {

    var paper = new Raphael('growth-chart', 810, 1072); 
    
    function print(x, y, text, fontSize) {
        var textAnchor = paper.text(x, y, text).attr("font-size", fontSize);
        textAnchor.attr("text-anchor", "start");
    }
    
    function lengthPoint(month, value, fill, stroke, size) {
        var xOffset = 161;
        var yOffset = 942;
    
        var x  = month * 20.6 + xOffset;
        var y  = yOffset - value * 8;
    
        if ((0 <= month) && (month <= 24) && (118 <= y) && (y <= 662)) {
            paper.circle(x, y, size).attr({"fill": fill, "stroke": stroke});
        }
    }
    
    function weightPoint(month, value, fill, stroke, size) {
        var xOffset = 161;
        var yOffset = 1022;
    
        var x  = month * 20.6 + xOffset;
        var y  = yOffset - value * 40;
    
        if ((0 <= month) && (month <= 24) && (262 <= y) && (y <= 966)) {
            paper.circle(x, y, size).attr({"fill": fill, "stroke": stroke});
        }
    }
    

    paper.rect(0, 0, 810, 1072, 10).attr("fill", "#fff"); 
        
    paper.image("images/gc_boys_plw.png", 10, 10, 789, 1058);
    
    paper.rect(82, 986, 653, 64).attr({"fill": "#fff", "stroke-width": 0});
    paper.rect(510, 63, 225, 4).attr({"fill": "#fff", "stroke-width": 0});
    
    var date = new Date().toDateString();

    print(350, 1030, date, 16);


    print(520, 66, patName, 16);

    print(645, 86, patRec, 16);

    for(key in length) {
	var x = key;
	var y = length[key];

	if(x === "" || y === "") continue;

	lengthPoint(x, y, "#f33", "#888", 3);
    }

    for(key in weight) {
	var x = key;
	var y = weight[key];

	if(x === "" || y === "") continue;

	weightPoint(x, y, "#3f3", "#888", 3);
    }

}
