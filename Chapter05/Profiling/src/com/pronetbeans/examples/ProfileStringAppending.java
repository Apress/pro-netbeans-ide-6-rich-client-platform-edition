/*
 * ProfileStringAppending.java
 *
 */

package com.pronetbeans.examples;

import java.util.ArrayList;

/**
 *
 * @author Adam Myatt
 */
public class ProfileStringAppending {

    private String firstName;

    public static void main(String[] args) {

        ProfileStringAppending psa = new ProfileStringAppending();

        String dataResults = psa.getCustomersByCountry(1234);

       // String dataResults4 = psa.getCustomersByCountry(1234);

        String dataResults2 = psa.getCustomersByCountry2(1234);

       // String dataResult3 = psa.getCustomersByCountry3(1234);

        System.out.println("ProfileStringAppending done");
    }

    public String getCustomersByCountry(int countryId) {

        String results = "";

        // assume this is simply a list of customer names
        ArrayList<String> customers = getCustomers(countryId);

        for (int i = 0; i < customers.size(); i++) {
            results += "<tr><td width=300>";
            results += customers.get(i);
            results += "</td></tr>";
        }

        return results;
    }

    public String getCustomersByCountry2(int countryId) {

        StringBuffer results = new StringBuffer();

        // assume this is simply a list of customer names
        ArrayList<String> customers = getCustomers(countryId);

        for (int i = 0; i < customers.size(); i++) {
            results.append("<tr><td width=300>");
            results.append(customers.get(i));
            results.append("</td></tr>");
        }

        return results.toString();
    }

    public String getCustomersByCountry3(int countryId) {

        StringBuffer results = new StringBuffer();

        // assume this is simply a list of customer names
        ArrayList<String> customers = getCustomers(countryId);

        for (int i = 0; i < customers.size(); i++) {
            results.append("<tr><td width=300>");
            results.append(customers.get(i));
            results.append("</td></tr>");
        }

        return results.toString();
    }

    private ArrayList<String> getCustomers(int countryId) {

        //connect to database, generate customer list
        ArrayList<String> mylist = new ArrayList<String>();
        // let's fake a list
        for(int i=0; i<2000; i++) {
            mylist.add("John Smith " + i);
        }

        return mylist;
    }
}