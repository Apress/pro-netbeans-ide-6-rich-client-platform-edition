package com.pronetbeans.examples;

/**
 * Sample class to demonstrate debug stepping
 * @author Adam Myatt
 */
public class DebugRunIntoMethod {

    public static void main(String[] args) {

        DebugRunIntoMethod stepping = new DebugRunIntoMethod();
      
        stepping.printStatement(stepping.getLogMessage());
        
        System.out.println("Run Into Method finishing.");
    }

    public void printStatement(String logMessage) {
        // save logMessage to database
        
        // print to standard output for brevity
        System.out.println("logMessage = " + logMessage);
    }
    
    public String getLogMessage() {
        return "Adam Myatt was here";
    }
}