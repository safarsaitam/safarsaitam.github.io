const numberOfTexts = 6;

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
    const res = await fetch(`texts/index.json`);
    const data = await res.json();

    const reversed = [...data[currentLang]].reverse();

    for (const [i, index] of reversed.entries()) {
        const isLastText = i === reversed.length - 1;

        await renderText(
            `texts/${currentLang}/text-${index}.txt`,
            isLastText
        );
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