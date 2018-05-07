/* Called when the user pushes the "submit" button */
/* Sends a request to the API using the JSONp protocol */
function newRequest() {
    
    searchScreenOff();
    
    loadcssfile(); ////dynamically load and add this .css file

	var title = document.getElementById("title").value;
	title = title.trim();
	title = title.replace(" ","+");

	var author = document.getElementById("author").value;
	author = author.trim();
	author = author.replace(" ","+");

	var isbn = document.getElementById("isbn").value;
	isbn = isbn.trim();
	isbn = isbn.replace("-","");

	// Connects possible query parts with pluses
	var query = ["",title,author,isbn].reduce(fancyJoin);

	// The JSONp part.  Query is executed by appending a request for a new
	// Javascript library to the DOM.  It's URL is the URL for the query. 
	// The library returned just calls the callback function we specify, with
	// the JSON data we want as an argument. 
	if (query != "") {

		// remove old script
		var oldScript = document.getElementById("jsonpCall");
		if (oldScript != null) {
			document.body.removeChild(oldScript);
		}
		// make a new script element
		var script = document.createElement('script');

		// build up complicated request URL
		var beginning = "https://www.googleapis.com/books/v1/volumes?q="
		var callback = "&callback=handleResponse"

		script.src = beginning+query+callback	
		script.id = "jsonpCall";

		// put new script into DOM at bottom of body
		document.body.appendChild(script);	
		}

}


/* Used above, for joining possibly empty strings with pluses */
function fancyJoin(a,b) {
    if (a == "") { return b; }	
    else if (b == "") { return a; }
    else { return a+"+"+b; }
}

/* The callback function, which gets run when the API returns the result of our query */
/* Replace with your code! */
function handleResponse(bookListObj) {
    
	var bookList = bookListObj.items;

	/* where to put the data on the Web page */ 
	var bookDisplay = document.getElementById("overlay");
    
    
	var contentBox = document.getElementById("contentBox");
        
    var children = contentBox.children;
    var childLength = children.length;
    for (var i = 0; i < childLength; i++) {
        var book = children[0];
        contentBox.removeChild(book);
    }

    if (bookList==null) {
        
        var exitButton = document.getElementsByClassName("exit")[0];
        exitButton.style.display = "none";
        
        bookDisplay.style.display="flex";
        bookDisplay.style.flexDirection="column";
        bookDisplay.style.justifyContent="center";
        contentBox.style.display="flex";
        contentBox.style.flexDirection="column";
        contentBox.style.backgroundColor="transparent";

        var keepButton = document.getElementById("keep");
        if (keepButton!=undefined) {
            bookDisplay.removeChild(keepButton);
        }
        var right2 = document.getElementsByClassName("right");
        var left2 = document.getElementsByClassName("left");
        
        if (right2.length>0) {
            bookDisplay.removeChild(right2[0]);
        }
        
        if (left2.length>0) {
            bookDisplay.removeChild(left2[0]);
        }

        var message1 = document.createElement("p");
        message1.setAttribute("class","errorMessage");
        var title = document.getElementById("title").value;
        var author = document.getElementById("author").value;
        var isbn = document.getElementById("isbn").value;
        
        if (title=="") {
            title = "Title";
        }
        if (author=="") {
            author = "Author";
        }
        if (isbn=="") {
            isbn = "000-0-00-000000-0";
        }
        
        message1.textContent = "The book " + title + " by  " + author + " or ";
       contentBox.appendChild(message1);

        
        
        var message2 = document.createElement("p");
        message2.setAttribute("class","errorMessage");
        message2.textContent += "ISBN number " + isbn;
       contentBox.appendChild(message2);
        
       var message3 = document.createElement("p");
        message3.setAttribute("class","errorMessage");
        message3.textContent += "Could not be found.";
        contentBox.appendChild(message3);
        
        var message4 = document.createElement("p");
        message4.setAttribute("class","errorMessage");
        message4.textContent += "Try another search" ; 
       contentBox.appendChild(message4);
        
        var ok = document.createElement("button");
        ok.textContent="OK";
        ok.setAttribute("id","messageOk");
        ok.onclick=function() {
            off();
            contentBox.style.flexDirection="row";
            contentBox.style.backgroundColor="white";
            exitButton.style.display = "block";
        }
        contentBox.appendChild(ok);
        
    }
    else{
        bookDisplay.style.display="flex";
//        var exit = document.createElement("button");
//        exit.setAttribute("class","exit");
//        exit.textContent = "X";
//        bookDisplay.appendChild(exit);
//        exit.onclick= function() {
//            off();
//        }
//        
        ParseBook(bookList);  
    }
	/* write each title as a new paragraph */
	/*for (i=0; bookList!=null && i<bookList.length; i++) {
		var book = bookList[i];
        
		var title = book.volumeInfo.title;
		var titlePgh = document.createElement("p");
		titlePgh.textContent = title;
		contentBox.append(titlePgh);
	}	*/
}

