import "hardwire-html-generator";

type TodoTask = {
  ID: string;
  Name: string;
  Done: boolean;
};

const TodoList = $island<TodoTask[]>(
  { require: "todo", id: "todo-list" },
  (props, data) => {
    return data.map((task) => <TodoEntryElement task={task} />);
  },
);

const TodoForm = createFormAction("POST", "add-task", [TodoList]);

export default function App() {
  return (
    <html>
      <Head></Head>
      <body>
        <div id="main">
          <Switch id="root">
            <StaticRoute path="todos" title="Todo Tasks">
              <div>
                <h3>Add new task:</h3>
                <TodoForm.Form>
                  <label for="Name">Name:</label>
                  <input id="Name" name="Name" type="text" />
                  <TodoForm.Submit>Add</TodoForm.Submit>
                </TodoForm.Form>
              </div>
              <TodoList />
            </StaticRoute>
          </Switch>
        </div>
      </body>
    </html>
  );
}

const ToggleTodoElement = createFormAction("POST", "toggle-task", [TodoList]);

function TodoEntryElement(props: { task: StructProxy<TodoTask> }) {
  const { task } = props;
  return (
    <div>
      <span>{task.Name}</span>
      <ToggleTodoElement.Form
        data={{
          ID: task.ID,
        }}
      >
        <ToggleTodoElement.Submit>
          <If
            condition={(b) => b.equal(task.Done, true)}
            then={() => <input type="checkbox" checked />}
            else={() => <input type="checkbox" />}
          />
        </ToggleTodoElement.Submit>
      </ToggleTodoElement.Form>
    </div>
  );
}
