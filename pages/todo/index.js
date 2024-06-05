const taskKey = '@tasks'

let selectedTaskId = null

// Função para adicionar tarefa
function addTask(event) {
  event.preventDefault() // Evita o recarregamento da página
  const taskId = new Date().getTime()
  const taskList = document.querySelector('#taskList')

  const form = document.querySelector('#taskForm')
  const formData = new FormData(form)

  const taskTitle = formData.get('title')
  const taskDescription = formData.get('description')

  const li = document.createElement('li')

  li.id = `id-${taskId}`
  li.innerHTML = `
    <div>
      <h2>${taskTitle}</h2>
      <p>${taskDescription}</p>
    </div>
    <button title="Editar tarefa" class="editButton" onClick="openEditDialog(${taskId})">✏️</button>
    <button title="Excluir tarefa" class="removeButton" onClick="removeTask(${taskId})">❌</button>
  `

  taskList.appendChild(li)

  // Salvar tarefas no localStorage
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || []
  tasks.push({
    id: taskId,
    title: taskTitle,
    description: taskDescription,
  })
  localStorage.setItem(taskKey, JSON.stringify(tasks))

  form.reset()
}

function openEditDialog(taskId) {
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || []

  selectedTaskId = tasks.findIndex((task) => task.id === taskId)
  const task = tasks[selectedTaskId]

  const dialog = document.querySelector('dialog')

  const editTitle = document.querySelector('#editTaskForm #title')
  const editDescription = document.querySelector('#editTaskForm #description')

  editTitle.value = task.title
  editDescription.value = task.description

  dialog.showModal()
}

function closeDialog() {
  const dialog = document.querySelector('dialog')
  dialog.close()
}

// Editar tarefas
function editTask() {
  const dialog = document.querySelector('dialog')
  const editTitle = document.querySelector('#editTaskForm #title').value
  const editDescription = document.querySelector('#editTaskForm #description').value

  let tasks = JSON.parse(localStorage.getItem(taskKey)) || []
  tasks[selectedTaskId].title = editTitle
  tasks[selectedTaskId].description = editDescription
  localStorage.setItem(taskKey, JSON.stringify(tasks))

  // Atualizar a tarefa na lista
  const taskElement = document.querySelector(`#id-${tasks[selectedTaskId].id}`)
  taskElement.querySelector('h2').innerText = editTitle
  taskElement.querySelector('p').innerText = editDescription

  dialog.close()
}

// Remover tarefas
function removeTask(taskId) {
  let tasks = JSON.parse(localStorage.getItem(taskKey)) || []
  tasks = tasks.filter(task => task.id !== taskId)
  localStorage.setItem(taskKey, JSON.stringify(tasks))

  // Remover a tarefa da lista
  const taskElement = document.querySelector(`#id-${taskId}`)
  taskElement.remove()
}

// Carregar tarefas do localStorage ao recarregar a página
window.addEventListener('DOMContentLoaded', () => {
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || []
  const taskList = document.querySelector('#taskList')

  taskList.innerHTML = tasks
    .map(
      (task) => `
      <li id='id-${task.id}'>
        <div>
          <h2>${task.title}</h2>
          <p>${task.description}</p>
        </div>
        <button title="Editar tarefa" class="editButton" onClick="openEditDialog(${task.id})">✏️</button>
        <button title="Excluir tarefa" class="removeButton" onClick="removeTask(${task.id})">❌</button>
      </li>
    `
    )
    .join('')
})
