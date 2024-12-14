const apiEndpoint = 'http://localhost:3000/users';

async function createUser() {
  const name = document.getElementById('user-name').value;
  const address = document.getElementById('user-address').value;
  const number = parseInt(document.getElementById('user-number').value, 10);

  if (name && address && !isNaN(number)) {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address, number })
    });
    const data = await response.json();
    displayOutput(`User created: ID - ${data.id}, Name - ${data.name}, Address - ${data.address}, Number - ${data.number}`);
  } else {
    displayOutput('Please enter valid name, address, and number.');
  }
}

async function getUser() {
  const userId = prompt("Enter User ID to fetch:");
  if (userId) {
    const response = await fetch(`${apiEndpoint}/${userId}`);
    if (response.ok) {
      const data = await response.json();
      displayData(`User details: ID - ${data.id}, Name - ${data.name}, Address - ${data.address}, Number - ${data.number}`);
    } else {
      displayData('User not found.');
    }
  }
}

async function updateUser() {
  const userId = prompt("Enter User ID to update:");
  const name = document.getElementById('user-name').value;
  const address = document.getElementById('user-address').value;
  const number = parseInt(document.getElementById('user-number').value, 10);

  if (userId && name && address && !isNaN(number)) {
    const response = await fetch(`${apiEndpoint}/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address, number })
    });
    const data = await response.json();
    displayOutput(`User updated: ID - ${data.id}, Name - ${data.name}, Address - ${data.address}, Number - ${data.number}`);
  } else {
    displayOutput('Please enter user ID, valid name, address, and number.');
  }
}

async function deleteUser() {
  const userId = prompt("Enter User ID to delete:");
  if (userId) {
    const response = await fetch(`${apiEndpoint}/${userId}`, { method: 'DELETE' });
    if (response.ok) {
      displayOutput(`User with ID ${userId} deleted.`);
    } else {
      displayOutput('Failed to delete user.');
    }
  }
}

async function showAllUsers() {
  const response = await fetch(apiEndpoint);
  const data = await response.json();

  const modalDataContainer = document.getElementById('modal-data-container');
  modalDataContainer.innerHTML = '';
  data.forEach(user => {
    const userInfo = document.createElement('p');
    userInfo.textContent = `ID: ${user.id}, Name: ${user.name}, Address: ${user.address}, Number: ${user.number}`;
    modalDataContainer.appendChild(userInfo);
  });

  document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function displayOutput(message) {
  document.getElementById('output').innerText = message;
}

function displayData(message) {
  const dataContainer = document.getElementById('data-container');
  const p = document.createElement('p');
  p.textContent = message;
  dataContainer.appendChild(p);
}
