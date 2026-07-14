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

        html += `

        <div class="analyticsItem">

            <div>

                <div class="analyticsCategory">

                    ${t.category}

                </div>

                <div class="analyticsDate">

                    ${t.date}

                </div>

            </div>

            <div class="analyticsAmount">

                ₹${Number(t.amount).toLocaleString("en-IN")}

            </div>

        </div>

        `;

    });

    container.innerHTML = html;

}

document.addEventListener(
    "DOMContentLoaded",
    initAnalyticsBreakdown
);
