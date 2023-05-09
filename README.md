## How to build and run
The project is implemented as a static web page.
It runs inside a browser and standard HTML interface elements are used for interaction.
Use the `run.sh` script to build and run the project.
The script is composed of functions that can be invoked with `./run.sh <function>`.

By running `./run.sh serve` project will be built in development mode, served on localhost and can be accessed by pointing a browser to one of the displayed URLs (usually `http://127.0.0.1:8000/`).
Program input should be entered in the "Input" box and, after the "Submit" button is clicked the receipt will be displayed in the "Output" box.

Tests which include provided example inputs can be run with `./run.sh tests`.

## Assumptions
- The project will be run in a fairly modern browser that supports JavaScript modules.
- Imported goods are denoted by having work "imported" in their description.
- Item price is contained after the work "at" in an input line.
- Empty input lines are ignored.
- If an input line doesn't contain an integer representation as the first token or the word "at" followed by a float with 2 decimal spaces representation it is considered invalid.
- Invalid lines will be marked as such on the receipt and ignored when calculating total and tax amounts.
- Item type is denoted by the presence of a particular keyword in its description.
- If item type can not be determined the line is considered invalid.
- One cent accuracy for calculations is adequate.
- This is a coding assignment so very little to no effort has been put into page visual design or accessibility.
