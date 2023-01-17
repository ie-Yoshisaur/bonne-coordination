package api

import (
    "crypto/rand"
    "crypto/sha256"
    "database/sql"
    "encoding/base64"
    "encoding/json"
    "fmt"
    "log"
    "math/big"
    "net/http"
    "time"
    "strings"
    "github.com/dgrijalva/jwt-go"
    _ "github.com/lib/pq"
)

type Server struct {
    Db *sql.DB
}

type SignUpRequest struct {
    Name                   string `json:"name"`
    Password               string `json:"password"`
    PasswordConfirmination string `json:"passwordConfirmination"`
}

type SignUpResponse struct {
    Name string `json:"name"`
}

type SignInRequest struct {
    Name                   string `json:"name"`
    Password               string `json:"password"`
}

type SignInResponse struct {
    Name string `json:"name"`
    DoesHaveSkeletalType bool `json:"doesHaveSkeletalType"`
    SkeletalType string `json:"skeletalType"`
}

type SkeletalTypeRequest struct {
    Gender string `json:"gender"`
    BodyImpression string `json:"bodyImpression"`
    FingerJointSize string `json:"fingerJointSize"`
    WristShape string `json:"wristShape"`
    WristAnkcle string `json:"wristAnkcle"`
    ClavicleImpression string `json:"clavicleImpression"`
    KneecapImpression string `json:"kneecapImpression"`
    UnsuitableClothe string `json:"unsuitableClothe"`
}

type SkeletalTypeResponse struct {
    SkeletalType string `json:"skeletalType"`
}

type Claims struct {
    Name string
    jwt.StandardClaims
}

var charset62 = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

var jwtKey = []byte(RandomString(511))

func RandomString(length int) string {
    randomString := make([]rune, length)
    for i := range randomString {
        randomNumber, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset62))))
        if err != nil {
            log.Println(err)
            return ""
        }
        randomString[i] = charset62[int(randomNumber.Int64())]
    }
    return string(randomString)
}

func SetJwtInCookie(w http.ResponseWriter, userName string) {
    expirationTime := time.Now().Add(672 * time.Hour)
    claims := &Claims{
        Name: userName,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    tokenString, err := token.SignedString(jwtKey)
    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        return
    }
    cookie := &http.Cookie{
        Name:    "token",
        Value:   tokenString,
        Expires: expirationTime,
    }
    http.SetCookie(w, cookie)
}

func LoadClaimsFromJwt (w http.ResponseWriter, r *http.Request) (*Claims) {
    c, err := r.Cookie("token")
    if err != nil {
        if err == http.ErrNoCookie {
            w.WriteHeader(http.StatusUnauthorized)
            return &Claims{}
        }
        w.WriteHeader(http.StatusBadRequest)
        return &Claims{}
    }

    tknStr := c.Value
    claims := &Claims{}
    tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (interface{}, error) {
        return jwtKey, nil
    })
    if err != nil {
        if err == jwt.ErrSignatureInvalid {
            w.WriteHeader(http.StatusUnauthorized)
            return &Claims{}
        }
        w.WriteHeader(http.StatusBadRequest)
        return &Claims{}
    }
    if !tkn.Valid {
        w.WriteHeader(http.StatusUnauthorized)
        return &Claims{}
    }
    return claims
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
    queryToReGisterUser := fmt.Sprintf("INSERT INTO users (name, password_hash) VALUES (TRIM('%s'), TRIM('%s'))", signUpRequest.Name, passwordHashURLSafe)
    _, queryRrror := s.Db.Exec(queryToReGisterUser)
    if queryRrror != nil {
        log.Println("[ERROR]", queryRrror)
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
        log.Fatalf("Error happened in JSON marshal. Err: %s", err)
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    w.Write(jsonResponse)
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
    query := fmt.Sprintf("SELECT password_hash, does_have_skeletal_type, skeletal_type FROM users WHERE name = TRIM('%s')", signInRequest.Name)
    var correctPasswordHashURLSafe string
    var doesHaveSkeletalType bool
    var skeletalType string
    if queryError := s.Db.QueryRow(query).Scan(&correctPasswordHashURLSafe, &doesHaveSkeletalType, &skeletalType); queryError != nil {
        log.Println("[ERROR]", queryError)
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    correctPasswordHashURLSafe = strings.TrimRight(correctPasswordHashURLSafe, " ")
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
        log.Fatalf("Error happened in JSON marshal. Err: %s", err)
    }
    w.Write(jsonResponse)
}