function off() {    
    document.getElementById("overlay").style.display = "none";
}

function ParseBook(bookList, index=0) {
    var bookObj=bookList[index];
    
    var oldArrows = document.getElementsByClassName("arrow");
    
    var overlay = document.getElementById("overlay");

    
    if (oldArrows!=null) {
        var numArrows = oldArrows.length;

        for (i=0; numArrows>0 && i<numArrows;i++) {
            overlay.removeChild(oldArrows[0]);
        } 
    }
    
    var contentBox = document.getElementById("contentBox");
    
    var oldPic = contentBox.getElementsByTagName("img");
    
    if (oldPic.length!=0) {
        contentBox.removeChild(oldPic[0]);
    }
    
    var oldText = document.getElementById("contentText");
    if (oldText!=undefined) {
        contentBox.removeChild(oldText);
    }
    

    var contentText = document.createElement("div");
    contentText.setAttribute("id","contentText");
    contentText.style.display= "flex";
    contentText.style.flexDirection = "column";
    contentText.style.justifyContent = "center";

    
    
    contentBox.style.display= "flex";
    
    var oldKeep = document.getElementById("keep");
    if (oldKeep!=undefined) {
        overlay.removeChild(oldKeep);
    }
    
    var newKeep = document.createElement("button");
    newKeep.textContent="Keep";
    newKeep.setAttribute("id","keep");
    newKeep.onclick=function() {
        addBook(bookList[index]);
        off();
    }
    overlay.appendChild(newKeep);
    

    if (index>0) {
        var leftArrow = document.createElement("button");
        leftArrow.textContent= "<";
        leftArrow.setAttribute("class","left arrow");
        leftArrow.onclick=function() {
            ParseBook(bookList, index-1);
        }
        overlay.appendChild(leftArrow);
    }
    
    
    var title = bookObj.volumeInfo.title;
    var authors = bookObj.volumeInfo.authors;
    if (authors!=undefined) {
        var author = authors[0];
        var authorText = document.createElement("h5");
        authorText.textContent = "by " + author;
        contentText.appendChild(authorText);
    }
    else {
        var authorText = " ";
        var authorText = document.createElement("h5");
        contentText.appendChild(authorText);
    }
    var descript = bookObj.volumeInfo.description;
    descript = shorten(descript);
    
    
    
    var image = document.createElement("img");
    if (bookObj.volumeInfo.imageLinks == undefined) {
        image.alt = "Image not found.";
    }
    else {
        var thumbnail = bookObj.volumeInfo.imageLinks.thumbnail;
        image.src=thumbnail;
    }
    contentBox.appendChild(image);
    
    contentBox.appendChild(contentText);
    
    var titleText = document.createElement("h4");
    titleText.textContent = title;
    contentText.appendChild(titleText);
    

    
    var descriptText = document.createElement("h6");
    descriptText.textContent = descript;
    contentText.appendChild(descriptText);
    
    var lastBook = bookList.length;
    if (index<lastBook-2) {
        var rightArrow = document.createElement("button");
        rightArrow.textContent= ">";
        rightArrow.setAttribute("class","right arrow");
        /*rightArrow.height="auto";*/
        rightArrow.onclick=function() {
            ParseBook(bookList, index+1);
        }
        overlay.appendChild(rightArrow);
    }
    
}

