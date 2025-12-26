//! User profile endpoints

use crate::auth::require_auth;
use crate::models::user::{UserProfile, UserProfileDb};
use crate::supabase::{get_user_token, SupabaseClient};
use worker::*;

/// Get the current user's profile
#[utoipa::path(
    get,
    path = "/api/v1/user/profile",
    tag = "User",
    responses(
        (status = 200, description = "User profile", body = UserProfile),
        (status = 401, description = "Unauthorized")
    ),
    security(("bearer_auth" = []))
)]
pub async fn get_profile(req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let user_id = match require_auth(&req, &ctx.env) {
        Ok(id) => id,
        Err(e) => return Ok(e.to_response()),
    };

    let token = get_user_token(&req).unwrap_or_default();
    let client = match SupabaseClient::user_client(&ctx.env, &token) {
        Ok(c) => c,
        Err(e) => return Ok(e.to_response()),
    };

    let query = format!("id=eq.{}&select=*", user_id);
    let profiles: Vec<UserProfileDb> = match client.select("user_profiles", &query).await {
        Ok(p) => p,
        Err(e) => return Ok(e.to_response()),
    };

    match profiles.into_iter().next() {
        Some(profile) => Response::from_json(&UserProfile::from(profile)),
        None => {
            // Return minimal profile if no extended profile exists
            Response::from_json(&UserProfile {
                id: user_id,
                email: String::new(),
                full_name: None,
                created_at: String::new(),
            })
        }
    }
}
