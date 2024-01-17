function handleTakeQwiz() {
    const name = document.getElementById("name").value;
    location.href = `./player/player.html?n=${name}`;
}