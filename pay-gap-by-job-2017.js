function PayGapByJob2017() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Pay gap by job: 2017';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'pay-gap-by-job-2017';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Graph properties.
    this.pad = 20;


    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function () {
        var self = this;
        this.data = loadTable(
            './data/pay-gap/occupation-hourly-pay-by-gender-2017.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function (table) {
                self.loaded = true;
            });

    };

    this.setup = function () {
    };

    this.destroy = function () {
    };

    this.draw = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Draw the axes.
        this.addAxes();

        // Get data from the table object.
        const jobs = this.data.getColumn('job_subtype');
        let propFemale = this.data.getColumn('proportion_female');
        let payGap = this.data.getColumn('pay_gap');
        let numJobs = this.data.getColumn('num_jobs');

        // Convert numerical data from strings to numbers.
        propFemale = stringsToNumbers(propFemale);
        payGap = stringsToNumbers(payGap);
        numJobs = stringsToNumbers(numJobs);

        // Set ranges for axes.
        //
        // Use full 100% for x-axis (proportion of women in roles).
        var propFemaleMin = 0;
        var propFemaleMax = 100;

        // For y-axis (pay gap) use a symmetrical axis equal to the
        // largest gap direction so that equal pay (0% pay gap) is in the
        // centre of the canvas. Above the line means men are paid
        // more. Below the line means women are paid more.
        var payGapMin = -20;
        var payGapMax = 20;

        // Find smallest and largest numbers of people across all
        // categories to scale the size of the dots.
        var numJobsMin = min(numJobs);
        var numJobsMax = max(numJobs);

        fill(255);
        stroke(0);
        strokeWeight(1);

        for (let i = 0; i < this.data.getRowCount(); i++) {
            // Draw an ellipse for each point.
            // x = propFemale
            // y = payGap
            // size = numJobs
            stroke(100);
            fill(map(numJobs[i], numJobsMin, numJobsMax, 100, 255), 0, 0, map(numJobs[i], numJobsMin, numJobsMax, 50, 200));
            // private properties to use them in the hover effect
            const x = map(propFemale[i], propFemaleMin, propFemaleMax, 0, width - this.pad);
            const y = map(payGap[i], payGapMin, payGapMax, height - this.pad, this.pad)
            const size = map(numJobs[i], numJobsMin, numJobsMax, 10, 35)
            //get the distance of the mouse
            let mouseDist = dist(x, y, mouseX, mouseY)
            //catch the mouse over the circle
            if (mouseDist <= size * 0.5) {
                //make hovered circle bigger
                ellipse(x, y, size + 10);
                //draw the text with the data
                fill(100)
                rect(mouseX, mouseY + 10, jobs[i].length * 10, 75)
                fill(255)
                textAlign(LEFT, BASELINE)
                textSize(12)
                text(jobs[i], mouseX + 10, mouseY + 30)
                text("Pay Gap: " + payGap[i].toFixed(2) + " %", mouseX + 10, mouseY + 50)
                text("Female proportion: " + propFemale[i].toFixed(2) + " %", mouseX + 10, mouseY + 70)
            } else {
                ellipse(x, y, size);
            }
        }
    };

    this.addAxes = function () {
        stroke(200);

        // Add vertical line.
        line(width / 2,
            0 + this.pad,
            width / 2,
            height - this.pad);

        // Add horizontal line.
        line(0 + this.pad,
            height / 2,
            width - this.pad,
            height / 2);
    };
}
