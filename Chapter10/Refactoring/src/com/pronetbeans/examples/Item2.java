
package com.pronetbeans.examples;

public class Item2 extends ItemSuperclass {

    public void sell() {
        System.out.println("sell me");

        System.out.println("Price(12345) : " + findPrice(12345));
    }

    public double findPrice(long itemNumber) {

        double price = 0.00;
        // look up itemNumber in database and set price variable
        return price;
    }
}

