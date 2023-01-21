package api

import (
    "database/sql"
    "log"
    "net/http"
    _ "github.com/lib/pq"
)

type Server struct {
    Db *sql.DB
}

func HandleQueryError(queryRrror error, w http.ResponseWriter) (int) {
    httpStatus := 200
    if queryRrror != nil {
        log.Println("[ERROR]", queryRrror)
        httpStatus = http.StatusBadRequest
        w.WriteHeader(httpStatus)
    }
    return httpStatus
}
