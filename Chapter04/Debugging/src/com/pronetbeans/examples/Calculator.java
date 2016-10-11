/*
 * Calculator.java
 *
 */

package com.pronetbeans.examples;

import java.util.ArrayList;
import java.util.List;

/**
 * My calculator class.
 * @author Adam Myatt
 */
public class Calculator {

    private int globalInt;

    public static void main(String[] args) {

        List<String> results = new ArrayList<String>();
        Calculator calc = new Calculator();

        for (int i = 0; i < 10; i++) {
            results.add(calc.doCalculation(i));
        }
        // do something with ArrayList
    }

    public String doCalculation(int x) {

        globalInt = 99;
        // do calculation with x
        return x+"";
    }
}
