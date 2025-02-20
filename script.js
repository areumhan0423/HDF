document.getElementById("teamFilter").addEventListener("change", function() {
    let selected = this.value;
    let groups = document.querySelectorAll(".flow-group");

    groups.forEach(group => {
        if (selected === "all" || group.classList.contains(selected)) {
            group.classList.remove("hidden");
        } else {
            group.classList.add("hidden");
        }
    });
});
