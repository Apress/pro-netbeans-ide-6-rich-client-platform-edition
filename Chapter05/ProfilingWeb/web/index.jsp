<%@page import="com.pronetbeans.examples.*, java.util.*" contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
        <h2>Cat In The Rain</h2>
        <%
        List<ProfilePerson> allPeople = new ArrayList<ProfilePerson>();
        
        for(int i=0;i<100000;i++) {
            ProfilePerson person = new ProfilePerson();
            person.setFirstName("Adam");
            person.setLastName("Myatt");
            person.setEmail("adam AT pronetbeans DOT com");
            
            allPeople.add(person);
        }
        

        session.setAttribute("allPeople", allPeople);
        %>
    </body>
</html>
