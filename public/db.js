let db;

const request = window.indexedDB.open("BudgetDB", 1);

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    const objectStore = db.createObjectStore("BudgetStore", { autoIncrement: true });
};

request.onsuccess = (event) => {
    db = event.target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = (event) => {
    console.log("something is bad", event)
};

function saveRecord(record) {

    const transaction = db.transaction(["BudgetStore"], "readwrite");
    const budgetStore = transaction.objectStore("BudgetStore");

    budgetStore.add(record);
}

function checkDatabase() {

    const transaction = db.transaction(["BudgetStore"])
    const budgetStore = transaction.objectStore("BudgetStore");

    const getAll = budgetStore.getAll();

    getAll.onsuccess = () => {
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
                .then((res) => {
                    if (res) {
                        const transaction = db.transaction(["BudgetStore"], "readwrite");
                        const store = transaction.objectStore("BudgetStore");
                        store.clear();
                    }
                });
        }
    };
}


window.addEventListener('online', checkDatabase);

