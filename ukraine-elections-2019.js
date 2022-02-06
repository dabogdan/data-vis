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

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/ukraine-elections/election-ukraine-2019.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };

  this.parties = [];
  this.percentage = [];

  this.setup = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    angleMode(DEGREES);
    rectMode(BOTTOM);
    textSize(12);

    for (let i = 0; i < this.data.getRowCount(); i++) {
      this.parties.push([
        this.data.getColumn('Party')[i],
        this.data.getColumn('%_of_votes')[i],
        this.data.getColumn('Status')[i].toString(),
      ])
      this.percentage.push(this.data.getColumn('%_of_votes')[i])
      this.colors.push([Math.floor(random(0, 255)), Math.floor(random(0, 255)), Math.floor(random(0, 255))])
    }
    this.parties.sort((a, b) => this.percentage[a] - this.percentage[b])// does not work! Figure out whats the problem!
    maxData = max(this.percentage);
  }

  this.destroy = function() {
    this.parties = []
    this.percentage = []
    this.colors = []
    angleMode(RADIANS);
  };

  this.draw = function () {
    fill(100);
    noStroke();

    var divisionOfCols = (360 / this.parties.length);

    var innerCircle = 100;
    for (var i = 0; i < this.parties.length; i++) {
      push()
      textAlign('left', 'bottom');
      translate(width*0.5, height*0.5);
      rotate(180+(divisionOfCols * i));
      fill(this.colors[i])
      rect(0, innerCircle, divisionOfCols, this.parties[i][1]*3);
      rotate(90);
      if (this.parties[i][2] === "Elected") {
        text(this.parties[i][2], innerCircle - 77, 0);
      }
      text(this.parties[i][1], innerCircle-33, 0);
      fill(0)
      text(this.parties[i][0], innerCircle, 0);
      pop()
    }
  }

  // To do:
  //1. Why sort does not work?
  //2. Make animation rotation and column growth.
  //3. Add data from previous years of elections, make kind of historical, react to user on change of timeline.
  //4. Refactor use of arrays' elements - introduce local/global variables, use loops other than 'fori'
  //5. Why name of the diagram does not appear?

}
