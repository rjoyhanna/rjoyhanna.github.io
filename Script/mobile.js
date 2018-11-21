function openMenu() {
    var nav = document.getElementById("navbar");
    //nav.style.display = "flex"; //NEW
    setTimeout(12000);
    nav.style.top = "0px";
    document.getElementById("openMenuIcon").style.display = "none";
    document.getElementById("closeMenuIcon").style.display = "block";
}

function closeMenu() {
    var nav = document.getElementById("navbar");
    nav.style.top = "-500px";
    //nav.style.display = "none"; //NEW
    document.getElementById("closeMenuIcon").style.display = "none";
    document.getElementById("openMenuIcon").style.display = "block";
}