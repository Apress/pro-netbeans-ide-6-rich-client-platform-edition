/*
 * DebugLocalVariables.java
 *
 */

package com.pronetbeans.examples;

/**
 *
 * @author Adam Myatt
 */
public class DebugLocalVariables {

    private String country;

    public static void main(String[] args) {

       String s = "Adam was here!";
       int x = 123456789;

       DebugLocalVariables dlv = new DebugLocalVariables();
       dlv.country = "Brazil";

       System.out.println("Ending method");
    }
}