function addBook(bookObj) {
    var bookDisplay = document.getElementById("bookDisplay");
    var currentBooks = bookDisplay.childElementCount;
    
    if (currentBooks>9) {
        alert("10 book maximum. You must delete a book before adding any new ones!");
        return;
    }
    
    var title = bookObj.volumeInfo.title;
    var author = bookObj.volumeInfo.authors[0];
    var descript = bookObj.volumeInfo.description;
    descript = shorten(descript);
    
    
    
    var image = document.createElement("img");
    if (bookObj.volumeInfo.imageLinks == undefined) {
        image.alt = "Image not found.";
    }
    else {
        var thumbnail = bookObj.volumeInfo.imageLinks.thumbnail;
        image.src=thumbnail;
    }
    
    var bookBox = document.createElement("div");
    bookBox.setAttribute("class","bookBox");
    bookDisplay.appendChild(bookBox);
    var savedBookPic = document.createElement("div");
    savedBookPic.setAttribute("class","savedBookPic");
    bookBox.appendChild(savedBookPic);
    var contentText = document.createElement("div");
    contentText.setAttribute("class","contentText");
    bookBox.appendChild(contentText);
    
    
    savedBookPic.appendChild(image);
    
    var removeBox = document.createElement("div");
    removeBox.setAttribute("class","removeBox");
    contentText.appendChild(removeBox);
    
    var remove = document.createElement("button");
    remove.textContent = "x";
    remove.setAttribute("class","remove");
    remove.onclick=function() {
        removeBook(this);
    }
    removeBox.appendChild(remove);
    
    var titleText = document.createElement("h4");
    titleText.textContent = title;
    contentText.appendChild(titleText);
    
    var authorText = document.createElement("h5");
    authorText.textContent = "by " + author;
    contentText.appendChild(authorText);
    
    var descriptText = document.createElement("h6");
    descriptText.textContent = descript;
    contentText.appendChild(descriptText);
}

function removeBook(bookX) {
    var book = bookX.parentElement.parentElement.parentElement;
    var bookDisplay = document.getElementById("bookDisplay");
    bookDisplay.removeChild(book);
}

function shorten(descript) {
    var newDescript;
    var index,space;
    if (descript == undefined) {
        return newDescript = " ";
    }
    
    for (index=0, space=0; index<descript.length && space<30;index++){
        if (descript[index] == " ") {
            space++;
        }
    }
    
    if (space<30) {
        newDescript = descript;
    }

    else {
        newDescript = descript.substr(0,index-1)+"..."
    }
    return newDescript;
}

function searchScreen() {
    var header = document.getElementsByTagName("header")[0];
    var input = document.getElementById("input");
    input.style.display="flex";
    input.style.flexDirection="column";
    header.style.flexDirection="column";
}

function searchScreenOff() {
    var header = document.getElementsByTagName("header")[0];
    var input = document.getElementById("input");
    input.style.display="none";
    headerFunc(x);
}

function deleteCssFile(){
    var oldCss = document.getElementById("splash");
    var head = document.getElementsByTagName("head")[0];
    if (oldCss!=undefined) {
        head.removeChild(oldCss);
    }
}

function loadcssfile(){
    deleteCssFile();
    var oldCss = document.getElementById("main");
    
    if (oldCss==undefined) {
        var head = document.getElementsByTagName("head")[0];
        var fileref=document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", "bookclub.css");
        fileref.setAttribute("id","main");
        head.appendChild(fileref);
    }
}

function headerFunc(x) {
    if (x.matches) {
        var searchIcon = document.getElementById("searchIcon");
        var input = document.getElementById("input");
        input.style.display="flex";
        input.style.flexDirection="row";
        searchIcon.style.display="none";
    }
}

var x = window.matchMedia("(min-width: 800px)");
x.addListener(headerFunc);