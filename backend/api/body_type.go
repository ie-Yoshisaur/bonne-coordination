package api

import (
    "encoding/json"
    "log"
    "net/http"
)

type BodyTypeRequest struct {
    Gender string `json:"gender"`
    BodyImpression string `json:"bodyImpression"`
    UnsuitableClothe string `json:"unsuitableClothe"`
    HandImpression string `json:"handImpression"`
    LegImpression string `json:"legImpression"`
    ButtocksImpression string `json:"buttocksImpression"`
    NeckImpression string `json:"neckImpression"`
    MuscleImpression string `json:"muscleImpression"`
}

type BodyTypeResponse struct {
    BodyType string `json:"bodyType"`
}

func (s *Server) GetBodyType(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    claims, httpStatus := LoadClaimsFromJwt(w, r)
    if httpStatus != 200 {
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
    if bodyTypeRequest.BodyImpression == "あばら骨の縦幅が気になる" {
        straightScore += 1
    } else if bodyTypeRequest.BodyImpression == "お尻が横に広い" {
        waveScore += 1
    } else if bodyTypeRequest.BodyImpression == "肩のラインの骨が目立つ" {
        naturalScore += 1
    }
    if bodyTypeRequest.UnsuitableClothe == "タイトな服を着るとお腹が出て見える" {
        straightScore += 1
    } else if bodyTypeRequest.UnsuitableClothe == "オーバーサイズの服だと着太りする" {
        waveScore += 1
    } else if bodyTypeRequest.UnsuitableClothe == "タイトな服を着ると骨感でゴツくなる" {
        naturalScore += 1
    }
    if bodyTypeRequest.HandImpression == "指よりも手のひらが長い" {
        straightScore += 1
    } else if bodyTypeRequest.HandImpression == "手のひらが薄い" {
        waveScore += 1
    } else if bodyTypeRequest.HandImpression == "指が長めで、関節が大きい" {
        naturalScore += 1
    }
    if bodyTypeRequest.LegImpression == "ふくらはぎから足首のラインにメリハリがある" {
        straightScore += 1
    } else if bodyTypeRequest.LegImpression == "太ももの付け根が横に張り出している" {
        waveScore += 1
    } else if bodyTypeRequest.LegImpression == "膝の皿が大きく、アキレス腱が太い" {
        naturalScore += 1
    }
    if bodyTypeRequest.ButtocksImpression == "上向きに丸い" {
        straightScore += 1
    } else if bodyTypeRequest.ButtocksImpression == "下向きに丸い" {
        waveScore += 1
    } else if bodyTypeRequest.ButtocksImpression == "真っ直ぐ" {
        naturalScore += 1
    }
    if bodyTypeRequest.NeckImpression == "首が短い" {
        straightScore += 1
    } else if bodyTypeRequest.NeckImpression == "首が細く長い" {
        waveScore += 1
    } else if bodyTypeRequest.NeckImpression == "首が太め" {
        naturalScore += 1
    }
    if bodyTypeRequest.MuscleImpression == "筋肉が付きやすい" {
        straightScore += 1
    } else if bodyTypeRequest.MuscleImpression == "筋肉が付きにくい" {
        waveScore += 1
    } else if bodyTypeRequest.MuscleImpression == "全体的に骨太である" {
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
    _, queryRrror := s.Db.Exec("UPDATE users SET does_have_body_type = TRUE, gender = $1, body_type = $2 WHERE name = $3", bodyTypeRequest.Gender, bodyType, claims.Name)
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
