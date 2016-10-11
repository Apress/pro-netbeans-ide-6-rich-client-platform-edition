<%@ taglib prefix="a" uri="http://jmaki/v1.0/jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">


<html>
    <head>
        <link rel="stylesheet" href="jmaki-right-sidebar.css" type="text/css"></link>
        <title>Page Title</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body>
        <div id="outerBorder">
            
            <div id="header">
                <div id="banner">Application Name</div>
                
                <div id="subheader">
                    
                    <div>
                        <a href="mailto:feedback@youraddress">Feedback</a> |
                        <a href="#">Site Map</a> |
                        <a href="#">Home</a>
                    </div>
                    
                </div> <!-- subheader -->
            </div> <!-- header -->

            <div id="main">
                
                <div id="rightSidebar">
                                     
                </div> <!-- rightSidebar -->
        
                <div id="content" style="height:400px">
                      <a:widget name="spry.accordion" args="{gradient:'green'}" value="{ items : 
    [{ label :'Books', content : 'Book content'},
     { id : 'bar', label :'Magazines', include : 'menu.jsp', lazyLoad : true},
     { label :'Newspaper', content : 'Newspaper content', selected: true}
     ]}"/>   
               
                    
                </div> <!-- content -->

            </div> <!-- main -->
      
        </div> <!-- outerborder -->
    </body>
</html>
