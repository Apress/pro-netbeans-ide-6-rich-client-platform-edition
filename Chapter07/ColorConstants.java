
package com.pronetbeans.chapters;


/**
* Utility class for representing static constant color values.
* The color constants used in this class are string representations
* of HTML color codes.
*
* @author John Doe<br>john.doe@somesite.com<br>John Doe Consulting
* @author Jane Doe
* @version 1.45
* @since 2.1.0
* @see com.pronetbeans.chapters
*/

public class ColorConstants {

    /** The HTML code for the color blue. */
    public static final String BLUE = "#0000FF";

    /** The HTML code for the color red. */
    public static final String RED = "#FF0000";

    /** Default constructor */
    public ColorContstants() {
    }

    /** This constructor allows the debug mode to be enabled or disabled.
    *
    * @param debug true if logging should be enabled, false otherwise.
    */
    public ColorConstants(boolean debug) {
        // do something with the debug variable
    }


    /**
    * Retrieve a list of all color code constants.
    *
    * @param filter A filter value to retrieve color codes that match.
    * @return An ArrayList of the color code values.
    * @throws NullPointerException If the filter parameter is null.
    */
    public ArrayList listColorCodes(String filter)
        throws NullPointerException, NumberFormatException {

        // do something
    }

}