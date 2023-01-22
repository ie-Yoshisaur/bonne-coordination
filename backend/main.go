package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"skeleton/api"
)

const (
	host     = "db"
	port     = 5432
)

var (
	user     = os.Getenv("POSTGRES_USER")
	password = os.Getenv("POSTGRES_PASSWORD")
	dbname   = os.Getenv("POSTGRES_DB")
)

func main() {
	postqreslInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)
	db, err := sql.Open("postgres", postqreslInfo)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	server := api.Server{Db: db}
	http.HandleFunc("/get-skeletaltype", server.GetSkeletalType)
	http.HandleFunc("/sign-up", server.SignUp)
	http.HandleFunc("/sign-in", server.SignIn)
	http.HandleFunc("/sign-in-with-jwt", server.SignInWithJwt)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
