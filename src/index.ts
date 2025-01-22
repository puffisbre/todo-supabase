import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';


// Get Supabase URL and Key from environment variables
const SUPABASE_URL = import.meta.env.VITE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_ANON_KEY;

const loginEmailInput = document.querySelector('#login-email-field') as HTMLInputElement;
const loginPasswordInput = document.querySelector('#login-password-field') as HTMLInputElement;
const signupEmailInput = document.querySelector('#signup-email-field') as HTMLInputElement;
const signupPasswordInput = document.querySelector('#signup-password-field') as HTMLInputElement;
const loginBtn = document.querySelector('.login-btn') as HTMLButtonElement;
const logoutBtn = document.querySelector('.logout-btn') as HTMLButtonElement;
const signupBtn = document.querySelector('.signup-btn') as HTMLButtonElement;
const signupWrapper = document.querySelector('.signup-wrapper') as HTMLElement;
const loginWrapper = document.querySelector('.login-wrapper') as HTMLElement;
const sendBtn = document.querySelector('.send-data') as HTMLButtonElement;
const updateBtn = document.querySelector('.update-btn') as HTMLButtonElement;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const uniqueId = uuidv4();
interface MainData  {
  id: string,
  title: string,
  content: string,
  completed: boolean
}

// Example function to fetch data from a table
async function fetchData() {
  const { data: { user  } }= await supabase.auth.getUser();
  if(user){
  const { data, error } = await supabase
    .from('userdata') // Replace with your actual table name
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log('Data:', data);
    const appDiv = document.getElementById('app');
    appDiv!.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }
}
}

async function signUpNewUser(){
  const {data, error} = await supabase.auth.signUp({
    email: `${signupEmailInput.value}`,
    password: `${signupPasswordInput.value}`,
  })

  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log('Data:', data);
    const appDiv = document.getElementById('app');
    appDiv!.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }
}

async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${loginEmailInput.value}`,
    password: `${loginPasswordInput.value}`,
  })

  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log('Data:', data);
    const appDiv = document.getElementById('app');
    appDiv!.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }
}

async function signOutUser() {
  const {error} = await supabase.auth.signOut();

  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log('User logged out');
    const appDiv = document.getElementById('app');
    appDiv!.innerHTML = `<pre>${'User logged out'}</pre>`;
  }
}

async function sendData() {
  const { data: { user } } = await supabase.auth.getUser();

 
  if(user){
    const testObj: MainData = {
      id: user?.id,
      title: 'secondPost',
      content: 'secondText',
      completed: false
    }

    const secObj: MainData = {
      id: user?.id,
      title: 'thirdPost',
      content: 'thirdText',
      completed: false
    }
  const { error } = await supabase
  .from('userdata')
  .insert([testObj, secObj]);
  console.log(error);
  }
}

async function updateData() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if(user){
    const testObj: MainData = {
      id: user?.id,
      title: 'secondPost',
      content: 'secondText',
      completed: false
    }

    const secObj: MainData = {
      id: user?.id,
      title: 'thirdPost',
      content: 'thirdText',
      completed: false
    }
    const { error } = await supabase
    .from('userdata')
    .update([secObj])
    .eq('id', user.id)
    console.log(error);
  }

  
 
}

const { data: { user } } = await supabase.auth.getUser();

if(user){
  const appDiv = document.getElementById('app');
    appDiv!.innerHTML = `<pre>${user.email}</pre>`;
 signupWrapper.style.display = 'none';
 loginWrapper.style.display = 'none';
}else if(!user){
  signupWrapper.style.display = 'flex';
  loginWrapper.style.display = 'flex';
}

signupBtn.addEventListener('click', () => {
  signUpNewUser();
  loginEmailInput.value = '';
 loginPasswordInput.value = '';
 signupEmailInput.value = '';
 signupPasswordInput.value = '';
 if(user){
  signupWrapper.style.display = 'none';
  loginWrapper.style.display = 'none';
 }else if(!user){
   signupWrapper.style.display = 'none';
   loginWrapper.style.display = 'none';
 }
})

loginBtn.addEventListener('click', () => {
 signInWithEmail();
 loginEmailInput.value = '';
 loginPasswordInput.value = '';
 if(user){
  signupWrapper.style.display = 'none';
  loginWrapper.style.display = 'none';
  fetchData();
 }else if(!user){
   signupWrapper.style.display = 'flex';
   loginWrapper.style.display = 'flex';
 }
})


logoutBtn.addEventListener('click', () => {
 signOutUser();
 if(user){
  signupWrapper.style.display = 'none';
  loginWrapper.style.display = 'none';
 }else if(!user){
  signupWrapper.style.display = 'flex';
   loginWrapper.style.display = 'flex';
 }
})

sendBtn.addEventListener('click', () => {
sendData();
})

updateBtn.addEventListener('click', () => {
  updateData();
})



// Call the function
//fetchData();
//signUpNewUser();




