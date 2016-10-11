
package com.pronetbeans.examples.struts.actions;

import javax.servlet.http.HttpServletRequest;
import org.apache.struts.action.ActionErrors;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.ActionMessage;

/**
 *
 * @author Adam Myatt
 */
public class MenuActionForm extends org.apache.struts.action.ActionForm {

   private String name;

   private int number;

   /**
    * @return
    */
   public String getName() {
       return name;
   }

   /**
    * @param string
    */
   public void setName(String string) {
       name = string;
   }

   /**
    * @return
    */
   public int getNumber() {
       return number;
   }

   /**
    * @param i
    */
   public void setNumber(int i) {
       number = i;
   }

   /**
    *
    */
   public MenuActionForm() {
       super();
       // TODO Auto-generated constructor stub
   }

   public ActionErrors validate(ActionMapping mapping, HttpServletRequest request) {
       ActionErrors errors = new ActionErrors();
       if (getName() == null || getName().length() < 1) {
           errors.add("name", new ActionMessage("error.name.required"));
           // TODO: add 'error.name.required' key to your resources
       }
       return errors;
   }
}
