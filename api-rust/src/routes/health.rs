//! Health check endpoint

use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use worker::*;

/// Health check response
#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct HealthResponse {
    /// Status message
    pub status: String,
}

/// Health check endpoint
#[utoipa::path(
    get,
    path = "/api/v1/health",
    tag = "Health",
    responses(
        (status = 200, description = "Service is healthy", body = HealthResponse)
    )
)]
pub async fn health_check(_req: Request, _ctx: RouteContext<()>) -> Result<Response> {
    Response::from_json(&HealthResponse {
        status: "healthy".to_string(),
    })
}
