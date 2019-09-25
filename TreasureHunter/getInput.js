function saveData() {
    lines = parseInt(document.getElementById('lines').value);
    cols = parseInt(document.getElementById('cols').value);
    myMaze = document.getElementById('maze').value.split('\n');
    localStorage.setItem("lines", lines);
    localStorage.setItem("cols", cols);
    localStorage.setItem("maze", myMaze);
}
