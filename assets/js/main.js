document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        const id = section.getAttribute("id");
        fetch(`sections/${id}.html`)
            .then(response => response.text())
            .then(data => {
                section.innerHTML = data;
            })
            .catch(error => console.error(`Error loading ${id}:`, error));
    });
});
