package api

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
)

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
    }
    if skeletalTypeRequest.FingerJointSize == "小さめ" {
        straightScore += 1
    } else if skeletalTypeRequest.FingerJointSize == "ふつう" {
        waveScore += 1
    } else if skeletalTypeRequest.FingerJointSize == "大きい" {
        naturalScore += 1
    }
    if skeletalTypeRequest.WristShape == "断面にすると丸に近い形" {
        straightScore += 1
    } else if skeletalTypeRequest.WristShape == "幅が広くてうすく、断面にすると平べったい形" {
        waveScore += 1
    } else if skeletalTypeRequest.WristShape == "骨が目立ち、しっかりしている" {
        naturalScore += 1
    }
    if skeletalTypeRequest.WristAnkcle == "ほとんど見えないくらい小さい" {
        straightScore += 1
    } else if skeletalTypeRequest.WristAnkcle == "ふつうに見える程度の大きさ" {
        waveScore += 1
    } else if skeletalTypeRequest.WristAnkcle == "とてもはっきり出ている、または大きい" {
        naturalScore += 1
    }
    if skeletalTypeRequest.ClavicleImpression == "ほとんど見えないくらい小さい" {
        straightScore += 1
    } else if skeletalTypeRequest.ClavicleImpression == "見えるが細め" {
        waveScore += 1
    } else if skeletalTypeRequest.ClavicleImpression == "大きくしっかりしている" {
        naturalScore += 1
    }
    if skeletalTypeRequest.KneecapImpression == "小さめで、あまり存在感がない" {
        straightScore += 1
    } else if skeletalTypeRequest.KneecapImpression == "中くらいの大きさ、触ると前に出ている" {
        waveScore += 1
    } else if skeletalTypeRequest.KneecapImpression == "大きい" {
        naturalScore += 1
    }
    if skeletalTypeRequest.UnsuitableClothe == "スキニーパンツ" {
        straightScore += 1
    } else if skeletalTypeRequest.UnsuitableClothe == "革ジャケット" {
        waveScore += 1
    } else if skeletalTypeRequest.UnsuitableClothe == "無地の小さめのTシャツ" {
        naturalScore += 1
    }
    var skeletalType string
    if straightScore > waveScore && straightScore > naturalScore {
        skeletalType = "ストレート"
    } else if waveScore > straightScore && waveScore > naturalScore {
        skeletalType = "ウェーブ"
    } else {
        skeletalType = "ナチュラル"
    }
    queryToUpdateSkeletalTypeAndGender := fmt.Sprintf("UPDATE users SET does_have_skeletal_type = TRUE, gender = '%s', skeletal_type = '%s'", skeletalTypeRequest.Gender, skeletalType)
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
