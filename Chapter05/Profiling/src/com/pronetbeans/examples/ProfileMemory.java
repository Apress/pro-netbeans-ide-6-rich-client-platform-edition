/*
 * ProfileMemory.java
 *
 */

package com.pronetbeans.examples;

import java.util.ArrayList;
import java.util.List;

public class ProfileMemory {

    public static void main(String[] args) {

        List<ProfilePerson> allPeople = new ArrayList<ProfilePerson>();

        for(int i=0;i<1000000;i++) {
            ProfilePerson person = new ProfilePerson();
            person.setFirstName("Adam");
            person.setLastName("Myatt");
            person.setEmail("adam AT pronetbeans DOT com");

            allPeople.add(person);
        }

        System.out.println("Number of people = " + allPeople.size());

    }
}
