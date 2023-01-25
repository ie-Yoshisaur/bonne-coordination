package api

import (
	"encoding/json"
	"net/http"
)

type ClotheInfo struct {
    Name       string `json:"name"`
    Price      int    `json:"price"`
    Brand      string `json:"brand"`
    ImageURL   string `json:"imageURL"`
    SaleSiteURL string `json:"saleSiteURL"`
}

func (s *Server)GetUserInfo(name string) (gender string, bodyType string, err error) {
    err = s.Db.QueryRow("SELECT gender, body_type FROM users WHERE name = $1", name).Scan(&gender, &bodyType)
    return
}

func (s *Server)GetRandomClotheInfo(userName string, clotheType string) (name string, price int, brand string, imageURL string, saleSiteURL string, err error) {
    var gender string
    var bodyType string
    gender, bodyType, err = s.GetUserInfo(userName)
    if err != nil {
        return
    }

    err = s.Db.QueryRow("SELECT name, price, brand, image_url, sale_site_url FROM clothes WHERE gender = $1 AND body_type = $2 AND clothe_type = $3 AND id NOT IN (SELECT clothe_id FROM disliked_clothes WHERE user_id = (SELECT id FROM users WHERE name = $4)) ORDER BY random() LIMIT 1", gender, bodyType, clotheType, userName).Scan(&name, &price, &brand, &imageURL, &saleSiteURL)
    return
}

func (s *Server) GetRandomClotheSet(userName string)([]*ClotheInfo, error) {
    clotheTypes := []string{"アウター", "トップス", "パンツ", "シューズ", "グッズ"}
    var infoList []*ClotheInfo
    for _, clotheType := range clotheTypes {
        name, price, brand, imageURL, saleSiteURL, err := s.GetRandomClotheInfo(userName, clotheType)
        if err != nil {
            return nil, err
        }
        info := &ClotheInfo{
            Name:       name,
            Price:      price,
            Brand:      brand,
            ImageURL:   imageURL,
            SaleSiteURL: saleSiteURL,
        }
        infoList = append(infoList, info)
    }
    return infoList, nil
}

