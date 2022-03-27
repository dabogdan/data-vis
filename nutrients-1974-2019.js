function NutrientsTimeSeries() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Nutrients: 1974-2019';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'nutrients-timeseries';

    // Title to display above the plot.
    this.title = 'Gender Pay Gap: Average difference between male and female pay.';

    //Array to store later the random colors for different lines
    this.colors = [];

    // Names for each axis.
    this.xAxisLabel = 'year';
    this.yAxisLabel = '%';

    let marginSize = 35;

    // Layout object to store all common plot layout parameters and
    // methods.
    this.layout = {
        marginSize: marginSize,

        // Margin positions around the plot. Left and bottom have double
        // margin size to make space for axis and tick labels on the canvas.
        leftMargin: marginSize * 2,
        rightMargin: width - marginSize,
        topMargin: marginSize,
        bottomMargin: height - marginSize * 2,
        pad: 5,

        plotWidth: function () {
            return this.rightMargin - this.leftMargin;
        },

        plotHeight: function () {
            return this.bottomMargin - this.topMargin;
        },

        // Boolean to enable/disable background grid.
        grid: true,

        // Number of axis tick labels to draw so that they are not drawn on
        // top of one another.
        numXTickLabels: 10,
        numYTickLabels: 8,
    };

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function () {
        let self = this;
        this.data = loadTable(
            './data/food/nutrients-1974-2019.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function (table) {
                self.loaded = true;
            });

    };

    this.setup = function () {
        // Font defaults.
        textSize(16);
        // Set min and max years: assumes data is sorted by date.
        this.startYear = Number(this.data.columns[1]);
        this.endYear = Number(this.data.columns[this.data.columns.length - 1]);

        for (let i = 0; i < this.data.getRowCount(); i++) {
            this.colors.push(color(random(0, 255), random(0, 255), random(0, 255)));
        }

        // Find min and max pay gap for mapping to canvas height.
        this.minPercentage = 80;         // Pay equality (zero pay gap).
        this.maxPercentage = 400;
    };

    this.destroy = function () {
        this.colors.length = 0;
    };

    this.draw = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Draw the title above the plot.
        this.drawTitle();

        // Draw all y-axis labels.
        drawYAxisTickLabels(this.minPercentage,
            this.maxPercentage,
            this.layout,
            this.mapPayGapToHeight.bind(this),
            0);

        // Draw x and y axis.
        drawAxis(this.layout);

        // Draw x and y axis labels.
        drawAxisLabels(this.xAxisLabel,
            this.yAxisLabel,
            this.layout);

        // Plot all pay gaps between startYear and endYear using the width
        // of the canvas minus margins.
        const numYears = this.endYear - this.startYear;

        // Loop over all rows and draw a line from the previous value to
        // the current.
        for (let i = 0; i < this.data.getRowCount(); i++) {
            let previous = null;
            let row = this.data.getRow(i);
            let l = row.getString(0)
            for (let j = 1; j < numYears; j++) {
                // Create an object to store data for the current year.
                let current = {
                    // Convert strings to numbers.
                    'year': this.startYear + j - 1,
                    'percentage': row.getNum(j),
                };

                noStroke();
                fill(this.colors[i]);
                let textX = width - 200;
                let textY = 80 + (i * 25);
                text(l, textX, textY)
                // const mouseDist = dist(textX, textY, mouseX, mouseY)
                let labelWidth = textWidth(l);
                //catch mouse hover over the texts
                if ((mouseX > textX - (labelWidth * 0.5)) &&
                    (mouseX < textX + labelWidth * 0.5) &&
                    (mouseY > textY - 8) &&
                    (mouseY < textY + 8)
                    && previous != null){
                    //make text black on hover
                    fill(0);
                    noStroke();
                    text(l, textX, textY);
                    //make the curve stroke with bigger on hover
                    strokeWeight(5);
                    stroke(this.colors[i]);
                    line(this.mapYearToWidth(previous.year),
                        this.mapPayGapToHeight(previous.percentage),
                        this.mapYearToWidth(current.year),
                        this.mapPayGapToHeight(current.percentage));
                    //restore stroke, because otherwise it intervenes with the other properties
                    strokeWeight(1);
                }

                else if (previous != null) {
                    // Draw line segment connecting previous year to current
                    // year pay gap.
                    stroke(this.colors[i]);
                    // strokeWeight(1);
                    line(this.mapYearToWidth(previous.year),
                        this.mapPayGapToHeight(previous.percentage),
                        this.mapYearToWidth(current.year),
                        this.mapPayGapToHeight(current.percentage));

                    // The number of x-axis labels to skip so that only
                    // numXTickLabels are drawn.
                    let xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

                    // Draw the tick label marking the start of the previous year.
                    if (j % xLabelSkip === 0) {
                        drawXAxisTickLabel(
                            previous.year,
                            this.layout,
                            this.mapYearToWidth.bind(this));
                    }
                }
                // Assign current year to previous year so that it is available
                // during the next iteration of this loop to give us the start
                // position of the next line segment.
                previous = current;
            }
        }
    };

    this.drawTitle = function () {
        fill(0);
        noStroke();
        textAlign('center', 'center');

        text(this.title,
            (this.layout.plotWidth() / 2) + this.layout.leftMargin,
            this.layout.topMargin - (this.layout.marginSize / 2));
    };

    this.mapYearToWidth = function (value) {
        return map(value,
            this.startYear,
            this.endYear,
            this.layout.leftMargin,   // Draw left-to-right from margin.
            this.layout.rightMargin);
    };

    this.mapPayGapToHeight = function (value) {
        return map(value,
            this.minPercentage,
            this.maxPercentage,
            this.layout.bottomMargin,
            this.layout.topMargin);
    };
}