func (s *Server) SignInWithJwt(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodGet {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    claims := LoadClaimsFromJwt(w, r)
    query := fmt.Sprintf("SELECT does_have_skeletal_type, skeletal_type FROM users WHERE name = TRIM('%s')", claims.Name)
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
        log.Fatalf("Error happened in JSON marshal. Err: %s", err)
    }
    w.Write(jsonResponse)
}

func (s *Server) GetSkeletalType(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    var skeletalTypeRequest SkeletalTypeRequest
    decoder := json.NewDecoder(r.Body)
    decodeError := decoder.Decode(&skeletalTypeRequest)
    if decodeError != nil {
        log.Println("[ERROR]", decodeError)
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    if skeletalTypeRequest.Gender != "男性" && skeletalTypeRequest.Gender != "女性" {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    straightScore := 0
    waveScore := 0
    naturalScore := 0
    if skeletalTypeRequest.BodyImpression == "厚みがあり、肉厚的" {
        straightScore += 1
    } else if skeletalTypeRequest.BodyImpression == "厚みは少なく、すらりとしている" {
        waveScore += 1
    } else if skeletalTypeRequest.BodyImpression == "骨や筋が目立つ" {
        naturalScore += 1
    } else {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    if skeletalTypeRequest.FingerJointSize == "小さめ" {
        straightScore += 1
    } else if skeletalTypeRequest.FingerJointSize == "ふつう" {
        waveScore += 1
    } else if skeletalTypeRequest.FingerJointSize == "大きい" {
        naturalScore += 1
    } else {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    if skeletalTypeRequest.WristShape == "断面にすると丸に近い形" {
        straightScore += 1
    } else if skeletalTypeRequest.WristShape == "幅が広くてうすく、断面にすると平べったい形" {
        waveScore += 1
    } else if skeletalTypeRequest.WristShape == "骨が目立ち、しっかりしている" {
        naturalScore += 1
    } else {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    if skeletalTypeRequest.WristAnkcle == "ほとんど見えないくらい小さい" {
        straightScore += 1
    } else if skeletalTypeRequest.WristAnkcle == "ふつうに見える程度の大きさ" {
        waveScore += 1
    } else if skeletalTypeRequest.WristAnkcle == "とてもはっきり出ている、または大きい" {
        naturalScore += 1
    } else {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    if skeletalTypeRequest.ClavicleImpression == "ほとんど見えないくらい小さい" {
        straightScore += 1
    } else if skeletalTypeRequest.ClavicleImpression == "見えるが細め" {
        waveScore += 1
    } else if skeletalTypeRequest.ClavicleImpression == "大きくしっかりしている" {
        naturalScore += 1
    } else {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    if skeletalTypeRequest.KneecapImpression == "小さめで、あまり存在感がない" {
        straightScore += 1
    } else if skeletalTypeRequest.KneecapImpression == "中くらいの大きさ、触ると前に出ている" {
        waveScore += 1
    } else if skeletalTypeRequest.KneecapImpression == "大きい" {
        naturalScore += 1
    } else {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    if skeletalTypeRequest.UnsuitableClothe == "スキニーパンツ" {
        straightScore += 1
    } else if skeletalTypeRequest.UnsuitableClothe == "革ジャケット" {
        waveScore += 1
    } else if skeletalTypeRequest.UnsuitableClothe == "無地の小さめのTシャツ" {
        naturalScore += 1
    } else {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    var skeletalType string
    if straightScore > waveScore && straightScore > naturalScore {
        skeletalType = "ストレート"
    } else if waveScore > straightScore && waveScore > naturalScore {
        skeletalType = "ウェーブ"
    } else {
        skeletalType = "ナチュラル"
    }
    queryToUpdateSkeletalTypeAndGender := fmt.Sprintf("UPDATE users SET does_have_skeletal_type = TRUE, gender = TRIM('%s'), skeletal_type = TRIM('%s')", skeletalTypeRequest.Gender, skeletalType)
    _, queryRrror := s.Db.Exec(queryToUpdateSkeletalTypeAndGender)
    if queryRrror != nil {
        log.Println("[ERROR]", queryRrror)
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    response := SkeletalTypeResponse{SkeletalType: skeletalType}
    responseJson, err := json.Marshal(response)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.Write(responseJson)
}
