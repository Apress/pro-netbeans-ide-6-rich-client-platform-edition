
package com.pronetbeans.examples.services;

/**
 *
 * @author Adam Myatt
 */
public class Customer {

    private long Id;
    private String FirstName;
    private String LastName;

    public Customer() {}

    public long getId() {
        return Id;
    }

    public void setId(long Id) {
        this.Id = Id;
    }

    public String getFirstName() {
        return FirstName;
    }

    public void setFirstName(String FirstName) {
        this.FirstName = FirstName;
    }

    public String getLastName() {
        return LastName;
    }

    public void setLastName(String LastName) {
        this.LastName = LastName;
    }


}
