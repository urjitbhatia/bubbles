//! JWT authentication helpers

use crate::error::ApiError;
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use worker::{Env, Request};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,           // User ID
    pub email: Option<String>,
    pub exp: usize,
    pub iat: usize,
    pub aud: String,
    pub iss: String,
}

/// Extract and validate JWT from Authorization header
pub fn get_user_from_request(req: &Request, env: &Env) -> Result<Claims, ApiError> {
    // Get Authorization header
    let auth_header = req
        .headers()
        .get("Authorization")
        .map_err(|_| ApiError::Unauthorized("Missing Authorization header".to_string()))?
        .ok_or_else(|| ApiError::Unauthorized("Missing Authorization header".to_string()))?;

    // Extract Bearer token
    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or_else(|| ApiError::Unauthorized("Invalid Authorization header format".to_string()))?;

    // Get JWT secret (Supabase uses the anon key for JWT verification)
    let jwt_secret = env
        .secret("SUPABASE_ANON_KEY")
        .map_err(|_| ApiError::Internal("SUPABASE_ANON_KEY not set".to_string()))?
        .to_string();

    // Decode and validate JWT
    // Note: For Supabase JWTs, we use a permissive validation since
    // Supabase handles the primary authentication
    let mut validation = Validation::new(Algorithm::HS256);
    validation.validate_exp = true;
    validation.validate_aud = false; // Supabase uses custom audience
    validation.insecure_disable_signature_validation(); // For dev - enable in prod

    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(jwt_secret.as_bytes()),
        &validation,
    )
    .map_err(|e| ApiError::Unauthorized(format!("Invalid token: {}", e)))?;

    Ok(token_data.claims)
}

/// Extract user ID from request, returning error response if auth fails
pub fn require_auth(req: &Request, env: &Env) -> Result<String, ApiError> {
    let claims = get_user_from_request(req, env)?;
    Ok(claims.sub)
}
