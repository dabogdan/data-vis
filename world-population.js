function WorldPopulation() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'World Population Map';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'world-population';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Title to display above the plot.
    this.title = 'World Population map';

    //global variables for the map
    let worldMap;
    let mapCanvas;

    let countryFigures;
    let svgCountryTitle;
    let countryTextSelector;
    //variables to handle slider
    let slider;
    //set initial value to 1970
    let inputValue = '1970';
    //array of years corresponding to the data columns
    const yearsArray = ['1970', '1980', '1990', '2000', '2010', '2015', '2019', '2020', '2021', '2030', '2050'];
    let currentYear;
    //function drawing current year according to the user input
    this.drawYear = function (year) {
        currentYear = createElement('div', year);
        currentYear.position(320, 30);
        currentYear.class('year');
    };
    //function drawing the current country and its population data on hover
    this.drawTxtOnMouseOver = function (svgCountryTitle, countryNames, currentPopulation) {
        //draw the text with the country name
        countryText = createElement('p', svgCountryTitle.toUpperCase());
        countryText.class('countryText');
        countryText.position(mouseX, mouseY + 20);
        for (let i = 0; i < countryNames.length; i++) {
            if (countryNames[i].toLowerCase() === svgCountryTitle.toLowerCase()) {
                let populationText = this.numberWithCommas(Math.floor(currentPopulation[i] * 1000));
                countryFigures = createElement('p', populationText);
                console.log(countryFigures);
                countryFigures.class('countryText');
                countryFigures.position(mouseX, mouseY + 40);
            }
        }
    }
    //produce number with commas to make them more readable.
    // Taken from here https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    this.numberWithCommas = function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function () {
        var self = this;
        this.data = loadTable(
            './data/world-mortality/world-population.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function (table) {
                self.loaded = true;
            });
        //createGraphics with p5-svg library. The library itself was adjusted too, because it drew the canvas,
        // however, it can produce unpredictable behavious to call createCanvas several times
        // per documentation https://p5js.org/reference/#/p5/createCanvas
        const app = document.getElementById('app');
        mapCanvas = createGraphics(1024, 576, SVG);
        mapCanvas.id('mapCanvas')
        app.appendChild(document.getElementById('mapCanvas'))
        worldMap = loadSVG('./assets/world.svg')
    };

    this.setup = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        //calling function to draw the current year
        this.drawYear(inputValue)
        //make canvas invisible to exclude any unpredictable behavious
        const canvas = document.getElementById('canvas');
        canvas.style.display = 'none';
        //making p5.Graphics with SVG visible
        mapCanvas.style('display', 'block')
        mapCanvas.image(worldMap, 0, 0, mapCanvas.windowWidth, mapCanvas.windowWidth);

        //getting the population according to the input value and the array of all country names
        const currentPopulation = this.data.getColumn(inputValue);
        const countryNames = this.data.getColumn('name');

        //traverse through all of the SVG 'paths'
        document.querySelectorAll('path').forEach((e) => {
            //set colors for different population ranges
            svgCountryTitle = e.getAttribute('title').toLowerCase();
            for (let j = 0; j < currentPopulation.length; j++) {
                if (
                    countryNames[j].toLowerCase() === svgCountryTitle &&
                    parseInt(currentPopulation[j]) > 150000
                ) {
                    e.style.fill = 'rgb(50,50,150)';
                } else if (
                    countryNames[j].toLowerCase() === svgCountryTitle &&
                    parseInt(currentPopulation[j]) > 50000 &&
                    parseInt(currentPopulation[j]) < 150000
                ) {
                    e.style.fill = 'rgb(0,100,100)';
                } else if (
                    countryNames[j].toLowerCase() === svgCountryTitle &&
                    parseInt(currentPopulation[j]) > 10000 &&
                    parseInt(currentPopulation[j]) < 50000
                ) {
                    e.style.fill = 'rgb(100,100,255)';
                } else if (
                    countryNames[j].toLowerCase() === svgCountryTitle &&
                    parseInt(currentPopulation[j]) > 5000 &&
                    parseInt(currentPopulation[j]) < 10000
                ) {
                    e.style.fill = 'rgb(50,150,50)';
                } else if (
                    countryNames[j].toLowerCase() === svgCountryTitle &&
                    parseInt(currentPopulation[j]) > 1000 &&
                    parseInt(currentPopulation[j]) < 5000
                ) {
                    e.style.fill = 'rgb(150,250,50)';
                } else if (
                    countryNames[j].toLowerCase() === svgCountryTitle &&
                    parseInt(currentPopulation[j]) < 1000
                ) {
                    e.style.fill = 'rgb(222, 235, 247)';
                }
            }

            //event listeners for mouse hover event
            e.addEventListener('mouseenter', () => {
                //add class to the hovered element with the red border
                e.classList.add('hovered')
                // call draw text function
                this.drawTxtOnMouseOver(e.getAttribute('title'), countryNames, currentPopulation);
                //selector to style it and remove later
                countryTextSelector = document.querySelectorAll('.countryText');
                //make it red
                countryTextSelector.forEach((el) => {
                    el.style.color = 'darkred';
                })
            })
            e.addEventListener('mouseleave', () => {
                //remove red border of hovered country and remove DOM element of text
                e.classList.remove('hovered');
                countryTextSelector.forEach(el => el.remove());
            })
        })
    }
    //restore all 'troubles' caused to canvas by these SVG manipulations
    this.destroy = function () {
        clear();
        mapCanvas.clear();
        canvas.style.display = 'block';
        mapCanvas.style('display', 'none')
        slider.remove();
        currentYear.remove();
    };

    this.draw = function () {
        clear();
        //slider to handle use input
        slider = createSlider(0, 10, 0, 1);
        slider.id('slider');
        slider.position(320, 600);
        //when slider changes - event handler gets the year and redraws the canvas with new values
        document.getElementById('slider').addEventListener('input', () => {
            inputValue = yearsArray[slider.value()]
            mapCanvas.clear()
            currentYear.remove();
            this.setup()
        })
        //there is no need to loop, because no need to load the browser.
        // SVG is very easy to interact with without the loop
        noLoop();
    }
}

// ToDo:
// 1. Create legend of the map with colors of population breakdown
// 2. Consider making rectangle on hover, so that the country info is more readable
// 3. Add flags of the countries
// 4. Adjust colors of the countries from light to dark according to the population figures
// 5. make 3D???