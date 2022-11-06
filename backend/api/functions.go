package api

import (
  "fmt"
  "encoding/json"
  "io/ioutil"
  "net/http"
)

type Server struct {
}

type Response struct {
  Message string `json:"message"`
}

func (s *Server) HandleGet(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Access-Control-Allow-Headers", "*")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  w.Header().Set( "Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS" )
  response := Response{Message: "ナチュラル"}
  responseJson, err := json.Marshal(response)
  if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
  }

  w.Header().Set("Content-Type", "application/json")
  w.Write(responseJson)
}

func (s *Server) HandleGetImage(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Access-Control-Allow-Headers", "*")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  w.Header().Set( "Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS" )
  imageBytes, err := ioutil.ReadFile("api/data/images/Natural_T_Shirt.png")
  if err != nil {
      fmt.Println("[ERROR]", err)
  }
  w.Header().Set("Content-Type", "image/png")
  w.Write(imageBytes)
}
