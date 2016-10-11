
package com.pronetbeans.examples;

public class BadDebugExample {

    public static void main(String[] args)
    {
        System.out.println("1");
        Calculator calc = new Calculator();
        
        System.out.println("2");
        String results = calc.doCalculation(4);
        
        System.out.println("3");
        String results2 = calc.doCalculation(5);
        
        System.out.println("4");
        String results3 = calc.doCalculation(6);
    }
}
