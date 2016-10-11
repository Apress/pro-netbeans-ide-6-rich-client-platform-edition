
package com.pronetbeans.examples;

public class Factory {

   public void makeStandardItem(int type) {
        if(type==0) {
            // make extremely unusual item .01% of the time
            Item myitem = new Item() {
                public void assemble() {
                    System.out.println("anonymous Item.assemble");
                }
            };

            myitem.assemble();
        } else {
            // make standard item 99.9% of the time
            Item myitem = new Item();
            myitem.assemble();
        }
    }


    public void processArray(String[] names)
    {
        ConvertArrayToUpper(names);
        // other method code here
    }

    private void ConvertArrayToUpper(final String[] names)
    {
        for(int i=0;i < names.length; i++)
        {
            names[i] = names[i].toUpperCase();
        }
    }

}
