//! Supabase client for database operations
//!
//! Uses Supabase's REST API (PostgREST) directly since there's no official Rust SDK.

use crate::error::ApiError;
use serde::{de::DeserializeOwned, Serialize};
use worker::Env;

pub struct SupabaseClient {
    url: String,
    service_key: String,
    user_token: Option<String>,
}

impl SupabaseClient {
    /// Create a service-role client (bypasses RLS)
    pub fn service_client(env: &Env) -> Result<Self, ApiError> {
        let url = env
            .secret("SUPABASE_URL")
            .map_err(|_| ApiError::Internal("SUPABASE_URL not set".to_string()))?
            .to_string();

        let service_key = env
            .secret("SUPABASE_SERVICE_ROLE_KEY")
            .map_err(|_| ApiError::Internal("SUPABASE_SERVICE_ROLE_KEY not set".to_string()))?
            .to_string();

        Ok(Self {
            url,
            service_key,
            user_token: None,
        })
    }

    /// Create a user client (respects RLS)
    pub fn user_client(env: &Env, user_token: &str) -> Result<Self, ApiError> {
        let url = env
            .secret("SUPABASE_URL")
            .map_err(|_| ApiError::Internal("SUPABASE_URL not set".to_string()))?
            .to_string();

        let anon_key = env
            .secret("SUPABASE_ANON_KEY")
            .map_err(|_| ApiError::Internal("SUPABASE_ANON_KEY not set".to_string()))?
            .to_string();

        Ok(Self {
            url,
            service_key: anon_key,
            user_token: Some(user_token.to_string()),
        })
    }

    fn rest_url(&self, table: &str) -> String {
        format!("{}/rest/v1/{}", self.url, table)
    }

    fn auth_headers(&self) -> Vec<(&str, String)> {
        let mut headers = vec![
            ("apikey", self.service_key.clone()),
            ("Content-Type", "application/json".to_string()),
        ];

        if let Some(token) = &self.user_token {
            headers.push(("Authorization", format!("Bearer {}", token)));
        } else {
            headers.push(("Authorization", format!("Bearer {}", self.service_key)));
        }

        headers
    }

    /// Select rows from a table
    pub async fn select<T: DeserializeOwned>(
        &self,
        table: &str,
        query: &str,
    ) -> Result<Vec<T>, ApiError> {
        let url = format!("{}?{}", self.rest_url(table), query);

        let mut init = web_sys::RequestInit::new();
        init.method("GET");

        // Note: In a real implementation, you'd use worker's Fetch API
        // This is a simplified version showing the pattern

        // For Workers, we use the Fetch API
        let mut headers = worker::Headers::new();
        for (key, value) in self.auth_headers() {
            headers.set(key, &value).map_err(|e| ApiError::Internal(e.to_string()))?;
        }

        let request = worker::Request::new_with_init(
            &url,
            worker::RequestInit::new()
                .with_method(worker::Method::Get)
                .with_headers(headers),
        )
        .map_err(|e| ApiError::Internal(e.to_string()))?;

        let mut response = worker::Fetch::Request(request)
            .send()
            .await
            .map_err(|e| ApiError::Supabase(e.to_string()))?;

        if !response.status_code().is_success() {
            let error_text = response.text().await.unwrap_or_default();
            return Err(ApiError::Supabase(error_text));
        }

        let data: Vec<T> = response
            .json()
            .await
            .map_err(|e| ApiError::Supabase(e.to_string()))?;

        Ok(data)
    }

    /// Insert a row into a table
    pub async fn insert<T: Serialize, R: DeserializeOwned>(
        &self,
        table: &str,
        data: &T,
    ) -> Result<R, ApiError> {
        let url = self.rest_url(table);
        let body = serde_json::to_string(data)?;

        let mut headers = worker::Headers::new();
        for (key, value) in self.auth_headers() {
            headers.set(key, &value).map_err(|e| ApiError::Internal(e.to_string()))?;
        }
        headers.set("Prefer", "return=representation").unwrap();

        let request = worker::Request::new_with_init(
            &url,
            worker::RequestInit::new()
                .with_method(worker::Method::Post)
                .with_headers(headers)
                .with_body(Some(body.into())),
        )
        .map_err(|e| ApiError::Internal(e.to_string()))?;

        let mut response = worker::Fetch::Request(request)
            .send()
            .await
            .map_err(|e| ApiError::Supabase(e.to_string()))?;

        if !response.status_code().is_success() {
            let error_text = response.text().await.unwrap_or_default();
            return Err(ApiError::Supabase(error_text));
        }

        let result: Vec<R> = response
            .json()
            .await
            .map_err(|e| ApiError::Supabase(e.to_string()))?;

        result
            .into_iter()
            .next()
            .ok_or_else(|| ApiError::Internal("No data returned from insert".to_string()))
    }

    /// Update rows in a table
    pub async fn update<T: Serialize, R: DeserializeOwned>(
        &self,
        table: &str,
        query: &str,
        data: &T,
    ) -> Result<Vec<R>, ApiError> {
        let url = format!("{}?{}", self.rest_url(table), query);
        let body = serde_json::to_string(data)?;

        let mut headers = worker::Headers::new();
        for (key, value) in self.auth_headers() {
            headers.set(key, &value).map_err(|e| ApiError::Internal(e.to_string()))?;
        }
        headers.set("Prefer", "return=representation").unwrap();

        let request = worker::Request::new_with_init(
            &url,
            worker::RequestInit::new()
                .with_method(worker::Method::Patch)
                .with_headers(headers)
                .with_body(Some(body.into())),
        )
        .map_err(|e| ApiError::Internal(e.to_string()))?;

        let mut response = worker::Fetch::Request(request)
            .send()
            .await
            .map_err(|e| ApiError::Supabase(e.to_string()))?;

        if !response.status_code().is_success() {
            let error_text = response.text().await.unwrap_or_default();
            return Err(ApiError::Supabase(error_text));
        }

        response
            .json()
            .await
            .map_err(|e| ApiError::Supabase(e.to_string()))
    }

    /// Delete rows from a table
    pub async fn delete(&self, table: &str, query: &str) -> Result<(), ApiError> {
        let url = format!("{}?{}", self.rest_url(table), query);

        let mut headers = worker::Headers::new();
        for (key, value) in self.auth_headers() {
            headers.set(key, &value).map_err(|e| ApiError::Internal(e.to_string()))?;
        }

        let request = worker::Request::new_with_init(
            &url,
            worker::RequestInit::new()
                .with_method(worker::Method::Delete)
                .with_headers(headers),
        )
        .map_err(|e| ApiError::Internal(e.to_string()))?;

        let response = worker::Fetch::Request(request)
            .send()
            .await
            .map_err(|e| ApiError::Supabase(e.to_string()))?;

        if !response.status_code().is_success() {
            return Err(ApiError::NotFound("Item not found".to_string()));
        }

        Ok(())
    }
}

/// Helper to extract user token from request
pub fn get_user_token(req: &worker::Request) -> Option<String> {
    req.headers()
        .get("Authorization")
        .ok()
        .flatten()
        .and_then(|h| h.strip_prefix("Bearer ").map(|s| s.to_string()))
}
