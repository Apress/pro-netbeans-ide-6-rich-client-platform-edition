
package com.pronetbeans.examples;

public class ConvertArray {

    public void processArray(String[] names) {
        ConvertArrayToUpper(names);
    }

    private void ConvertArrayToUpper(String[] names) {
        int i;
        for (int i = 0; i < names.length; i++) {
            names[i] = names[i].toUpperCase();
        }
    }
}