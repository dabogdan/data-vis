function PieChart(x, y, diameter) {

    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.labelSpace = 30;


    // ellipseMode(RADIUS);
    // let colour;


    this.get_degrees = function (data) {
        const total = sum(data);
        const degrees = [];

        for (let i = 0; i < data.length; i++) {
            degrees.push((data[i] / total) * 360);
        }

        return degrees;
    };

    // this.drawTitle = function () {
    //     fill(0);
    //     noStroke();
    //     textAlign('center', 'center');
    //
    //     text(this.title,
    //         (this.layout.plotWidth() / 2) + this.layout.leftMargin,
    //         this.layout.topMargin - (this.layout.marginSize / 2));
    // };

    this.makeLegendItem = function (label, i, colour) {
        const x = this.x + 50 + this.diameter / 2;
        const y = this.y + (this.labelSpace * i) - this.diameter / 3;
        const boxWidth = this.labelSpace / 2;
        const boxHeight = this.labelSpace / 2;

        fill('black');
        noStroke();
        textAlign('left', 'center');
        textSize(12);
        text(label, x + boxWidth + 10, y + boxWidth / 2);
        fill(colour);
        rect(x, y, boxWidth, boxHeight);
    };

    this.draw = function (data, labels, colours, title) {
        // this.drawTitle();
        angleMode(DEGREES);
        // Test that data is not empty and that each input array is the
        // same length.
        if (data.length === 0) {
            alert('Data has length zero!');
        } else if (![labels, colours].every((array) => {
            return array.length === data.length;
        })) {
            alert(`Data (length: ${data.length})
            Labels (length: ${labels.length})
            Colours (length: ${colours.length})
            Arrays must be the same length!`);
        }

        // https://p5js.org/examples/form-pie-chart.html

        const angles = this.get_degrees(data);
        let lastAngle = 0;

        //capture mouse distance from the centre of the chart
        const distFromCenter = dist(this.x, this.y, mouseX, mouseY)
        let mouseAngle = atan2(mouseY - this.y, mouseX - this.x);
        if (mouseAngle < 0) {
            mouseAngle += 360;
        }

        //ellipse inside to make donut chart
        this.innerRadius = 200;

        for (let i = 0; i < data.length; i++) {
            if (colours) {
                colour = colours[i];
            } else {
                colour = map(i, 0, data.length, 0, 255);
            }
            //drawing the labels
            if (labels) {
                this.makeLegendItem(labels[i], i, colour);
            }

            stroke(0);
            strokeWeight(0);
            //drawing the donut
            // this.drawDonut(colour, angles[i], data[i]);

            if (distFromCenter <= this.diameter * 0.5 && distFromCenter > this.innerRadius * 0.5) {
                if (mouseAngle > lastAngle && mouseAngle < lastAngle + angles[i]) {
                    //highlight the chosen ark
                    fill(colour);
                    arc(this.x, this.y, this.diameter + 10, this.diameter + 10,
                        lastAngle - 1, lastAngle + angles[i] + 0.001); // Hack for 0!
                    //inner circle to make a donut
                    fill(255, 255, 255);
                    ellipse(this.x, this.y, this.innerRadius, this.innerRadius);
                    //text with data inside
                    textSize(32);
                    fill(0);
                    text(data[i].toFixed(2) + " %", this.x - 40, this.y);
                }
            } else {
                //draw default pie chart if user does not hover
                fill(colour);
                arc(this.x, this.y,
                    this.diameter, this.diameter,
                    lastAngle, lastAngle + angles[i] + 0.001); // Hack for 0!
                //inner circle to make a donut
                fill(255, 255, 255);
                ellipse(this.x, this.y, this.innerRadius, this.innerRadius);
            }

            //setting the last angle to the position of the current angle
            lastAngle += angles[i];
        }

        if (title) {
            noStroke();
            textAlign('center', 'center');
            textSize(24);
            fill(0);
            text(title, this.x, this.y - this.diameter * 0.6);
        }
    };

}
