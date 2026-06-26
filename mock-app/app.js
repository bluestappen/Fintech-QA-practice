const users = {
  user_standard: {
    password: "password123",
    accountId: "ACC-001",
    status: "ACTIVE"
  },
  user_low_balance: {
    password: "password123",
    accountId: "ACC-002",
    status: "ACTIVE"
  },
  user_suspended: {
    password: "password123",
    accountId: "ACC-003",
    status: "SUSPENDED"
  }
};

const accounts = {
  "ACC-001": {
    owner: "user_standard",
    balance: 100000,
    status: "ACTIVE"
  },
  "ACC-002": {
    owner: "user_low_balance",
    balance: 1000,
    status: "ACTIVE"
  },
  "ACC-003": {
    owner: "user_suspended",
    balance: 100000,
    status: "SUSPENDED"
  },
  "ACC-004": {
    owner: "user_receiver",
    balance: 50000,
    status: "ACTIVE"
  }
};

let currentUserId = null;
let transactionCounter = 1;
let transactions = [];
let isTransferInProgress = false;

const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const transferSection = document.getElementById("transfer-section");
const historySection = document.getElementById("history-section");

const userIdInput = document.getElementById("user-id");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-button");
const loginMessage = document.getElementById("login-message");

const currentUser = document.getElementById("current-user");
const accountId = document.getElementById("account-id");
const accountStatus = document.getElementById("account-status");
const accountBalance = document.getElementById("account-balance");
const logoutButton = document.getElementById("logout-button");

const receiverAccountInput = document.getElementById("receiver-account");
const transferAmountInput = document.getElementById("transfer-amount");
const transferButton = document.getElementById("transfer-button");
const transferMessage = document.getElementById("transfer-message");

const transactionHistory = document.getElementById("transaction-history");

function formatKRW(amount) {
  return `${amount.toLocaleString("ko-KR")} KRW`;
}

function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `message ${type}`;
}

function clearMessage(element) {
  element.textContent = "";
  element.className = "message";
}

function getCurrentAccount() {
  const user = users[currentUserId];
  return accounts[user.accountId];
}

function renderDashboard() {
  const user = users[currentUserId];
  const account = accounts[user.accountId];

  currentUser.textContent = currentUserId;
  accountId.textContent = user.accountId;
  accountStatus.textContent = account.status;
  accountBalance.textContent = formatKRW(account.balance);
}

function renderTransactionHistory() {
  transactionHistory.innerHTML = "";

  const user = users[currentUserId];
  const userAccountId = user.accountId;

  const userTransactions = transactions.filter(
    (transaction) => transaction.senderAccountId === userAccountId
  );

  userTransactions
    .slice()
    .reverse()
    .forEach((transaction) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${transaction.transactionId}</td>
        <td>${transaction.receiverAccountId}</td>
        <td>${formatKRW(transaction.amount)}</td>
        <td>${transaction.status}</td>
      `;

      transactionHistory.appendChild(row);
    });
}

function handleLogin() {
  const userId = userIdInput.value.trim();
  const password = passwordInput.value.trim();

  clearMessage(loginMessage);

  if (!userId || !password) {
    showMessage(loginMessage, "User ID and password are required.", "error");
    return;
  }

  const user = users[userId];

  if (!user || user.password !== password) {
    showMessage(loginMessage, "Invalid user ID or password.", "error");
    return;
  }

  currentUserId = userId;

  loginSection.classList.add("hidden");
  dashboardSection.classList.remove("hidden");
  transferSection.classList.remove("hidden");
  historySection.classList.remove("hidden");

  renderDashboard();
  renderTransactionHistory();

  showMessage(loginMessage, "", "success");
}

function handleLogout() {
  currentUserId = null;

  userIdInput.value = "";
  passwordInput.value = "";
  receiverAccountInput.value = "";
  transferAmountInput.value = "";

  dashboardSection.classList.add("hidden");
  transferSection.classList.add("hidden");
  historySection.classList.add("hidden");
  loginSection.classList.remove("hidden");

  clearMessage(loginMessage);
  clearMessage(transferMessage);
}

function handleTransfer() {
  if (isTransferInProgress) {
    showMessage(transferMessage, "Transfer is already in progress.", "error");
    return;
  }

  isTransferInProgress = true;
  transferButton.disabled = true;

  const senderUser = users[currentUserId];
  const senderAccount = accounts[senderUser.accountId];

  const receiverAccountId = receiverAccountInput.value.trim();
  const amount = Number(transferAmountInput.value);

  clearMessage(transferMessage);

  if (senderAccount.status !== "ACTIVE") {
    showMessage(transferMessage, "Suspended account cannot transfer money.", "error");
    finishTransfer();
    return;
  }

  if (!receiverAccountId) {
    showMessage(transferMessage, "Receiver account is required.", "error");
    finishTransfer();
    return;
  }

  const receiverAccount = accounts[receiverAccountId];

  if (!receiverAccount || receiverAccount.status !== "ACTIVE") {
    showMessage(transferMessage, "Receiver account does not exist or is not active.", "error");
    finishTransfer();
    return;
  }

  if (!amount || amount <= 0) {
    showMessage(transferMessage, "Transfer amount must be greater than zero.", "error");
    finishTransfer();
    return;
  }

  if (amount > senderAccount.balance) {
    showMessage(transferMessage, "Transfer amount exceeds available balance.", "error");
    finishTransfer();
    return;
  }

  senderAccount.balance -= amount;
  receiverAccount.balance += amount;

  const transaction = {
    transactionId: `TX-${String(transactionCounter).padStart(3, "0")}`,
    senderAccountId: senderUser.accountId,
    receiverAccountId,
    amount,
    status: "COMPLETED"
  };

  transactionCounter += 1;
  transactions.push(transaction);

  showMessage(transferMessage, "Transfer completed successfully.", "success");

  renderDashboard();
  renderTransactionHistory();

  finishTransfer();
}

function finishTransfer() {
  setTimeout(() => {
    isTransferInProgress = false;
    transferButton.disabled = false;
  }, 300);
}

loginButton.addEventListener("click", handleLogin);
logoutButton.addEventListener("click", handleLogout);
transferButton.addEventListener("click", handleTransfer);
