function saveData() {
    lines = parseInt(document.getElementById('lines').value);
    cols = parseInt(document.getElementById('cols').value);
    myMaze = document.getElementById('maze').value;
    localStorage.clear();
    localStorage.setItem("lines", lines);
    localStorage.setItem("cols", cols);
    localStorage.setItem("maze", myMaze);
    window.open('treasureHunter.html')
}
