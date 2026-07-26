/* ==========================================
   MoneyPilot Analytics Breakdown
   V1
========================================== */

let analyticsMode = null;

function initAnalyticsBreakdown() {

    const cards = document.querySelectorAll(".analyticsBox");

    if (cards.length >= 2) {

        cards[0].addEventListener("click", () => {
            setAnalyticsMode("fixed");
        });

        cards[1].addEventListener("click", () => {
            setAnalyticsMode("variable");
        });

    }

    const startupFilter =
        sessionStorage.getItem("analyticsFilter");

    if (startupFilter) {

        analyticsMode = startupFilter;

        sessionStorage.removeItem("analyticsFilter");

    } else {

        analyticsMode = "fixed";

    }

    renderAnalyticsTransactions();

}

function setAnalyticsMode(mode) {

    analyticsMode = mode;

   trackEvent("analytics_filter",{
    filter: mode
   });

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

    switch (analyticsMode) {

        case "income":

            filtered = transactions.filter(
                t => t.type === "income"
            );

            break;

        case "expense":

            filtered = transactions.filter(
                t => t.type === "expense"
            );

            break;

        case "investment":

            filtered = transactions.filter(
                t => t.type === "investment"
            );

            break;

        case "fixed":

            filtered = transactions.filter(
                t =>
                    t.type === "expense" &&
                    t.fixed === true
            );

            break;

        case "variable":

            filtered = transactions.filter(
                t =>
                    t.type === "expense" &&
                    t.fixed === false
            );

            break;

        default:

            filtered = [];

    }

    filtered.sort((a, b) => {

        const dateDiff =
            new Date(b.date) -
            new Date(a.date);

        if (dateDiff !== 0)
            return dateDiff;

        return Number(b.id || 0)
            - Number(a.id || 0);

    });

    if (!filtered.length) {

        container.innerHTML = `

            <div class="analyticsEmpty">

                No Transactions

            </div>

        `;

        return;

    }

    let html = "";

    filtered.forEach(t => {

        const icon =
            getCategoryEmoji(t.category);

        const date =
            new Date(t.date)
                .toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );

        const created =
            t.createdAt
                ? new Date(t.createdAt)
                : null;

        const time =
            created
                ? created.toLocaleTimeString(
                    "en-GB",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                    }
                )
                : "";

        html += `

<div class="analyticsTxnCard">

    <div class="analyticsTxnHeader">

        <div class="analyticsTxnTitle">

            ${icon} ${t.category}

        </div>

        <div class="analyticsTxnAmount">

            ₹${Number(t.amount).toLocaleString("en-IN")}

        </div>

    </div>

    ${(t.note || t.description) ? `

<div class="analyticsTxnDescription">

    📝 ${t.note || t.description}

</div>

` : ""}

    <div class="analyticsTxnFooter">

        <span>📅 ${date}</span>

        ${time ? `<span>🕒 ${time}</span>` : ""}

    </div>

</div>

`;

    });

    container.style.opacity = "0";

    setTimeout(() => {

        container.innerHTML = html;

        container.style.opacity = "1";

    }, 120);

}

document.addEventListener(
    "DOMContentLoaded",
    initAnalyticsBreakdown
);

function getCategoryEmoji(category){

    return getCategoryIcon(category);

}
