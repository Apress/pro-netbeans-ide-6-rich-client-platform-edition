package com.pronetbeans.examples;

public class Employee {

    private String FirstName;
    private String LastName;

    public void setFirstName(String FirstName) {

        if(FirstName!=null) {
            this.FirstName = FirstName.toUpperCase();
        } else {
            this.FirstName = null;
        }
    }

    public String getFirstName() {
        return this.FirstName;
    }

    public void setLastName(String LastName) {

        if(LastName!=null) {
            this.LastName = LastName.toUpperCase();
        } else {
            this.LastName = null;
        }
    }

    public String getLastName() {
        return this.LastName;
    }

}