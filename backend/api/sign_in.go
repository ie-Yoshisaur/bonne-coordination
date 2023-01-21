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
    DoesHaveSkeletalType bool `json:"doesHaveSkeletalType"`
    SkeletalType string `json:"skeletalType"`
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
    query := fmt.Sprintf("SELECT password_hash, does_have_skeletal_type, skeletal_type FROM users WHERE name = '%s'", signInRequest.Name)
    var correctPasswordHashURLSafe string
    var doesHaveSkeletalType bool
    var skeletalType string
    queryError := s.Db.QueryRow(query).Scan(&correctPasswordHashURLSafe, &doesHaveSkeletalType, &skeletalType)
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
        DoesHaveSkeletalType: doesHaveSkeletalType,
        SkeletalType: skeletalType,
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
    query := fmt.Sprintf("SELECT does_have_skeletal_type, skeletal_type FROM users WHERE name = '%s'", claims.Name)
    var doesHaveSkeletalType bool
    var skeletalType string
    if queryError := s.Db.QueryRow(query).Scan(&doesHaveSkeletalType, &skeletalType); queryError != nil {
        log.Println("[ERROR]", queryError)
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    response := SignInResponse{
        Name: claims.Name,
        DoesHaveSkeletalType: doesHaveSkeletalType,
        SkeletalType: skeletalType,
    }
    jsonResponse, err := json.Marshal(response)
    if err != nil {
        log.Println("Error happened in JSON marshal", err)
    }
    w.Write(jsonResponse)
}
