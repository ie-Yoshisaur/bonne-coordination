module skeleton/backend

go 1.19

replace skeleton/api => ./api

require skeleton/api v0.0.0-00010101000000-000000000000

require (
	github.com/dgrijalva/jwt-go v3.2.0+incompatible // indirect
	github.com/lib/pq v1.10.7 // indirect
)
