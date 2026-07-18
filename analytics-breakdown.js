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

  filtered.sort((a, b) => {

    // Newest transaction date first
    const dateDiff = new Date(b.date) - new Date(a.date);

    if (dateDiff !== 0) {

        return dateDiff;

    }

    // Same date -> newest added transaction first
    return Number(b.id || 0) - Number(a.id || 0);

});
   

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

    console.log(t);

    const created = t.createdAt

    ? new Date(t.createdAt)

    : null;

const shortDate = new Date(t.date)

    .toLocaleDateString(

        "en-GB",

        {

            day: "2-digit",

            month: "short"

        }

    );

const shortTime = created

    ? created.toLocaleTimeString(

        "en-GB",

        {

            hour: "2-digit",

            minute: "2-digit",

            hour12: false

        }

    )

    : "";

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

    ${shortTime ? `<br><small>${shortTime}</small>` : ""}

</span>

<span class="analyticsAmount">

    ₹${Number(t.amount).toLocaleString("en-IN")}

</span>

        </div>

    `;

});

    container.style.opacity = "0";

setTimeout(()=>{

    container.innerHTML = html;

    container.style.opacity = "1";

},120);

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
