package main

import (
	"context"
	"fmt"

	"github.com/hectormalot/omgo"
)

func main() {
	c, _ := omgo.NewClient()

	// Get the current weather for amsterdam
	loc, _ := omgo.NewLocation(52.3738, 4.8910)
	res, _ := c.CurrentWeather(context.Background(), loc, nil)
	fmt.Println("The temperature in Amsterdam is: ", res.Temperature)

	fmt.Println(res)
}