func (s *Server)GetCoordination(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodGet {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    claims, httpStatus := LoadClaimsFromJwt(w, r)
    if httpStatus != 200 {
        return
    }
    userName := claims.Name

    set, err := s.GetRandomClotheSet(userName)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    var purchased []*ClotheInfo
    rows, err := s.Db.Query("SELECT name, price, brand, image_url, sale_site_url FROM clothes WHERE id IN (SELECT clothe_id FROM purchased_clothes WHERE user_id = (SELECT id FROM users WHERE name = $1))", userName)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()
    for rows.Next() {
        var purchasedClothe ClotheInfo
        err := rows.Scan(&purchasedClothe.Name, &purchasedClothe.Price, &purchasedClothe.Brand, &purchasedClothe.ImageURL, &purchasedClothe.SaleSiteURL)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        purchased = append(purchased, &purchasedClothe)
    }

    var liked []*ClotheInfo
    rows, err = s.Db.Query("SELECT name, price, brand, image_url, sale_site_url FROM clothes WHERE id IN (SELECT clothe_id FROM liked_clothes WHERE user_id = (SELECT id FROM users WHERE name = $1))", userName)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()
    for rows.Next() {
        var likedClothe ClotheInfo
        err := rows.Scan(&likedClothe.Name, &likedClothe.Price, &likedClothe.Brand, &likedClothe.ImageURL, &likedClothe.SaleSiteURL)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        liked = append(liked, &likedClothe)
    }

    var disliked []*ClotheInfo
    rows, err = s.Db.Query("SELECT name, price, brand, image_url, sale_site_url FROM clothes WHERE id IN (SELECT clothe_id FROM disliked_clothes WHERE user_id = (SELECT id FROM users WHERE name = $1))", userName)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()
    for rows.Next() {
        var dislikedClothe ClotheInfo
        err := rows.Scan(&dislikedClothe.Name, &dislikedClothe.Price, &dislikedClothe.Brand, &dislikedClothe.ImageURL, &dislikedClothe.SaleSiteURL)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        disliked = append(disliked, &dislikedClothe)
    }
    res := map[string]interface{}{
        "set": set,
        "purchased": purchased,
        "liked": liked,
        "disliked": disliked,
    }

    json, err := json.Marshal(res)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.Write(json)
}

func (s *Server)AddPurchasedClothe(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    claims, httpStatus := LoadClaimsFromJwt(w, r)
    if httpStatus != 200 {
        return
    }
    userName := claims.Name
    clotheName := r.FormValue("clothe_name")

    // Get user_id
    var userID int
    err := s.Db.QueryRow("SELECT id FROM users WHERE name = $1", userName).Scan(&userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Get clothe_id
    var clotheID int
    err = s.Db.QueryRow("SELECT id FROM clothes WHERE name = $1", clotheName).Scan(&clotheID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Insert into purchased_clothes table
    _, err = s.Db.Exec("INSERT INTO purchased_clothes (user_id, clothe_id) VALUES ($1, $2)", userID, clotheID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Write([]byte("Successfully added to purchased clothes"))
}

func (s *Server)AddLikedClothe(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    claims, httpStatus := LoadClaimsFromJwt(w, r)
    if httpStatus != 200 {
        return
    }
    userName := claims.Name
    clotheName := r.FormValue("clothe_name")

    // Get user_id
    var userID int
    err := s.Db.QueryRow("SELECT id FROM users WHERE name = $1", userName).Scan(&userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Get clothe_id
    var clotheID int
    err = s.Db.QueryRow("SELECT id FROM clothes WHERE name = $1", clotheName).Scan(&clotheID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Delete from disliked_clothes table if exists
    _, err = s.Db.Exec("DELETE FROM disliked_clothes WHERE user_id = $1 AND clothe_id = $2", userID, clotheID)
    // Insert into liked_clothes table
    _, err = s.Db.Exec("INSERT INTO liked_clothes (user_id, clothe_id) VALUES ($1, $2)", userID, clotheID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    w.Write([]byte("Successfully added to liked clothes"))
}


func (s *Server)AddDislikedClothe(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    claims, httpStatus := LoadClaimsFromJwt(w, r)
    if httpStatus != 200 {
        return
    }
    userName := claims.Name
    clotheName := r.FormValue("clothe_name")

    // Get user_id
    var userID int
    err := s.Db.QueryRow("SELECT id FROM users WHERE name = $1", userName).Scan(&userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Get clothe_id
    var clotheID int
    err = s.Db.QueryRow("SELECT id FROM clothes WHERE name = $1", clotheName).Scan(&clotheID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Delete from liked_clothes table if exists
    _, err = s.Db.Exec("DELETE FROM liked_clothes WHERE user_id = $1 AND clothe_id = $2", userID, clotheID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Insert into disliked_clothes table
    _, err = s.Db.Exec("INSERT INTO disliked_clothes (user_id, clothe_id) VALUES ($1, $2)", userID, clotheID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Write([]byte("Successfully added to disliked clothes"))
}

func (s *Server)DeletePurchasedClothe(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    claims, httpStatus := LoadClaimsFromJwt(w, r)
    if httpStatus != 200 {
        return
    }
    userName := claims.Name
    clotheName := r.FormValue("clothe_name")

    // Get user_id
    var userID int
    err := s.Db.QueryRow("SELECT id FROM users WHERE name = $1", userName).Scan(&userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Get clothe_id
    var clotheID int
    err = s.Db.QueryRow("SELECT id FROM clothes WHERE name = $1", clotheName).Scan(&clotheID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Delete from purchased_clothes table
    _, err = s.Db.Exec("DELETE FROM purchased_clothes WHERE user_id = $1 AND clothe_id = $2", userID, clotheID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Write([]byte("Successfully deleted from purchased clothes"))
}

func (s *Server)DeleteDislikedClothe(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    claims, httpStatus := LoadClaimsFromJwt(w, r)
    if httpStatus != 200 {
        return
    }
    userName := claims.Name
    clotheName := r.FormValue("clothe_name")

    // Get user_id
    var userID int
    err := s.Db.QueryRow("SELECT id FROM users WHERE name = $1", userName).Scan(&userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Get clothe_id
    var clotheID int
    err = s.Db.QueryRow("SELECT id FROM clothes WHERE name = $1", clotheName).Scan(&clotheID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Delete from disliked_clothes table
    _, err = s.Db.Exec("DELETE FROM disliked_clothes WHERE user_id = $1 AND clothe_id = $2", userID, clotheID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Write([]byte("Successfully deleted from disliked clothes"))
}

func (s *Server)DeleteLikedClothe(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    claims, httpStatus := LoadClaimsFromJwt(w, r)
    if httpStatus != 200 {
        return
    }
    userName := claims.Name
    clotheName := r.FormValue("clothe_name")

    // Get user_id
    var userID int
    err := s.Db.QueryRow("SELECT id FROM users WHERE name = $1", userName).Scan(&userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Get clothe_id
    var clotheID int
    err = s.Db.QueryRow("SELECT id FROM clothes WHERE name = $1", clotheName).Scan(&clotheID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Delete from liked_clothes table
    _, err = s.Db.Exec("DELETE FROM liked_clothes WHERE user_id = $1 AND clothe_id = $2", userID, clotheID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Write([]byte("Successfully deleted from liked clothes"))
}
