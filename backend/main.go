package main

import (
	"log"
	"net/http"
	"skeleton/api"
)

func main() {
	server := api.Server{}
  http.HandleFunc("/get-skeletaltype", server.HandleGet)
  http.HandleFunc("/get-image", server.HandleGetImage)
  log.Fatal(http.ListenAndServe(":8080", nil))
}
