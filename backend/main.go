package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"skeleton/api"
)

const (
	host     = "db"
	port     = 5432
	user     = "postgres"
	password = "postgres"
	dbname   = "postgres"
)

func main() {
	postqreslInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)
	db, err := sql.Open("postgres", postqreslInfo)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	server := api.Server{Db: db}
	http.HandleFunc("/get-skeletaltype", server.HandleGet)
	http.HandleFunc("/get-image", server.HandleGetImage)
	http.HandleFunc("/sign-up", server.SignUp)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
