function UkraineElections2019() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'General Elections 2019 in Ukraine by Political Parties';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'ukraine-elections-2019';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Title to display above the plot.
    this.title = 'General Elections 2019 in Ukraine by Political Parties';

    //Array to store later the random colors for different lines
    this.colors = [];

    //arrays to store the information from .csv file
    this.parties = [];
    this.percentage = [];
    this.years = [];

    // set initial rectangle height to 0
    let rectCurrentHeight = 0;

    // set initial angle of rotation to 0
    let a = 0;

    //set the diameter of the circe where the rectangles will be drawn around
    let innerCircle = 0;
    let dataToDisplay = [];

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function () {
        const self = this;
        this.data = loadTable(
            './data/ukraine-elections/election-ukraine-2019.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function (table) {
                self.loaded = true;
            }
        );

    };

    this.setup = function () {
        const self = this;
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        const rowsCount = this.data.getRowCount();
        // const numColumns = this.data.getColumnCount();

        for (let i = 0; i < rowsCount; i++) {
            //traverse through the data and get the rows, storing them into array
            this.parties.push([
                this.data.getColumn('Party')[i],
                this.data.getColumn('%_of_votes')[i],
                this.data.getColumn('Status')[i].toString(),
                this.data.getColumn('Year')[i]
            ])
            //storing array of percentage
            this.percentage.push(this.data.getColumn('%_of_votes')[i])

            this.years.push(this.data.getColumn('Year')[i]);

            //random colors
            this.colors.push([Math.floor(random(0, 255)), Math.floor(random(0, 255)), Math.floor(random(0, 255))])
        }
        //sort the 'parties' array according to the '%_of_votes'
        this.parties.sort((a, b) => {
            return Number(b[1]) - Number(a[1]);
        })

        //"Set" allows to store only unique data in the object, this is to make an array of unique years. "Array.from()" is to make an array
        this.years = Array.from(new Set(this.years))

        const changeYear = (e) => {
            //height to zero to perform animation from the scratch
            rectCurrentHeight = 0;
            //make array of data corresponding to the chosen year out of array of parties
            dataToDisplay = this.parties.filter((row) => {
                return row[3] === e;
            })
        }
        //div to contain the buttons an apply styles
        this.buttonsDiv = createDiv("Choose the year: ")
        this.buttonsDiv.id("buttons");

        //div to display the current year
        this.currentYearDiv = createDiv();
        this.currentYearDiv.id("current-year");
        //creating the buttons for each year
        this.years.forEach((e) => {
            this.button = createButton(e);
            this.button.parent(this.buttonsDiv);
            this.button.mousePressed(() => {
                changeYear(e);
                //create "div" to put the buttons into it
                this.currentYearDiv.html("Current year: " + e)
            })
        })
    }
    // reset everything
    this.destroy = function () {
        this.percentage.length = 0;
        this.colors.length = 0;
        angleMode(RADIANS);
        this.parties.length = 0;
        this.years.length = 0;
        rectCurrentHeight = 0;
        a = 0;
        innerCircle = 0;
        this.buttonsDiv.remove();
        this.currentYearDiv.remove();
    };

    this.draw = function () {
        fill(100);
        noStroke();
        //spread the columns around 360 degrees
        const divisionOfCols = (360 / dataToDisplay.length);

        //method for animation, that adds to the rect height until it reaches the maximum value
        this.animate = function (percentage, index) {
            //animation of rotation
            a < 180 ? a += .05 : a = 180;
            //animation of inner circle enlargement
            innerCircle < 120 ? innerCircle += 0.03 : innerCircle = 120;
            //animation of columns growth
            if (a > 179) {
                if (rectCurrentHeight < percentage) {
                    return rectCurrentHeight += index;
                } else if (rectCurrentHeight >= percentage) {
                    return percentage;
                }
            }
        }

        //settings
        angleMode(DEGREES);
        rectMode(BOTTOM);
        textSize(12);

        for (let i = 0; i < dataToDisplay.length; i++) {
            let percentageOfVotes = dataToDisplay[i][1];
            // drawing the diagram
            push()
            textAlign('left', 'bottom');
            //centre of the diagram - to the middle of the screen
            translate(width * 0.5, height * 0.5 + 90);
            //move the columns around, correcting it so that the biggest rectangle is at the top
            rotate(a + (divisionOfCols * i));
            // filling them with the accordingly colors
            fill(this.colors[i])
            //drawing the rectangles - the height is animated, method receives the percentage parameter as a maximum value
            rect(0, innerCircle, divisionOfCols, parseFloat(this.animate(percentageOfVotes, 0)).toFixed(2) * 5);
            // correcting the position of the texts
            rotate(90);
            //drawing the word 'Elected' in the inner circle, where the party was elected
            if (dataToDisplay[i][2] === "Elected") {
                text(this.parties[i][2], innerCircle - 77, 0);
            }
            // Drawing the percentage of votes
            text(parseFloat(this.animate(percentageOfVotes, 0.03)).toFixed(2), innerCircle - 33, 0);
            fill(0)
            //text "Elected"
            text(dataToDisplay[i][0], innerCircle, 0);
            pop()
        }
    }

    // To do:
    //1. Why sort does not work?
    // DONE
    //2. Make animation rotation and column growth. + inner circle enlargement animation
    // DONE
    //3. Add data from previous years of elections, make kind of historical, react to user on change of timeline.
    // DONE
    //4. Refactor use of arrays' elements - introduce local/global variables, use loops other than 'fori'
    //DONE as much as possible
    //5. Why name of the diagram does not appear?

}
