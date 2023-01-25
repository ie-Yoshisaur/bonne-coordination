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
	user     = "postgres"
	password = "postgres"
	dbname   = "postgres"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	postqreslInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)
	db, err := sql.Open("postgres", postqreslInfo)
	if err != nil {
		log.Fatal(err)
	}
	err=db.Ping()
	if err != nil {
		log.Println(postqreslInfo)
		log.Fatal(err)
	}

	defer db.Close()
	server := api.Server{Db: db}
	http.HandleFunc("/get-bodytype", server.GetBodyType)
	http.HandleFunc("/sign-up", server.SignUp)
	http.HandleFunc("/sign-in", server.SignIn)
	http.HandleFunc("/sign-in-with-jwt", server.SignInWithJwt)
	http.HandleFunc("/get-coordination", server.GetCoordination)
	http.HandleFunc("/add-purchased-clothe", server.AddPurchasedClothe)
	http.HandleFunc("/add-liked-clothe", server.AddLikedClothe)
	http.HandleFunc("/add-disliked-clothe", server.AddDislikedClothe)
	http.HandleFunc("/delete-purchased-clothe", server.DeletePurchasedClothe)
	http.HandleFunc("/delete-liked-clothe", server.DeleteLikedClothe)
	http.HandleFunc("/delete-disliked-clothe", server.DeleteDislikedClothe)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
