package com.pronetbeans.examples;

public class BadClass {

    
    private String firstName;

    
    public BadClass() {

        int x = 0;
        int y = 1;
        int z = 2;
        int outputNum = 0;

        if (x < y) {
//            System.out.println("X is less than Y");
            if (x == 0) {
                outputNum = 9;
            } else if (x == 1) {
                x += 463;
            } else if (x == 2) {
                x += x;
            }
        } else if (x < z) {
            z += y;
        }
    }
}
