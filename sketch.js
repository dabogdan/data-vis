// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
let gallery;

function setup() {
    // Create a canvas to fill the content div from index.html.
    let c = createCanvas(1024, 576);
    c.parent('app');
    c.id('canvas')

    // Create a new gallery object.
    gallery = new Gallery();

    // Add the visualisation objects here.
    gallery.addVisual(new TechDiversityRace());
    gallery.addVisual(new TechDiversityGender());
    gallery.addVisual(new PayGapByJob2017());
    gallery.addVisual(new NutrientsTimeSeries());
    gallery.addVisual(new UkraineElections2019());
    gallery.addVisual(new WorldPopulation());
}

function draw() {
    background(255);
    if (gallery.selectedVisual != null) {
        gallery.selectedVisual.draw();
    }
}