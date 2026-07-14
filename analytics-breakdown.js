/* ==========================================
   MoneyPilot Analytics Breakdown
   V1
========================================== */

let analyticsMode = null;

function initAnalyticsBreakdown() {

    const cards = document.querySelectorAll(".analyticsBox");

    if (cards.length < 2) return;

    cards[0].addEventListener("click", () => {
        setAnalyticsMode("fixed");
    });

    cards[1].addEventListener("click", () => {
        setAnalyticsMode("variable");
    });

}

function setAnalyticsMode(mode) {

    analyticsMode = mode;

    const cards = document.querySelectorAll(".analyticsBox");

    cards.forEach(card => card.classList.remove("active"));

    if (mode === "fixed") {

        cards[0].classList.add("active");

    } else {

        cards[1].classList.add("active");

    }

    renderAnalyticsTransactions();

}

function renderAnalyticsTransactions() {

    const container =
        document.getElementById("categorySummary");

    if (!container) return;

    const transactions =
        getCurrentMonthTransactions();

    let filtered = [];

    if (analyticsMode === "fixed") {

        filtered = transactions.filter(t =>
            t.type === "expense" &&
            t.fixed === true
        );

    } else {

        filtered = transactions.filter(t =>
            t.type === "expense" &&
            t.fixed === false
        );

    }

    if (filtered.length === 0) {

        container.innerHTML = `
            <div class="analyticsEmpty">
                No Transactions
            </div>
        `;

        return;

    }

    let html = "";

    filtered.forEach(t => {

    const shortDate = new Date(t.date).toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short"
        }
    );

    const icon = getCategoryEmoji(t.category);

    html += `

        <div class="analyticsItem">

            <span class="analyticsIcon">

                ${icon}

            </span>

            <span class="analyticsCategory">

                ${t.category}

            </span>

            <span class="analyticsDate">

                ${shortDate}

            </span>

            <span class="analyticsAmount">

                ₹${Number(t.amount).toLocaleString("en-IN")}

            </span>

        </div>

    `;

});

    container.innerHTML = html;

}

document.addEventListener(
    "DOMContentLoaded",
    initAnalyticsBreakdown
);

function getCategoryEmoji(category){

    const icons = {

        Food:"🍔",

        Fuel:"⛽",

        Shopping:"🛍️",

        Health:"🏥",

        Entertainment:"🎬",

        Salary:"💼",

        Investment:"📈",

        Rent:"🏠",

        Travel:"✈️",

        Education:"📚",

        Other:"📦"

    };

    return icons[category] || "💳";

}
