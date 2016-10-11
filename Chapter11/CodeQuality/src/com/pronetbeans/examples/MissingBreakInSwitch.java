
package com.pronetbeans.examples;

/**
 *
 * @author Adam Myatt
 */
public class MissingBreakInSwitch {


    public void demoSwitch(int x) {

        switch(x) {

            case 0:
                System.out.println("x is 0");
            case 1:
                System.out.println("x is 1");
            default:
                System.out.println("x is default");
        }
    }
}
