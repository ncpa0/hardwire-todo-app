package main

import (
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

func registerResources() {
	hw.ResourceProvider.GET(
		"todo",
		func(ctx *hw.DynamicRequestContext) (interface{}, error) {
			return tasks.GetTaskList(), nil
		},
	)
}
