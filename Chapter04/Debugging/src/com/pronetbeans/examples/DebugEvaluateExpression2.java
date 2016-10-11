package com.pronetbeans.examples;

import java.io.File;

/**
 * Sample class to demonstrate debug stepping
 * @author Adam Myatt
 */
public class DebugEvaluateExpression2 {

    public static void main(String[] args) {

        DebugEvaluateExpression2 stepping = new DebugEvaluateExpression2();

        int id = 9;
        
        String personName = stepping.getNameById(id);
    }

    public String getNameById(int i) {
        
        String results = "";
        
        if(i > 5) {
            results = "Jones";
        } else {
            results = "Smith";
        }
        
        return results;
    }

}