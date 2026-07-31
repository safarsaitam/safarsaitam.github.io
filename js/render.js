const numberOfTexts = 7;

let currentLang = ""

const translations = {
    pt: {
        "site-description":
            "Pensamentos e desabafos contraditórios de alguém mais do que ninguém que só deseja o bem.",

        "contact-question":
            "Queres saber quando se deu a última dissonância?",

        "email-placeholder":
            "Inserir e-mail",

        "submit-button":
            "Enviar",

        "contact-invitation":
            "Queres ser humano comigo?",

        "video-description":
            "Filmado em: \"NS-DOK\", Colónia; Mercado de Natal, Colónia.",
    },

    en: {
        "site-description":
            "Contradictory thoughts and feelings from someone above no one who wishes but the good.",

        "contact-question":
            "Wish to be aware of the latest dissonance?",

        "email-placeholder":
            "Enter email",

        "submit-button":
            "Send",

        "contact-invitation":
            "Would you like to be human with me?",

        "video-description":
            "Filmed at: \"NS-DOK\", Cologne; Christmas Market, Cologne",
    }
};

const mediaBaseUrl =
    "https://pub-fabb2090c4e94a9190b098a88eb43d8e.r2.dev";

function renderVideo(entry, isLastEntry) {
    const videoSection = document.createElement("section");
    videoSection.className = "video-entry";

    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";

    const source = document.createElement("source");
    source.src = `${mediaBaseUrl}/${encodeURIComponent(entry.file)}`;
    source.type = "video/mp4";

    video.appendChild(source);

    const fallbackText = document.createTextNode(
        currentLang === "en"
            ? "Your browser does not support HTML video."
            : "O teu navegador não suporta vídeo HTML."
    );

    video.appendChild(fallbackText);
    videoSection.appendChild(video);

    const description = document.createElement("p");
    description.textContent = getVideoDescription(entry.id);
    videoSection.appendChild(description);

    textContainer.appendChild(videoSection);

    if (!isLastEntry) {
        textContainer.appendChild(document.createElement("hr"));
    }
}

const videoDescriptions = {
    koln: {
        pt: "Filmado em: \"NS-DOK\", Colónia; Mercado de Natal, Colónia.",
        en: "Filmed at: \"NS-DOK\", Cologne; Christmas Market, Cologne"
    }
};

function getVideoDescription(videoId) {
    return videoDescriptions[videoId]?.[currentLang] ?? "";
}

function updateStaticTranslations() {
    const languageTranslations = translations[currentLang];

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const translationKey = element.dataset.i18n;
        const translatedText = languageTranslations[translationKey];

        if (translatedText !== undefined) {
            element.textContent = translatedText;
        }
    });

    document
        .querySelectorAll("[data-i18n-placeholder]")
        .forEach(element => {
            const translationKey = element.dataset.i18nPlaceholder;
            const translatedText = languageTranslations[translationKey];

            if (translatedText !== undefined) {
                element.placeholder = translatedText;
            }
        });

    document.documentElement.lang = currentLang;
}

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
    const response = await fetch("texts/index.json");
    const data = await response.json();

    const entries = data[currentLang];

    for (const [index, entry] of entries.entries()) {
        const isLastEntry = index === entries.length - 1;

        if (entry.type === "text") {
            await renderText(
                `texts/${currentLang}/text-${entry.id}.txt`,
                isLastEntry
            );
        } else if (entry.type === "video") {
            renderVideo(entry, isLastEntry);
        } else {
            console.warn("Unknown entry type:", entry);
        }
    }
}

setLanguage("pt");

function updateLangUI() {
    document.querySelectorAll(".lang-box p").forEach(el => {
        el.classList.remove("active");
    });

    document
        .querySelector(`.lang-box p[data-lang="${currentLang}"]`)
        .classList.add("active");
}

function setLanguage(lang) {
    if (lang === currentLang) return;
    currentLang = lang;
    document.querySelector(".text-container").innerHTML = "";
    updateLangUI();
    updateStaticTranslations();
    renderAllTexts();
}

const closeButton = document.getElementById("close-contact-box");
const contactBox = document.getElementById("contact-box");

closeButton.addEventListener("click", () => {
    contactBox.style.display = "none";
});