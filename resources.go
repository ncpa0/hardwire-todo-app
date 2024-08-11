package main

import (
	"math/rand"
	"strconv"
	"sync"

	hw "github.com/ncpa0/hardwire"
)

type TodoTask struct {
	ID   string
	Name string
	Done bool
}

type TodoController struct {
	Tasks []*TodoTask
	mx    sync.Mutex
}

var tasks = &TodoController{
	Tasks: []*TodoTask{},
}

func (c *TodoController) Count() int {
	return len(c.Tasks)
}

func (c *TodoController) AddTask(task *TodoTask) {
	c.mx.Lock()
	defer c.mx.Unlock()

	c.Tasks = append(c.Tasks, task)
}

func (c *TodoController) ToggleTask(id string) {
	c.mx.Lock()
	defer c.mx.Unlock()

	for _, task := range c.Tasks {
		if task.ID == id {
			task.Done = !task.Done
			break
		}
	}
}

func (c *TodoController) RemoveTask(id string) {
	c.mx.Lock()
	defer c.mx.Unlock()

	for i, task := range c.Tasks {
		if task.ID == id {
			c.Tasks = append(c.Tasks[:i], c.Tasks[i+1:]...)
			break
		}
	}
}

func (c *TodoController) GetTaskList() []TodoTask {
	c.mx.Lock()
	defer c.mx.Unlock()

	copy := make([]TodoTask, len(c.Tasks))

	for i, task := range c.Tasks {
		copy[i] = *task
	}

	return copy
}

type CreateTodoTaskData struct {
	Name string
}

type ToggleTodoTaskData struct {
	ID string
}

type TodoResource struct{}

func (todos TodoResource) Get(ctx *hw.DynamicRequestContext) (interface{}, error) {
	return tasks.GetTaskList(), nil
}

func registerResources() {
	todos := hw.ResourceReg.Register("todo", TodoResource{})

	hw.RegisterPostAction(todos, "add", func(body *CreateTodoTaskData, ctx *hw.ActionContext) error {
		randID := rand.Int63()
		tasks.AddTask(&TodoTask{
			ID:   strconv.FormatInt(randID, 10),
			Name: body.Name,
			Done: false,
		})
		return nil
	})

	hw.RegisterDeleteAction(todos, "remove", func(body *ToggleTodoTaskData, ctx *hw.ActionContext) error {
		id := body.ID
		tasks.RemoveTask(id)
		if tasks.Count() == 0 {
			// usually remove will onle delete the item from the list,
			// forcing re-render of the whole list if the count reaches zero,
			// so that the "empty list" message is put in
			ctx.UpdateIslands("todo-list")
		}
		return nil
	})

	hw.RegisterPatchAction(todos, "toggle", func(body *ToggleTodoTaskData, ctx *hw.ActionContext) error {
		id := body.ID
		tasks.ToggleTask(id)
		return nil
	})
}
