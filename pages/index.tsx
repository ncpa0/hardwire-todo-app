import "hardwire-html-generator";

type TodoTask = {
  ID: string;
  Name: string;
  Done: boolean;
};

function EmptyListMessage() {
  return <h4 class="empty-list-message">List is empty</h4>;
}

const TodoList = $islandList<TodoTask[]>(
  {
    require: "todo",
    id: "todo-list",
    keyGetter: (t) => t.ID,
    fallback: <Spinner dark />,
  },
  (props, task) => {
    return <TodoEntryElement task={task} />;
  },
  (props, tasks) => {
    return (
      <If
        condition={(b) => b.equal(tasks.length, 0)}
        then={EmptyListMessage}
        else={() => <>{props.children}</>}
      />
    );
  },
);

const TodoForm = $action({
  method: "POST",
  action: "add-task",
  islands: [TodoList],
});

export default function App() {
  return (
    <Html
      nomorph
      headContent={<Style dirname={__dirname} path="./style.css" />}
    >
      <body class="al-center">
        <div id="main">
          <Switch id="root">
            <StaticRoute path="todos" title="Todo Tasks">
              <div class="task-list">
                <div class="add-task-form">
                  <h3>Add new task:</h3>
                  <TodoForm.Form class="row al-center">
                    <input
                      placeholder="Task Title"
                      id="Name"
                      name="Name"
                      type="text"
                      class="mgr-md"
                    />
                    <TodoForm.Submit class="btn-add-task">
                      <Spinner indicator />
                      <span class="no-onload">Add</span>
                    </TodoForm.Submit>
                  </TodoForm.Form>
                </div>
                <span class="separator" />
                <div class="pdt-bg">
                  <h3>Things to do:</h3>
                  <TodoList />
                </div>
              </div>
            </StaticRoute>
          </Switch>
        </div>
      </body>
    </Html>
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
    <div class="task-item row jst-sb al-center">
      <div class="row al-center">
        <ToggleTodoAction.QuickButton
          data={{ ID: task.ID }}
          items={[task.ID]}
          class="btn-toggle-task"
          title="Toggle task done"
        >
          <span>
            <Spinner indicator />
            <If
              condition={(b) => b.equal(task.Done, true)}
              then={() => <span class="symbol no-onload">✓</span>}
              else={() => <span class="symbol no-onload">𐄂</span>}
            />
          </span>
        </ToggleTodoAction.QuickButton>
        <span class="mgv-md">{task.Name}</span>
      </div>
      <RemoveTodoAction.QuickButton
        data={{ ID: task.ID }}
        items={[task.ID]}
        title="Remove the task from the list"
        class="btn-remove-task"
      >
        <Spinner indicator />
        <span class="no-onload">Remove</span>
      </RemoveTodoAction.QuickButton>
    </div>
  );
}

function Spinner(props: { dark?: boolean; indicator?: boolean }) {
  let className = "lds-ring";
  if (props.dark) {
    className += " dark";
  }
  if (props.indicator) {
    className += " indicator";
  }

  return (
    <div class={className}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
