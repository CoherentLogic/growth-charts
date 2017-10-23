/*
*  v4wgcafhc.js - Growth Charts Adolescent Female
*
*  Written by DL Wicksell <dlw@linux.com>
*  Copyright © 2014 Fourth Watch Software, LC
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
*  Growth Chart Adolescent Female Body Mass Index-for-Age
*/

var createFemaleBmiChart = function(patName, patRec, patDOB, bmi) {
    var paper = new Raphael('growth-chart', 810, 1072); 
    
    function print(x, y, text, fontSize) {
        var textAnchor = paper.text(x, y, text).attr("font-size", fontSize);
        textAnchor.attr("text-anchor", "start");
    }
    
    function bmiPoint(year, value, fill, stroke, size) {
        var xOffset = 52.8;
        var yOffset = 1237;
    
        var x  = year * 31.55 + xOffset;
        var y  = yOffset - value * 30.35;
    
        if ((2 <= year) && (year <= 20) && (114.04 <= y) && (y <= 933.5)) {
            paper.circle(x, y, size).attr({"fill": fill, "stroke": stroke});
        }
    }
    
    paper.rect(0, 0, 810, 1072, 10).attr("fill", "#fff"); 
        
    paper.image("images/grchrt_girls_2-20_bmi.png", 10, 10, 789, 1058);
    
    paper.rect(512, 70, 225, 4).attr({"fill": "#fff", "stroke-width": 0});
    paper.rect(638, 92, 110, 4).attr({"fill": "#fff", "stroke-width": 0});
    
    print(520, 74, patName, 16);
    print(645, 94, patRec, 16);

    paper.rect(62, 958, 676, 66).attr({"fill": "#fff", "stroke-width": 0});

    var date = new Date().toDateString();
    print(342, 1010, date, 16);

    for(key in bmi) {
	var x = key;
	var y = bmi[key];

	if(x === "" || y === "") continue;

	x = x / 12;
	x = Math.round(x * 100) / 100;

	bmiPoint(x, y, "#33f", "#888", 3);
    }

}
