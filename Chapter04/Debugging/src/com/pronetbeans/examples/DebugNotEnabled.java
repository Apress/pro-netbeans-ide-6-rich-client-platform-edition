/*
 * DebugNotEnabled.java
 *
 */

package com.pronetbeans.examples;

/**
 *
 * @author Adam Myatt
 */
public class DebugNotEnabled {

    public static void main(String[] args) {

        int x = 0;

        for (int i = 0; i < args.length; i++) {
            if (i > 0) {
                System.out.println("TEST");
            }
        }
    }
}
