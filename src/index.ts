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
const todoTitle = document.querySelector('#todo-title-input') as HTMLInputElement;
const addTodoWrapper = document.querySelector('.add-todo-wrapper') as HTMLElement;
const todoText = document.querySelector('#todo-text-input') as HTMLInputElement;
const todoDate = document.querySelector('#todo-date-input') as HTMLInputElement;
const todoList = document.querySelector('.all-posts-list') as HTMLUListElement;
const spinner = document.querySelector('.loader') as HTMLElement;
const notLoggedInBtn = document.querySelector('.not-logged-btn') as HTMLButtonElement;
const notSignedBtn = document.querySelector('.not-signed-up') as HTMLButtonElement;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const { data: { user } } = await supabase.auth.getUser();
interface NewTodo {
  title: string; 
  description?: string; 
  completed?: boolean; 
  due_date?: string; 
}
signupWrapper.style.display = 'none';
spinner.style.display = "none";
let completed: Boolean = false;

if(user){
  const appDiv = document.getElementById('app');
    appDiv!.innerHTML = `<pre>${user.email}</pre>`;
 signupWrapper.style.display = 'none';
 loginWrapper.style.display = 'none';
 addTodoWrapper.style.display = 'flex';
 fetchData();
}else if(!user){
  loginWrapper.style.display = 'flex';
  logoutBtn.style.display = "none";
}

async function fetchData() {
  const { data: { user  } }= await supabase.auth.getUser();
  if(user){
  const { data, error } = await supabase
    .from('todos') 
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log('Data:', data);
    todoList.innerHTML = '';
    spinner.style.display = "flex";
    setTimeout(() => {
      spinner.style.display = "none";
      data?.map((item) => {
        const li = document.createElement('li') as HTMLLIElement;
        li.setAttribute('data-parent-id', item.id);
        li.classList.add('todo-list-item');
        li.innerHTML = `
        <h2 class="post-title">${item.title}</h2>
        <h2 class="post-text">${item.description}</h2>
        <h2 class="post-date">${item.due_date.toString().slice(0,10)}</h2>
        <button class="complete-todo-btn" data-parent-id="${item.id}"><img class="complete-todo-btn" data-parent-id="${item.id}" src="../images/check.png" width="25px"></img></button>
        <button class="open-todo-btn" data-parent-id="${item.id}"><img class="open-todo-btn" data-parent-id="${item.id}" src="../images/pencil.png" width="20px"></button>
        <button class="del-todo-btn" data-parent-id="${item.id}"><img class="del-todo-btn" data-parent-id="${item.id}" src="../images/bin.png" width="20px"></button>
        `
        todoList.appendChild(li);
        completed = item.completed;
        const testLiItem = document.querySelectorAll('.todo-list-item') as NodeListOf<Element>;
        for(let i = 0; i < testLiItem.length; i++){
          if(testLiItem[i].getAttribute('data-parent-id') === item.id){
            if(item.completed === true){
              testLiItem[i].classList.add('completed-task');
             }else if(item.completed === false){
              testLiItem[i].classList.remove('completed-task');
             }
          }
        }
      })
    }, 1000);
  }
  todoList.style.display = 'flex';
}
}

async function signUpNewUser(){
  const {data, error} = await supabase.auth.signUp({
    email: `${signupEmailInput.value}`,
    password: `${signupPasswordInput.value}`,
  })

  if (error) {
    console.error('Error fetching data:', error);
    alert('WRONG TYPE OF EMAIL OR PASSWORD');
    loginEmailInput.value = '';
    loginPasswordInput.value = '';
    logoutBtn.style.display = 'none';
    loginWrapper.style.display = 'flex';
    signupWrapper.style.display = 'none';
    addTodoWrapper.style.display = 'none';
    todoList.style.display = 'none';
  } else {
  fetchData();
  }
}

