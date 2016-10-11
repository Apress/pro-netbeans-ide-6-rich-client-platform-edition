/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.pronetbeans.examples;

public class Calc {

    public int checkNum(int origVal) {

        int returnVal = 0;

        if(origVal > 10) {
            returnVal = origVal -1;
        }
        else {
            returnVal = origVal + 1;
        }

        return returnVal;
    }

public void calc() {

    int y = 2;
    int x = 0;
    int z = 0;

    z = x + y;

    if(z>3) {
        System.out.println("Z was greater than 3");
    }
    else if(y==2){
        System.out.println("x = "  + x);
    }
}


}
