function TechDiversityGender() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Tech Diversity: Gender';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'tech-diversity-gender';

    // Layout object to store all common plot layout parameters and
    // methods.
    this.layout = {
        // Margin positions around the plot. Left and bottom margins are
        // bigger so there is space for axis and tick labels on the canvas.
        leftMargin: 130,
        rightMargin: width,
        topMargin: 30,
        bottomMargin: height,
        pad: 5,

        plotWidth: function () {
            return this.rightMargin - this.leftMargin;
        },

        // Boolean to enable/disable background grid.
        grid: true,

        // Number of axis tick labels to draw so that they are not drawn on
        // top of one another.
        numXTickLabels: 10,
        numYTickLabels: 8,
    };

    // Middle of the plot: for 50% line.
    this.midX = (this.layout.plotWidth() / 2) + this.layout.leftMargin;

    // Default visualisation colours.
    this.femaleColour = color(255, 0, 0);
    this.maleColour = color(0, 255, 0);

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function () {
        var self = this;
        this.data = loadTable(
            './data/tech-diversity/gender-2018.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function (table) {
                self.loaded = true;
            });

    };

    this.setup = function () {
        // Font defaults.
        textSize(16);
    };

    this.destroy = function () {
    };

    this.drawFemaleRect = function (lineY, lineHeight, percentage) {
        rect(this.layout.leftMargin,
            lineY,
            this.mapPercentToWidth(percentage),
            lineHeight - this.layout.pad + 2);
    }

    this.drawMaleRect = function (lineY, lineHeight, percentageMale, percentageFemale) {
        rect(this.layout.leftMargin + this.mapPercentToWidth(percentageFemale),
            lineY,
            this.mapPercentToWidth(percentageMale),
            lineHeight - this.layout.pad);
    }

    this.draw = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Draw Female/Male labels at the top of the plot.
        this.drawCategoryLabels();

        const lineHeight = (height - this.layout.topMargin) /
            this.data.getRowCount();
        // Loop over every row in the data.
        for (let i = 0; i < this.data.getRowCount(); i++) {

            // Calculate the y position for each company.
            let lineY = (lineHeight * i) + this.layout.topMargin;

            // Create an object that stores data from the current row.
            let company = {
                // Convert strings to numbers.
                name: this.data.getString(i, 0),
                female: this.data.getNum(i, 1),
                male: this.data.getNum(i, 2)
            };

            // Draw the company name in the left margin.
            fill(0);
            noStroke();
            textAlign('right', 'top');
            text(company.name,
                this.layout.leftMargin - this.layout.pad,
                lineY);

            //catching the mouse hover over female rectangles
            if (
                mouseX > this.layout.leftMargin &&
                mouseX < this.mapPercentToWidth(company.female) + 130 &&
                mouseY > (lineHeight * i + this.layout.pad) + 20 &&
                mouseY < (lineHeight * i + this.layout.pad) + 37
            ) {
                fill("pink");
                //Draw hovered female employee rectangle
                this.drawFemaleRect(lineY - 4, lineHeight - 2, company.female);

                // Draw opposite to hovered, male employees rectangle.
                fill('green');
                this.drawMaleRect(lineY, lineHeight + 2, company.male, company.female);

                //draw percentage text
                fill(0)
                textAlign('left', 'top');
                text('female: ' + company.female + ' %', mouseX, mouseY - 20)
            }
            //catch mouse hover over the male employees
            else if (
                mouseX > this.layout.leftMargin + this.mapPercentToWidth(company.female) &&
                mouseX < this.mapPercentToWidth(company.male) + 630
                && mouseY > lineY
                && mouseY < (lineHeight * i + this.layout.pad) + 40
            ) {
                // Draw male employees rectangle.
                fill(this.maleColour);
                this.drawMaleRect(lineY - 4, lineHeight + 2, company.male, company.female)

                // Draw female employees rectangle.
                fill(this.femaleColour);
                this.drawFemaleRect(lineY, lineHeight, company.female)

                //draw percentage text
                fill(0)
                textAlign('left', 'top');
                text('male: ' + company.male + ' %', mouseX, mouseY - 20)
            }
            else {
                // Draw female employees rectangle.
                fill(this.femaleColour);
                this.drawFemaleRect(lineY, lineHeight, company.female)

                // Draw male employees rectangle.
                fill('green');
                this.drawMaleRect(lineY, lineHeight + 2, company.male, company.female)

            }

            // Draw 50% line
            stroke(150);
            strokeWeight(1);
            line(this.midX,
                this.layout.topMargin,
                this.midX,
                this.layout.bottomMargin);
        }
    };

    this.drawCategoryLabels = function () {
        fill(0);
        noStroke();
        textAlign('left', 'top');
        text('Female',
            this.layout.leftMargin,
            this.layout.pad);
        textAlign('center', 'top');
        text('50%',
            this.midX,
            this.layout.pad);
        textAlign('right', 'top');
        text('Male',
            this.layout.rightMargin,
            this.layout.pad);
    };

    this.mapPercentToWidth = function (percent) {
        return map(percent,
            0,
            100,
            0,
            this.layout.plotWidth());
    };
}
