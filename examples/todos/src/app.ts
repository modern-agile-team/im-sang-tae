/**
 * Author: SoonKi Min (alstnsrl98@gmail.com)
 * License: MIT
 * Created On Tue May 30 2023
 **/

import { defaultStateManger } from "im-sang-tae";

import { todoList } from "./atoms";

const TextInput = document.getElementById("text-input") as HTMLInputElement;
const AddButton = document.getElementById("add-button") as HTMLButtonElement;
const TodoWrapper = document.querySelector(".todo-wrapper");

const [getTodo, setTodo] = defaultStateManger.atomState(todoList);

let text = "";

if (TextInput && AddButton) {
  TextInput.onchange = (ev) => {
    const target = ev.target as HTMLInputElement;
    text = target.value;
    TextInput.value = text;
  };

  AddButton.onclick = () => {
    if (text === "") return;
    const currentTodoList = getTodo();
    setTodo([...currentTodoList, { key: currentTodoList.length, value: text, checked: false }]);
    TextInput.value = "";
    text = "";
  };

  defaultStateManger.subscribe(todoList, () => {
    if (!TodoWrapper) return;
    TodoWrapper.innerHTML = "";
    const currentTodoList = getTodo();
    currentTodoList.forEach((todoItem) => {
      const TodoItem = document.createElement("li");
      TodoItem.innerHTML = `
      <span>${todoItem.value}</span> 
      <input id=${todoItem.key} type="checkbox" checked=${todoItem.checked} value=${todoItem.checked}/>
      `;
      TodoWrapper.appendChild(TodoItem);
    });
  });
}
