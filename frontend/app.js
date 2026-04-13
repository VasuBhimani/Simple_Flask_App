const API_URL = "http://<ALB-DNS>/tasks";

async function createTask() {
  const title = document.getElementById("taskInput").value;

  await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ title })
  });

  loadTasks();
}

async function loadTasks() {
  const res = await fetch(API_URL);
  const data = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  data.forEach(task => {
    const li = document.createElement("li");
    li.innerText = task.title;

    const del = document.createElement("button");
    del.innerText = "Delete";
    del.onclick = () => deleteTask(task.task_id);

    li.appendChild(del);
    list.appendChild(li);
  });
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadTasks();
}

loadTasks();