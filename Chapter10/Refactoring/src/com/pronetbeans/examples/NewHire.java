package com.pronetbeans.examples;

public class NewHire {


    public static void main(String[] args) {

        Employee newemp = new Employee();
        newemp.setFirstName(args[0]);
        newemp.setLastName(args[1]);
        saveEmployee(newemp);
    }

    private static void saveEmployee(Employee newemp) {
        // test
    }


}