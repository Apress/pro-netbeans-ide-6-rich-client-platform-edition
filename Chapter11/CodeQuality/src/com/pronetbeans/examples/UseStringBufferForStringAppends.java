
package com.pronetbeans.examples;

/**
 *
 * @author Adam Myatt
 */
public class UseStringBufferForStringAppends {


    public String getHtml(int numRows) {

        String returnValue = "<table>";


        for(int i=0; i < numRows; i++ ) {
            returnValue += "<tr><td>" + i + "</td><td>" + (i*i) + "</td></tr>";
        }

        return returnValue;
    }
}
