    let db;
    // create a new db request for a "BudgetDB" database.
    const request = window.indexedDB.open("BudgetDB", 1);

    request.onupgradeneeded = function (event) {
    // create object store called "BudgetStore" and set autoIncrement to true
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
    // log error here
    console.log("Something is bad", event);
    };

    function saveRecord(record) {
    // create a transaction on the pending db with readwrite access
    const db = request.result;
    const transaction = db.transaction(["BudgetDB"], "readwrite");
    const BudgetStore = transaction.objectStore("BudgetDB");
    // access your pending object store
    // add record to your store with add method.
    BudgetStore.add(record)
    }

    function checkDatabase() {
    // open a transaction on your pending db
    const transaction = db.transaction(["BudgetDB"], "readwrite");
    const BudgetStore = transaction.objectStore("BudgetDB");

    var getAll = BudgetStore.getAll();
    // access your pending object store
    // get all records from store and set to a variable

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
            // if successful, open a transaction on your pending db
            const transaction = db.transaction(["BudgetDB"], "readwrite");
            const BudgetStore = transaction.objectStore("BudgetDB");
            // access your pending object store
            // clear all items in your store
            BudgetStore.clear();
            });
        }
    };
    }

    // listen for app coming back online
    window.addEventListener('online', checkDatabase);
