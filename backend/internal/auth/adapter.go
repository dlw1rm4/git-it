// just me playing around with different providers
AUTH_PROVIDER = supabase|cognito|azure

type AuthAdapter interface {
	Register(ctx, credentials) (*User, error)
	Login(ctx, credentials) (*User, *TokenPair, error)
	Logout(ctx, accessToken) error
	RefreshToken(ctx, refreshToken) (*TokenPair, error)
	ValidateToken(ctx, accessToken) (*User, error)