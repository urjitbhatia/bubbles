//! Error types for the API

use thiserror::Error;
use worker::Response;

#[derive(Error, Debug)]
pub enum ApiError {
    #[error("Not found: {0}")]
    NotFound(String),

    #[error("Unauthorized: {0}")]
    Unauthorized(String),

    #[error("Bad request: {0}")]
    BadRequest(String),

    #[error("Internal error: {0}")]
    Internal(String),

    #[error("Supabase error: {0}")]
    Supabase(String),
}

impl ApiError {
    pub fn status_code(&self) -> u16 {
        match self {
            ApiError::NotFound(_) => 404,
            ApiError::Unauthorized(_) => 401,
            ApiError::BadRequest(_) => 400,
            ApiError::Internal(_) | ApiError::Supabase(_) => 500,
        }
    }

    pub fn to_response(&self) -> Response {
        let body = serde_json::json!({
            "error": self.to_string()
        });

        Response::from_json(&body)
            .unwrap()
            .with_status(self.status_code())
    }
}

impl From<worker::Error> for ApiError {
    fn from(err: worker::Error) -> Self {
        ApiError::Internal(err.to_string())
    }
}

impl From<serde_json::Error> for ApiError {
    fn from(err: serde_json::Error) -> Self {
        ApiError::BadRequest(err.to_string())
    }
}
