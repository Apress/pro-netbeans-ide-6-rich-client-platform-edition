package com.pronetbeans.examples;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Adam Myatt
 */
public class Main {

    /**
     *
     * @param args
     */
    public static void main(String[] args) {

        List<String> results = new ArrayList<String>();
        Calculator calc = new Calculator();

        for (int i = 0; i < 10; i++) {

            results.add(calc.doCalculation(i));

        }
    }
}






