import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
// Get Supabase URL and Key from environment variables
const SUPABASE_URL = import.meta.env.VITE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_ANON_KEY;
const loginEmailInput = document.querySelector('#login-email-field');
const loginPasswordInput = document.querySelector('#login-password-field');
const signupEmailInput = document.querySelector('#signup-email-field');
const signupPasswordInput = document.querySelector('#signup-password-field');
const loginBtn = document.querySelector('.login-btn');
const logoutBtn = document.querySelector('.logout-btn');
const signupBtn = document.querySelector('.signup-btn');
const signupWrapper = document.querySelector('.signup-wrapper');
const loginWrapper = document.querySelector('.login-wrapper');
const sendBtn = document.querySelector('.send-data');
// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const uniqueId = uuidv4();
// Example function to fetch data from a table
async function fetchData() {
    const { data, error } = await supabase
        .from('newtable') // Replace with your actual table name
        .select('*');
    if (error) {
        console.error('Error fetching data:', error);
    }
    else {
        console.log('Data:', data);
        const appDiv = document.getElementById('app');
        appDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
}
async function signUpNewUser() {
    const { data, error } = await supabase.auth.signUp({
        email: `${signupEmailInput.value}`,
        password: `${signupPasswordInput.value}`,
    });
    if (error) {
        console.error('Error fetching data:', error);
    }
    else {
        console.log('Data:', data);
        const appDiv = document.getElementById('app');
        appDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
}
async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: `${loginEmailInput.value}`,
        password: `${loginPasswordInput.value}`,
    });
    if (error) {
        console.error('Error fetching data:', error);
    }
    else {
        console.log('Data:', data);
        const appDiv = document.getElementById('app');
        appDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
}
async function signOutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error fetching data:', error);
    }
    else {
        console.log('User logged out');
        const appDiv = document.getElementById('app');
        appDiv.innerHTML = `<pre>${'User logged out'}</pre>`;
    }
}
async function sendData() {
    const testObj = {
        id: uniqueId,
        title: 'firstPost',
        content: 'firstText',
        completed: false
    };
    const { error } = await supabase
        .from('newtable')
        .insert(testObj);
}
const { data: { user } } = await supabase.auth.getUser();
if (user) {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `<pre>${user.email}</pre>`;
    signupWrapper.style.display = 'none';
    loginWrapper.style.display = 'none';
}
else if (!user) {
    signupWrapper.style.display = 'flex';
    loginWrapper.style.display = 'flex';
}
signupBtn.addEventListener('click', () => {
    signUpNewUser();
    loginEmailInput.value = '';
    loginPasswordInput.value = '';
    signupEmailInput.value = '';
    signupPasswordInput.value = '';
    if (user) {
        signupWrapper.style.display = 'none';
        loginWrapper.style.display = 'none';
    }
    else if (!user) {
        signupWrapper.style.display = 'none';
        loginWrapper.style.display = 'none';
    }
});
loginBtn.addEventListener('click', () => {
    signInWithEmail();
    loginEmailInput.value = '';
    loginPasswordInput.value = '';
    if (user) {
        signupWrapper.style.display = 'none';
        loginWrapper.style.display = 'none';
    }
    else if (!user) {
        signupWrapper.style.display = 'flex';
        loginWrapper.style.display = 'flex';
    }
});
logoutBtn.addEventListener('click', () => {
    signOutUser();
    if (user) {
        signupWrapper.style.display = 'none';
        loginWrapper.style.display = 'none';
    }
    else if (!user) {
        signupWrapper.style.display = 'flex';
        loginWrapper.style.display = 'flex';
    }
});
sendBtn.addEventListener('click', () => {
    sendData();
});
// Call the function
//fetchData();
//signUpNewUser();
