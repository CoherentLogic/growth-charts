/*
*  v4wgcaflw.js - Growth Charts Adolescent Female
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
*  Growth Chart Adolescent Female Length-for-age and Weight-for-age
*/

var createFemaleLengthWeight = function(patName, patRec, patDOB, length, weight) {
    var paper = new Raphael('growth-chart', 810, 1072); 
    
    function print(x, y, text, fontSize) {
        var textAnchor = paper.text(x, y, text).attr("font-size", fontSize);
        textAnchor.attr("text-anchor", "start");
    }
    
    function lengthPoint(year, value, fill, stroke, size) {
        var xOffset = 95.6;
        var yOffset = 1194;
    
        var x  = year * 27.7 + xOffset;
        var y  = yOffset - value * 5.4;
    
        if ((2 <= year) && (year <= 20) && (130.2 <= y) && (y <= 789)) {
            paper.circle(x, y, size).attr({"fill": fill, "stroke": stroke});
        }
    }
    
    function weightPoint(year, value, fill, stroke, size) {
        var xOffset = 95.6;
        var yOffset = 1005;
    
        var x  = year * 27.7 + xOffset;
        var y  = yOffset - value * 5.4;
    
        if ((2 <= year) && (year <= 20) && (411 <= y) && (y <= 972.6)) {
            paper.circle(x, y, size).attr({"fill": fill, "stroke": stroke});
        }
    }
    
    paper.rect(0, 0, 810, 1072, 10).attr("fill", "#fff"); 
        
    paper.image("images/grchrt_girls_2-20_sawa.png", 10, 10, 789, 1058);
    
    paper.rect(514, 72, 224, 4).attr({"fill": "#fff", "stroke-width": 0});
    paper.rect(638, 92, 100, 4).attr({"fill": "#fff", "stroke-width": 0});

    print(520, 75, patName, 16);
    print(645, 95, patRec, 16);

    paper.rect(82, 990, 653, 64).attr({"fill": "#fff", "stroke-width": 0});
    
    var date = new Date().toDateString();
    print(350, 1030, date, 16);

    for(key in length) {
	var x = key;
	var y = length[key];

	if(x === "" || y === "") continue;

	lengthPoint(x, y, "#33f", "#888", 3);
    }

    for(key in weight) {
	var x = key;
	var y = weight[key];

	if(x === "" || y === "") continue;

	weightPoint(x, y, "#3f3", "#888", 3);
    }

}
