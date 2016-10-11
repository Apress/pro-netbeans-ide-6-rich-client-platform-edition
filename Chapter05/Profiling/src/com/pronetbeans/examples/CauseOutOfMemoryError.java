/*
 * CauseOutOfMemoryError.java
 *
 */

package com.pronetbeans.examples;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Adam Myatt
 */
public class CauseOutOfMemoryError {

    private int count;

    public void setCount(int count) {
        this.count = count;
    }

    public static void main(String[] args) {

        List myList = new ArrayList();
        int total = 20000000;

        for(int i=0;i<total;i++) {
            CauseOutOfMemoryError calc = new CauseOutOfMemoryError();
            calc.setCount(i);
            myList.add(calc);
        }
    }
}