async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${loginEmailInput.value}`,
    password: `${loginPasswordInput.value}`,
  })

  if (error) {
    console.error('Error fetching data:', error);
    alert('WRONG EMAIL OR PASSWORD');
    loginEmailInput.value = '';
    loginPasswordInput.value = '';
    logoutBtn.style.display = 'none';
    loginWrapper.style.display = 'flex';
    signupWrapper.style.display = 'none';
    addTodoWrapper.style.display = 'none';
    todoList.style.display = 'none';
  } else {
  fetchData();
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
    fetchData();
  }
}

todoList.addEventListener('click', async function(event: MouseEvent) {
  console.log('Klickad knapp:', event.target); 
  if (event.target && (event.target as HTMLImageElement).classList.contains('open-todo-btn')) {
    await openModal(event);
  }
});

async function openModal(event: MouseEvent) {
  if (!user) {
    return;
  }
  const parentId = (event.target as HTMLImageElement).getAttribute('data-parent-id');
  if (!parentId) return;

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('id', parentId)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching todo:', error);
    return;
  }

  (document.getElementById('title') as HTMLInputElement).value = data.title;
  (document.getElementById('description') as HTMLInputElement).value = data.description;
  (document.getElementById('date') as HTMLInputElement).value = data.due_date.toString().slice(0,10);

  (document.querySelector('.modal') as HTMLElement).style.display = 'block';
  document.getElementById('editForm')!.addEventListener('submit', async function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    await updateTodo(parentId);
    fetchData();
  });
}

async function updateTodo(parentId: string) {
  const title = (document.getElementById('title') as HTMLInputElement).value;
  const description = (document.getElementById('description') as HTMLInputElement).value;
  const due_date = (document.getElementById('date') as HTMLInputElement).value;
  
  const { data, error } = await supabase
    .from('todos')
    .update({ title, description, due_date })
    .eq('id', parentId);

  if (error) {
    console.error('Error updating todo:', error);
    return;
  }
  document.getElementById('editModal')!.style.display = 'none';
}

document.querySelector('.close')!.addEventListener('click', function() {
  document.getElementById('editModal')!.style.display = 'none';
});

let theTodoList = document.querySelector('.all-posts-list') as HTMLUListElement;
theTodoList.innerHTML = '';
theTodoList?.addEventListener('click', async function(event: MouseEvent) {
  if (event.target && (event.target as HTMLButtonElement).classList.contains('open-todo-btn')) {
    await openModal(event);
  }
});


todoList.addEventListener('click', async function(event: MouseEvent) {
  if (event.target && (event.target as HTMLImageElement).classList.contains('del-todo-btn')) {
    await deleteTodoByParentId(event);
  }
});

async function deleteTodoByParentId(event: Event) {
  console.log("Hello")
  if (!user) {
    console.log('Inget användare är inloggad.');
    return;
  }


  const button = event.target as HTMLImageElement;
  const parentId = button.getAttribute('data-parent-id'); 
 console.log(parentId)
  if (!parentId) {
    console.log('Parent ID saknas.');
    return;
  }

 
  const { data, error } = await supabase
    .from('todos')
    .delete()
    .eq('id', parentId)
    .eq('user_id', user.id); 

  if (error) {
    console.error('Fel vid borttagning av todo:', error);
  } else {
    fetchData();
  }
}

todoList.addEventListener('click', async function(event: MouseEvent) {
  if (event.target && (event.target as HTMLImageElement).classList.contains('complete-todo-btn')) {
    await completeTask(event);
  }
});

async function completeTask(event: Event) {
  console.log("Hello")
  if (!user) {
    console.log('Inget användare är inloggad.');
    return;
  }

if(user){
  const button = event.target as HTMLImageElement;
  const parentId = button.getAttribute('data-parent-id'); 
 console.log(parentId)
  if (!parentId) {
    console.log('Parent ID saknas.');
    return;
  }



  const { data, error } = await supabase
    .from('todos')
    .select('completed')
    .eq('id', parentId)
    .eq('user_id', user.id); 

  if (error) {
    console.error('Fel vid borttagning av todo:', error);
  } else {

    if (data && data.length > 0) {
      const item = data[0];
  
      const { error: updateError } = await supabase
        .from('todos')
        .update({ completed: !item.completed }) 
        .eq('id', parentId);  
  
      if (updateError) {
        console.error('Fel vid uppdatering av data:', updateError);
      } else {
        const testLiItem = document.querySelectorAll('.todo-list-item') as NodeListOf<Element>;

        for(let i = 0; i < testLiItem.length; i++){
          if(testLiItem[i].getAttribute('data-parent-id') === parentId){
            if(item.completed === true){
              testLiItem[i].classList.remove('completed-task');
             }else if(item.completed === false){
              testLiItem[i].classList.add('completed-task');
             }
          }
        }
      }
    }
     
    }
  }
}

async function fetchCompleted(){

}



signupBtn.addEventListener('click', () => {
  signUpNewUser();
  loginEmailInput.value = '';
 loginPasswordInput.value = '';
 signupEmailInput.value = '';
 signupPasswordInput.value = '';
 logoutBtn.style.display = 'inline-block';
 loginWrapper.style.display = 'none';
 signupWrapper.style.display = 'none';
 addTodoWrapper.style.display = 'flex';
})

loginBtn.addEventListener('click', () => {
 signInWithEmail();
 loginEmailInput.value = '';
 loginPasswordInput.value = '';
 logoutBtn.style.display = 'inline-block';
 loginWrapper.style.display = 'none';
 signupWrapper.style.display = 'none';
 addTodoWrapper.style.display = 'flex';
})


logoutBtn.addEventListener('click', () => {
 signOutUser();
 loginEmailInput.value = '';
 loginPasswordInput.value = '';
 logoutBtn.style.display = 'none';
 loginWrapper.style.display = 'flex';
 signupWrapper.style.display = 'none';
 addTodoWrapper.style.display = 'none';
 todoList.style.display = 'none';
})



sendBtn.addEventListener('click', () => {
  const newTodo: NewTodo = {
    title: todoTitle.value,
    description: todoText.value,
    due_date: todoDate.value
  };
addTodo(newTodo);
todoTitle.value = '';
todoText.value = '';
todoDate.value = '';
})

notLoggedInBtn.addEventListener('click', () => {
  loginWrapper.style.display = 'flex';
  signupWrapper.style.display = 'none';
})

notSignedBtn.addEventListener('click', () => {
  signupWrapper.style.display = 'flex';
  loginWrapper.style.display = 'none';
})





