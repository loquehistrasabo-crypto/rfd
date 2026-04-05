let whitelist = [];

// Load from localStorage on page load
function loadWhitelist() {
    const saved = localStorage.getItem('robloxWhitelist');
    if (saved) {
        whitelist = JSON.parse(saved);
    }
    renderList();
}

// Save to localStorage
function saveWhitelist() {
    localStorage.setItem('robloxWhitelist', JSON.stringify(whitelist));
    renderList();
}

// Add user to whitelist
function addUser() {
    const input = document.getElementById('usernameInput');
    const username = input.value.trim();
    
    if (!username) {
        alert('Please enter a username');
        return;
    }
    
    if (whitelist.includes(username.toLowerCase())) {
        alert('User already in whitelist');
        return;
    }
    
    whitelist.push(username.toLowerCase());
    saveWhitelist();
    input.value = '';
}

// Remove user from whitelist
function removeUser(username) {
    whitelist = whitelist.filter(u => u !== username);
    saveWhitelist();
}

// Render the list
function renderList() {
    const listDiv = document.getElementById('userList');
    const countSpan = document.getElementById('count');
    
    countSpan.textContent = whitelist.length;
    
    if (whitelist.length === 0) {
        listDiv.innerHTML = '<div class="empty-state">No users whitelisted yet</div>';
        return;
    }
    
    listDiv.innerHTML = whitelist.map(user => `
        <div class="user-item">
            <span class="user-name">${user}</span>
            <button class="remove-btn" onclick="removeUser('${user}')">Remove</button>
        </div>
    `).join('');
}

// Export as JSON
function exportList() {
    const output = document.getElementById('output');
    output.value = JSON.stringify(whitelist, null, 2);
}

// Download JSON file
function downloadJSON() {
    const blob = new Blob([JSON.stringify(whitelist, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'whitelist.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Copy as Lua table
function copyLuaTable() {
    const output = document.getElementById('output');
    const luaTable = 'local whitelist = {' + 
        whitelist.map(u => `"${u}"`).join(', ') + 
        '}';
    output.value = luaTable;
    
    // Copy to clipboard
    output.select();
    document.execCommand('copy');
    alert('Lua table copied to clipboard!');
}

// Allow Enter key to add user
document.getElementById('usernameInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addUser();
    }
});

// Load on page load
loadWhitelist();
