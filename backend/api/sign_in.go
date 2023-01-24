package api

import (
    "crypto/sha256"
    "encoding/base64"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
)

type SignInRequest struct {
    Name                   string `json:"name"`
    Password               string `json:"password"`
}

type SignInResponse struct {
    Name string `json:"name"`
    DoesHaveBodyType bool `json:"doesHaveBodyType"`
    BodyType string `json:"bodyType"`
}

func (s *Server) SignIn(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    var signInRequest SignInRequest
    decoder := json.NewDecoder(r.Body)
    decodeError := decoder.Decode(&signInRequest)
    if decodeError != nil {
        log.Println("[ERROR]", decodeError)
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    passwordHash32Byte := sha256.Sum256([]byte(signInRequest.Password))
    passwordHashURLSafe := base64.URLEncoding.EncodeToString(passwordHash32Byte[:])
    query := fmt.Sprintf("SELECT password_hash, does_have_body_type, body_type FROM users WHERE name = '%s'", signInRequest.Name)
    var correctPasswordHashURLSafe string
    var doesHaveBodyType bool
    var bodyType string
    queryError := s.Db.QueryRow(query).Scan(&correctPasswordHashURLSafe, &doesHaveBodyType, &bodyType)
    httpStatus := HandleQueryError(queryError, w)
    if httpStatus != 200 {
        return
    }
    if passwordHashURLSafe != correctPasswordHashURLSafe {
        w.WriteHeader(http.StatusUnauthorized)
        return
    }
    SetJwtInCookie(w, signInRequest.Name)
    w.Header().Set("Content-Type", "application/json")
    response := SignInResponse{
        Name: signInRequest.Name,
        DoesHaveBodyType: doesHaveBodyType,
        BodyType: bodyType,
    }
    jsonResponse, err := json.Marshal(response)
    if err != nil {
        log.Println("Error happened in JSON marshal", err)
    }
    w.Write(jsonResponse)
}

func (s *Server) SignInWithJwt(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodGet {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    claims, httpStatus := LoadClaimsFromJwt(w, r)
    if httpStatus != 200 {
        return
    }
    query := fmt.Sprintf("SELECT does_have_body_type, body_type FROM users WHERE name = '%s'", claims.Name)
    var doesHaveBodyType bool
    var bodyType string
    if queryError := s.Db.QueryRow(query).Scan(&doesHaveBodyType, &bodyType); queryError != nil {
        log.Println("[ERROR]", queryError)
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    response := SignInResponse{
        Name: claims.Name,
        DoesHaveBodyType: doesHaveBodyType,
        BodyType: bodyType,
    }
    jsonResponse, err := json.Marshal(response)
    if err != nil {
        log.Println("Error happened in JSON marshal", err)
    }
    w.Write(jsonResponse)
}
