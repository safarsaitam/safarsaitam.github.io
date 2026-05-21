const numberOfTexts = 6;

const textContainer = document.createElement("div");
textContainer.className = "text-container";
document.body.appendChild(textContainer);

async function renderText(path, isLastText) {
    const response = await fetch(path);
    const text = await response.text();

    const lines = text.split("\n");

    lines.forEach((line, index) => {

        // First line becomes <h3>
        if (index === 0) {
            const h3 = document.createElement("h3");
            h3.textContent = line;
            textContainer.appendChild(h3);
            return;
        }

        // Blank line becomes <br>
        // except for the first empty line after the title
        if (line.trim() === "") {

            // Ignore first empty line after title
            if (index === 1) {
                return;
            }

            textContainer.appendChild(document.createElement("br"));
            return;
        }

        // Normal line becomes <p>
        const p = document.createElement("p");
        p.textContent = line;
        textContainer.appendChild(p);
    });

    // Add <hr> except for the bottom text
    if (!isLastText) {
        textContainer.appendChild(document.createElement("hr"));
    }
}

async function renderAllTexts() {

    // Reverse order:
    // text-4 -> top
    // text-1 -> bottom
    for (let i = numberOfTexts; i >= 1; i--) {

        const isLastText = i === 1;

        await renderText(
            `texts/text-${i}.txt`,
            isLastText
        );
    }
}

renderAllTexts();

const closeButton = document.getElementById("close-contact-box");
const contactBox = document.getElementById("contact-box");

closeButton.addEventListener("click", () => {
    contactBox.style.display = "none";
});