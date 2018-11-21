function displayNav() {
    var navbar = document.getElementsByClassName("navbar")[0];
    var navImage = document.getElementById("navImage");
    navbar.style.flexDirection="column";
    navImage.style.display="none";
    var index = document.getElementById("index");
    var about = document.getElementById("about");
    var portfolio = document.getElementById("portfolio");
    var resume = document.getElementById("resume");
    var exit = document.getElementById("navExit");
    index.style.display="block";
    about.style.display="block";
    portfolio.style.display="block";
    resume.style.display="block";
    exit.style.display="block";
}

function hideNav() {
    var navbar = document.getElementsByClassName("navbar")[0];
    var navImage = document.getElementById("navImage");
    navbar.style.flexDirection="row";
    navImage.style.display="flex";  
    
    var exit = document.getElementById("navExit");
    exit.style.display="none";   
    
    var index = document.getElementById("index");
    var about = document.getElementById("about");
    var portfolio = document.getElementById("portfolio");
    var resume = document.getElementById("resume");
    index.style.display="none";
    about.style.display="none";
    portfolio.style.display="none";
    resume.style.display="none";
    
    var active = document.getElementsByClassName("active")[0];
    active.style.display="block";
}