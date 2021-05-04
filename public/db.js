let db;

const request = window.indexedDB.open("BudgetDB", 1);

request.onupgradeneeded = function (event) {

    const db = event.target.result;
    const BudgetStore = db.createObjectStore("BudgetDB", { autoIncrement: true })
};

request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
    checkDatabase();
    }
};

request.onerror = function (event) {

    console.log("Something is bad", event);
};

function saveRecord(record) {

    const db = request.result;
    const transaction = db.transaction(["BudgetDB"], "readwrite");
    const BudgetStore = transaction.objectStore("BudgetDB");

    BudgetStore.add(record)
}

function checkDatabase() {

    const transaction = db.transaction(["BudgetDB"], "readwrite");
    const BudgetStore = transaction.objectStore("BudgetDB");

    const getAll = BudgetStore.getAll();

    getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
        fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then(() => {

            const transaction = db.transaction(["BudgetDB"], "readwrite");
            const BudgetStore = transaction.objectStore("BudgetDB");

            BudgetStore.clear();
        });
    }
    };
}

window.addEventListener('online', checkDatabase);
