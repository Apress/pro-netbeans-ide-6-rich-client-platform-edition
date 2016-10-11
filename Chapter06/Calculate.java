package com.pronetbeasn.examples;

/**
* @author Adam Myatt
*/
public class Calculate {

	public Calculate() {
    }

    public int checkNum(int origVal) {

		int returnVal = 0;

		if (origVal > 10) {
			returnVal = origVal - 1;
		else {
			returnVal = origVal + 1;
    	}

    	return returnVal;
    }

    public static void main(String[] args) {
		System.out.println("Hello Calculator");
	}
}