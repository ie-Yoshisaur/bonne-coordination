package api

import (
    "crypto/rand"
    "log"
    "math/big"
    "net/http"
    "time"
    "github.com/dgrijalva/jwt-go"
)

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

func LoadClaimsFromJwt (w http.ResponseWriter, r *http.Request) (*Claims, int) {
    httpStatus := 200
    c, err := r.Cookie("token")
    if err != nil {
        if err == http.ErrNoCookie {
            httpStatus = http.StatusUnauthorized
            w.WriteHeader(httpStatus)
            return &Claims{}, httpStatus
        }
        httpStatus = http.StatusBadRequest
        w.WriteHeader(httpStatus)
        return &Claims{}, httpStatus
    }

    tknStr := c.Value
    claims := &Claims{}
    tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (interface{}, error) {
        return jwtKey, nil
    })
    if err != nil {
        if err == jwt.ErrSignatureInvalid {
            httpStatus = http.StatusUnauthorized
            w.WriteHeader(httpStatus)
            return &Claims{}, httpStatus
        }
        httpStatus = http.StatusBadRequest
        w.WriteHeader(httpStatus)
        return &Claims{}, httpStatus
    }
    if !tkn.Valid {
        httpStatus = http.StatusUnauthorized
        w.WriteHeader(httpStatus)
        return &Claims{}, httpStatus
    }
    return claims, httpStatus
}
