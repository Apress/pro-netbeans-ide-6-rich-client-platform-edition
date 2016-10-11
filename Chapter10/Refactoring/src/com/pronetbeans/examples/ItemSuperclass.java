
package com.pronetbeans.examples;

public abstract class ItemSuperclass implements ItemInterface {

    public void assemble() {
        System.out.println("Item.assemble");
    }

    public abstract void sell();
}
