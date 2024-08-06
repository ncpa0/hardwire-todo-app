package main

import (
	"github.com/labstack/echo/v4"
	hw "github.com/ncpa0/hardwire"
)

func main() {
	hw.Configure(&hw.Configuration{
		Entrypoint: "./pages/index.tsx",
		HtmlDir:    "./views",
		StaticDir:  "./static",
		StaticURL:  "/static",
		Caching:    &hw.CachingConfig{},
		CleanBuild: true,
		DebugMode:  true,
	})

	registerResources()
	registerActions()

	server := echo.New()

	server.GET("/", func(ctx echo.Context) error {
		return ctx.Redirect(303, "/todos")
	})
	err := hw.Start(server)

	if err != nil {
		server.Logger.Fatal(err)
		return
	}

	server.Logger.Fatal(server.Start(":8080"))
}
