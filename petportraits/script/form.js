function addPhoto() {
    var fileUploads = document.getElementById("fileUploads");
    var numFiles = fileUploads.childElementCount;
    var newNum = ((numFiles-1)/2)+1;
    var chooseFileNum = document.createElement("span");
    chooseFileNum.textContent = "<br>" + newNum + ".)";
    fileUploads.appendChild(chooseFileNum);
}