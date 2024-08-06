import "hardwire-html-generator";

type TodoTask = {
  ID: string;
  Name: string;
  Done: boolean;
};

const TodoList = $islandList<TodoTask[]>(
  { require: "todo", id: "todo-list", keyGetter: (t) => t.ID },
  (props, task) => {
    return <TodoEntryElement task={task} />;
  },
);

const TodoForm = $action({
  method: "POST",
  action: "add-task",
  islands: [TodoList],
});

export default function App() {
  return (
    <>
      {"<!DOCTYPE html>"}
      <html>
        <Head>
          <Style dirname={__dirname} path="./style.css" />
        </Head>
        <body class="al-center">
          <div id="main">
            <Switch id="root">
              <StaticRoute path="todos" title="Todo Tasks">
                <div>
                  <h3>Add new task:</h3>
                  <TodoForm.Form class="row">
                    <label for="Name" class="pdr-md">
                      Name:
                    </label>
                    <input id="Name" name="Name" type="text" class="pdr-md" />
                    <TodoForm.Submit>Add</TodoForm.Submit>
                  </TodoForm.Form>
                </div>
                <div class="pdt-bg">
                  <TodoList />
                </div>
              </StaticRoute>
            </Switch>
          </div>
        </body>
      </html>
    </>
  );
}

const ToggleTodoAction = $action({
  method: "POST",
  action: "toggle-task",
  islands: [TodoList],
});

const RemoveTodoAction = $action({
  method: "DELETE",
  action: "remove-task",
  islands: [TodoList],
});

function TodoEntryElement(props: { task: StructProxy<TodoTask> }) {
  const { task } = props;
  return (
    <div class="row">
      <span class="pdr">{task.Name}</span>
      <ToggleTodoAction.QuickButton data={{ ID: task.ID }} items={[task.ID]}>
        <If
          condition={(b) => b.equal(task.Done, true)}
          then={() => <input type="checkbox" checked />}
          else={() => <input type="checkbox" />}
        />
      </ToggleTodoAction.QuickButton>
      <RemoveTodoAction.QuickButton data={{ ID: task.ID }} items={[task.ID]}>
        Remove
      </RemoveTodoAction.QuickButton>
    </div>
  );
}
