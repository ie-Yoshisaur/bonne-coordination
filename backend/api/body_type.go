package api

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
)

type BodyTypeRequest struct {
    Gender string `json:"gender"`
    BodyImpression string `json:"bodyImpression"`
    FingerJointSize string `json:"fingerJointSize"`
    WristShape string `json:"wristShape"`
    WristAnkcle string `json:"wristAnkcle"`
    ClavicleImpression string `json:"clavicleImpression"`
    KneecapImpression string `json:"kneecapImpression"`
    UnsuitableClothe string `json:"unsuitableClothe"`
}

type BodyTypeResponse struct {
    BodyType string `json:"bodyType"`
}

func (s *Server) GetBodyType(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    var bodyTypeRequest BodyTypeRequest
    decoder := json.NewDecoder(r.Body)
    decodeError := decoder.Decode(&bodyTypeRequest)
    if decodeError != nil {
        log.Println("[ERROR]", decodeError)
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    if bodyTypeRequest.Gender != "男性" && bodyTypeRequest.Gender != "女性" {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    straightScore := 0
    waveScore := 0
    naturalScore := 0
    if bodyTypeRequest.BodyImpression == "厚みがあり、肉厚的" {
        straightScore += 1
    } else if bodyTypeRequest.BodyImpression == "厚みは少なく、すらりとしている" {
        waveScore += 1
    } else if bodyTypeRequest.BodyImpression == "骨や筋が目立つ" {
        naturalScore += 1
    }
    if bodyTypeRequest.FingerJointSize == "小さめ" {
        straightScore += 1
    } else if bodyTypeRequest.FingerJointSize == "ふつう" {
        waveScore += 1
    } else if bodyTypeRequest.FingerJointSize == "大きい" {
        naturalScore += 1
    }
    if bodyTypeRequest.WristShape == "断面にすると丸に近い形" {
        straightScore += 1
    } else if bodyTypeRequest.WristShape == "幅が広くてうすく、断面にすると平べったい形" {
        waveScore += 1
    } else if bodyTypeRequest.WristShape == "骨が目立ち、しっかりしている" {
        naturalScore += 1
    }
    if bodyTypeRequest.WristAnkcle == "ほとんど見えないくらい小さい" {
        straightScore += 1
    } else if bodyTypeRequest.WristAnkcle == "ふつうに見える程度の大きさ" {
        waveScore += 1
    } else if bodyTypeRequest.WristAnkcle == "とてもはっきり出ている、または大きい" {
        naturalScore += 1
    }
    if bodyTypeRequest.ClavicleImpression == "ほとんど見えないくらい小さい" {
        straightScore += 1
    } else if bodyTypeRequest.ClavicleImpression == "見えるが細め" {
        waveScore += 1
    } else if bodyTypeRequest.ClavicleImpression == "大きくしっかりしている" {
        naturalScore += 1
    }
    if bodyTypeRequest.KneecapImpression == "小さめで、あまり存在感がない" {
        straightScore += 1
    } else if bodyTypeRequest.KneecapImpression == "中くらいの大きさ、触ると前に出ている" {
        waveScore += 1
    } else if bodyTypeRequest.KneecapImpression == "大きい" {
        naturalScore += 1
    }
    if bodyTypeRequest.UnsuitableClothe == "スキニーパンツ" {
        straightScore += 1
    } else if bodyTypeRequest.UnsuitableClothe == "革ジャケット" {
        waveScore += 1
    } else if bodyTypeRequest.UnsuitableClothe == "無地の小さめのTシャツ" {
        naturalScore += 1
    }
    var bodyType string
    if straightScore > waveScore && straightScore > naturalScore {
        bodyType = "ストレート"
    } else if waveScore > straightScore && waveScore > naturalScore {
        bodyType = "ウェーブ"
    } else {
        bodyType = "ナチュラル"
    }
    queryToUpdateBodyTypeAndGender := fmt.Sprintf("UPDATE users SET does_have_body_type = TRUE, gender = '%s', body_type = '%s'", bodyTypeRequest.Gender, bodyType)
    _, queryRrror := s.Db.Exec(queryToUpdateBodyTypeAndGender)
    if queryRrror != nil {
        log.Println("[ERROR]", queryRrror)
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    response := BodyTypeResponse{BodyType: bodyType}
    responseJson, err := json.Marshal(response)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.Write(responseJson)
}
