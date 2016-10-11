package com.pronetbeans.examples;

import java.util.ArrayList;

public class MoveMe {

   private String firstName;
   private String lastName;
    
    
   
   
   
   
    public static void main(String[] args) {
    
    MoveMe mymain = new MoveMe();
    mymain.doSomething("");
    
    }

    
    
    public void doSomething(String s1) {
    this.firstName = s1;
    
    ArrayList myarray = new ArrayList();
    
    firstName = "";    
    }
}
