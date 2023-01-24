package api

import (
    "crypto/sha256"
    "encoding/base64"
    "encoding/json"
    "log"
    "net/http"
)

type SignUpRequest struct {
    Name                   string `json:"name"`
    Password               string `json:"password"`
    PasswordConfirmination string `json:"passwordConfirmination"`
}

type SignUpResponse struct {
    Name string `json:"name"`
}

func (s *Server) SignUp(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    var signUpRequest SignUpRequest
    decoder := json.NewDecoder(r.Body)
    decodeError := decoder.Decode(&signUpRequest)
    if decodeError != nil {
        log.Println("[ERROR]", decodeError)
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    if signUpRequest.Password == "" {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    if signUpRequest.Password != signUpRequest.PasswordConfirmination {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    passwordHash32Byte := sha256.Sum256([]byte(signUpRequest.Password))
    passwordHashURLSafe := base64.URLEncoding.EncodeToString(passwordHash32Byte[:])
    _, queryRrror := s.Db.Exec("INSERT INTO users (name, password_hash) VALUES ( $1,  $2);", signUpRequest.Name, passwordHashURLSafe)
    if queryRrror != nil {
        log.Println("[QUERY ERROR]", queryRrror)
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    SetJwtInCookie(w, signUpRequest.Name)
    w.Header().Set("Content-Type", "application/json")
    response := SignUpResponse{
        Name: signUpRequest.Name,
    }
    jsonResponse, err := json.Marshal(response)
    if err != nil {
        log.Println("Error happened in JSON marshal", err)
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    w.Write(jsonResponse)
}
