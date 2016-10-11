package com.pronetbeans.examples;

/**
 * Sample class to demonstrate debug stepping
 * @author Adam Myatt
 */
public class DebugSteppingOut {

    public static void main(String[] args) {
        System.out.println("Step A");
        DebugSteppingOut stepping = new DebugSteppingOut();
        
        stepping.doSomething();
        
        System.out.println("Step B");
    }

    public DebugSteppingOut() {
        System.out.println("Constructor Running");
    }
    
    public void doSomething() {
        int x = 0;
        int y = 0;
        int z = 0;
        int total = 0;
        
        total = x + y + z;
        
        System.out.println("Total = " + total);
    }
}