package com.pronetbeans.examples;

import java.io.File;

/**
 * Sample class to demonstrate debug stepping
 * @author Adam Myatt
 */
public class DebugSteppingOutExp {

    public static void main(String[] args) {

        DebugSteppingOutExp stepping = new DebugSteppingOutExp();

        File myFile = new File("d:\\java\\test.txt");

        //stepping.checkSize(myFile.length());
        
        stepping.checkSize(stepping.getValue());
        
        System.out.println("Step Over Expression");
    }

    public void checkSize(long length) {

        if (length > 0) {
            System.out.println("aaa length = " + length);
        } else {
            System.err.println("bbb uh oh");
        }
    }
    
    public long getValue() {
        return 678L;
    }
}