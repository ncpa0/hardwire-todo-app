package main

import (
	"math/rand"
	"strconv"

	hw "github.com/ncpa0/hardwire"
)

type CreateTodoTaskData struct {
	Name string
}

type ToggleTodoTaskData struct {
	ID string
}

func registerActions() {
	hw.PostAction("add-task", func(body *CreateTodoTaskData, ctx *hw.ActionContext) error {
		randID := rand.Int63()
		tasks.AddTask(&TodoTask{
			ID:   strconv.FormatInt(randID, 10),
			Name: body.Name,
			Done: false,
		})
		return nil
	})

	hw.PostAction("toggle-task", func(body *ToggleTodoTaskData, ctx *hw.ActionContext) error {
		id := body.ID
		tasks.ToggleTask(id)
		return nil
	})

	hw.DeleteAction("remove-task", func(body *ToggleTodoTaskData, ctx *hw.ActionContext) error {
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
}
