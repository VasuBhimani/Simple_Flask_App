// const API_URL = "http://simple-flask-app-prod-alb-1872300889.us-east-1.elb.amazonaws.com/tasks";
const API_URL = "http://simple-flask-app-prod-alb-1626971328.us-east-1.elb.amazonaws.com/tasks";

async function createTask() {
  const title = document.getElementById("taskInput").value;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  loadTasks();
}

async function loadTasks() {
  const res = await fetch(API_URL);
  const data = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  data.forEach((task) => {
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
