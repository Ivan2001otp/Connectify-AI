package middleware

import (
	"log"
	"net/http"
	"sync"

	"golang.org/x/time/rate"
)

var (
	limiter     = rate.NewLimiter(0.5, 1) // 1 request every 2 second.
	limiterLock sync.Mutex
)

func GlobalRateLimiterMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		limiterLock.Lock()

		defer limiterLock.Unlock()

		if !limiter.Allow() {
			log.Println("Rate limit, we are throttling now.")
			http.Error(w, "Rate Limit Exceeded. Try again later", http.StatusTooManyRequests)
			return
		}

		next.ServeHTTP(w, r)
	})
}
