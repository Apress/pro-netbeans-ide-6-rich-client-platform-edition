package com.pronetbeans.examples;

/**
 * Sample class to demonstrate debug stepping
 * @author Adam Myatt
 */
public class DebugStepping {

    public static void main(String[] args) {
        System.out.println("Step A");
        DebugStepping stepping = new DebugStepping();
    }

    public DebugStepping() {
        System.out.println("Step B");
    }
    
}