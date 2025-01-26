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
const todoTitle = document.querySelector('#todo-title-input') as HTMLInputElement;
const todoText = document.querySelector('#todo-text-input') as HTMLInputElement;
const todoDate = document.querySelector('#todo-date-input') as HTMLInputElement;
const todoList = document.querySelector('.all-posts-list') as HTMLUListElement

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface NewTodo {
  title: string; 
  description?: string; 
  completed?: boolean; 
  due_date?: string; 
}


async function fetchData() {
  const { data: { user  } }= await supabase.auth.getUser();
  if(user){
  const { data, error } = await supabase
    .from('todos') 
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log('Data:', data);
    data?.map((item) => {
      const li = document.createElement('li') as HTMLLIElement;
      li.setAttribute('data-parent-id', item.id);
      li.innerHTML = `
      <h2 class="post-title">${item.title}</h2>
      <h2 class="post-text">${item.description22222}</h2>
      <h2 class="post-date">${item.due_date.toString()}</h2>
      <button class="del-todo-btn" data-parent-id="${item.id}">Delete</button>
      `
      todoList.appendChild(li);
    })
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

async function addTodo(newTodo: NewTodo) {
  if (!user) {
    console.log("Användare ej inloggad.");
    return;
  }


  const { data, error } = await supabase
    .from('todos')
    .insert({
     user_id: user.id,
     ...newTodo
});

  if (error) {
    console.error("Fel vid skapande av todo:", error);
  } else {
    console.log("Todo skapad:", data);
  }
}

async function updateData() {
  const { data: { user } } = await supabase.auth.getUser();
  
 
}

todoList.addEventListener('click', async function(event: MouseEvent) {
  // Kontrollera att event.target är en knapp (HTMLButtonElement)
  if (event.target && (event.target as HTMLButtonElement).classList.contains('del-todo-btn')) {
    await deleteTodoByParentId(event);
  }
});

async function deleteTodoByParentId(event: Event) {
  console.log("Hello")
  if (!user) {
    console.log('Inget användare är inloggad.');
    return;
  }

  // Hämta parentId från data-parent-id attributet på knappen
  const button = event.target as HTMLButtonElement; // Typa om till HTMLButtonElement
  const parentId = button.getAttribute('data-parent-id'); // Hämta parentId
 console.log(parentId)
  if (!parentId) {
    console.log('Parent ID saknas.');
    return;
  }

  // Ta bort todo-uppgiften från tabellen baserat på parentId
  const { data, error } = await supabase
    .from('todos')
    .delete()
    .eq('id', parentId) // Filtrera på parent_id
    .eq('user_id', user.id); // Säkerställ att det är den inloggade användarens todo

  if (error) {
    console.error('Fel vid borttagning av todo:', error);
  } else {
    console.log('Todo borttagen:', data);
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
  const newTodo: NewTodo = {
    title: todoTitle.value,
    description: todoText.value,
    due_date: todoDate.value
  };
addTodo(newTodo);
})

updateBtn.addEventListener('click', () => {
  updateData();
})

fetchData();



