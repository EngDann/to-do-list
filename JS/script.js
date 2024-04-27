// Seletores: Pegamos os elementos do DOM que vamos interagir frequentemente.
// Isso inclui formulários, inputs, e áreas onde as tarefas serão listadas ou filtradas.
const todo_form = document.querySelector("#todo-form");
const todo_input = document.querySelector("#todo-input");
const todo_list = document.querySelector("#todo-list");
const edit_form = document.querySelector("#edit-form");
const edit_input = document.querySelector("#edit-input");
const cancel_edit_btn = document.querySelector("#cancel-edit-btn");
const search_input = document.querySelector("#search-input");
const filter_btn = document.querySelector("#filter-select");

// Função para atualizar o localStorage. Aqui convertemos nossa lista de tarefas
// para uma string JSON e salvamos. Isso permite que as tarefas persistam entre as sessões do navegador.
const updateLocalStorage = () => {
    const todos = [];
    document.querySelectorAll(".todo").forEach((todo) => {
        const text = todo.querySelector("h3").textContent;
        const isDone = todo.classList.contains("done");
        todos.push({ text, isDone });
    });
    localStorage.setItem("todos", JSON.stringify(todos));
};

// Carrega as tarefas salvas no localStorage quando a página é carregada.
// Essa função é chamada quando o documento é totalmente carregado.
const loadTodos = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.forEach((todo) => {
        save_todo(todo.text, todo.isDone);
    });
};
document.addEventListener("DOMContentLoaded", loadTodos);

// Função para criar e adicionar uma nova tarefa na lista.
// Isso é usado tanto para tarefas recém-criadas quanto para carregar tarefas existentes.
const save_todo = (text, isDone = false) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");

    // Criamos os elementos internos da tarefa, incluindo o título, botões de ação, etc.
    const todo_title = document.createElement("h3");
    todo_title.textContent = text;
    todo.appendChild(todo_title);

    const btn_finish = document.createElement("button");
    btn_finish.classList.add("finish-todo");
    btn_finish.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(btn_finish);

    const btn_edit = document.createElement("button");
    btn_edit.classList.add("edit-todo");
    btn_edit.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(btn_edit);

    const btn_remove = document.createElement("button");
    btn_remove.classList.add("remove-todo");
    btn_remove.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(btn_remove);

    // Adicionamos a tarefa criada à lista de tarefas e limpamos o input.
    todo_list.appendChild(todo);
    todo_input.value = "";
    todo_input.focus();

    // Se a tarefa estiver marcada como concluída, refletimos isso na interface.
    if (isDone) {
        todo.classList.add("done");
    }
    updateLocalStorage();
};

// Evento para tratar a submissão do formulário de nova tarefa.
// Evitamos o comportamento padrão (recarregar a página) e adicionamos a tarefa.
todo_form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input_value = todo_input.value.trim();
    if (input_value) {
        save_todo(input_value);
    }
});

// Função para alternar a visibilidade dos formulários de adição e edição de tarefas.
// Isso nos permite ter uma melhor gestão do espaço na interface.
const toggle_forms = () => {
    edit_form.classList.toggle("hidden");
    todo_form.classList.toggle("hidden");
    todo_list.classList.toggle("hidden");
};

// Cancela a edição de uma tarefa e volta para a visão normal.
cancel_edit_btn.addEventListener("click", (e) => {
    e.preventDefault();
    toggle_forms();
});

// Atualiza uma tarefa existente com novas informações.
const update_todo = (edited_input) => {
    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) => {
        let todo_title = todo.querySelector("h3");
        if (todo_title.textContent === old_title_h3) {
            todo_title.textContent = edited_input;
        }
    });
    updateLocalStorage();
};

// Armazena temporariamente o título de uma tarefa antes de editá-la,
// para que possamos identificar qual tarefa estamos editando.
let old_title_h3;

// Eventos para lidar com a conclusão, edição e remoção de tarefas.
// Usamos a delegação de eventos para capturar cliques nos botões correspondentes.
document.addEventListener("click", (e) => {
    const target = e.target;
    const todoDiv = target.closest(".todo");
    if (!todoDiv) return;

    const todoTitle = todoDiv.querySelector("h3").textContent;

    if (target.classList.contains("finish-todo")) {
        todoDiv.classList.toggle("done");
        updateLocalStorage();
    } else if (target.classList.contains("edit-todo")) {
        toggle_forms();
        edit_input.value = todoTitle;
        old_title_h3 = todoTitle;
    } else if (target.classList.contains("remove-todo")) {
        todoDiv.remove();
        updateLocalStorage();
    }
});

// Salva as alterações feitas a uma tarefa existente.
edit_form.addEventListener("submit", (e) => {
    e.preventDefault();
    const editedValue = edit_input.value.trim();
    if (editedValue) {
        update_todo(editedValue);
        toggle_forms();
    }
});

// Filtra as tarefas em tempo real conforme o usuário digita na caixa de busca.
search_input.addEventListener("input", () => {
    const searchValue = search_input.value.toLowerCase();
    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) => {
        const text = todo.querySelector("h3").textContent.toLowerCase();
        const matches = text.includes(searchValue);
        todo.style.display = matches ? "" : "none";
    });
});

// Permite ao usuário filtrar as tarefas com base no seu estado (todas, concluídas, pendentes).
filter_btn.addEventListener("change", () => {
    const filterValue = filter_btn.value;
    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) => {
        switch (filterValue) {
            case "all":
                todo.style.display = "";
                break;
            case "done":
                todo.style.display = todo.classList.contains("done")
                    ? ""
                    : "none";
                break;
            case "todo":
                todo.style.display = !todo.classList.contains("done")
                    ? ""
                    : "none";
                break;
        }
    });
});
