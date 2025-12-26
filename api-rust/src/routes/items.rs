//! Items CRUD endpoints

use crate::auth::require_auth;
use crate::error::ApiError;
use crate::models::item::{Item, ItemCreate, ItemDb, ItemList};
use crate::supabase::{get_user_token, SupabaseClient};
use serde::Deserialize;
use uuid::Uuid;
use worker::*;

#[derive(Deserialize)]
struct ListQuery {
    page: Option<i32>,
    limit: Option<i32>,
}

/// List items for the current user
#[utoipa::path(
    get,
    path = "/api/v1/items",
    tag = "Items",
    params(
        ("page" = Option<i32>, Query, description = "Page number (default: 1)"),
        ("limit" = Option<i32>, Query, description = "Items per page (default: 10, max: 100)")
    ),
    responses(
        (status = 200, description = "List of items", body = ItemList),
        (status = 401, description = "Unauthorized")
    ),
    security(("bearer_auth" = []))
)]
pub async fn list_items(req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let user_id = match require_auth(&req, &ctx.env) {
        Ok(id) => id,
        Err(e) => return Ok(e.to_response()),
    };

    let url = req.url()?;
    let query: ListQuery = url
        .query_pairs()
        .fold(ListQuery { page: None, limit: None }, |mut q, (k, v)| {
            match k.as_ref() {
                "page" => q.page = v.parse().ok(),
                "limit" => q.limit = v.parse().ok(),
                _ => {}
            }
            q
        });

    let page = query.page.unwrap_or(1).max(1);
    let limit = query.limit.unwrap_or(10).clamp(1, 100);
    let offset = (page - 1) * limit;

    let token = get_user_token(&req).unwrap_or_default();
    let client = match SupabaseClient::user_client(&ctx.env, &token) {
        Ok(c) => c,
        Err(e) => return Ok(e.to_response()),
    };

    // Query items with pagination
    let query_str = format!(
        "select=*&order=created_at.desc&offset={}&limit={}",
        offset, limit
    );

    let items: Vec<ItemDb> = match client.select("items", &query_str).await {
        Ok(items) => items,
        Err(e) => return Ok(e.to_response()),
    };

    // Get total count (simplified - in production, use a count query)
    let total = items.len() as i64;

    let response = ItemList {
        items: items.into_iter().map(Item::from).collect(),
        total,
        page,
        limit,
    };

    Response::from_json(&response)
}

/// Get a specific item by ID
#[utoipa::path(
    get,
    path = "/api/v1/items/{item_id}",
    tag = "Items",
    params(
        ("item_id" = String, Path, description = "Item ID")
    ),
    responses(
        (status = 200, description = "Item details", body = Item),
        (status = 401, description = "Unauthorized"),
        (status = 404, description = "Item not found")
    ),
    security(("bearer_auth" = []))
)]
pub async fn get_item(req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let _user_id = match require_auth(&req, &ctx.env) {
        Ok(id) => id,
        Err(e) => return Ok(e.to_response()),
    };

    let item_id = ctx.param("item_id").unwrap();

    let token = get_user_token(&req).unwrap_or_default();
    let client = match SupabaseClient::user_client(&ctx.env, &token) {
        Ok(c) => c,
        Err(e) => return Ok(e.to_response()),
    };

    let query = format!("id=eq.{}&select=*", item_id);
    let items: Vec<ItemDb> = match client.select("items", &query).await {
        Ok(items) => items,
        Err(e) => return Ok(e.to_response()),
    };

    match items.into_iter().next() {
        Some(item) => Response::from_json(&Item::from(item)),
        None => Ok(ApiError::NotFound("Item not found".to_string()).to_response()),
    }
}

/// Create a new item
#[utoipa::path(
    post,
    path = "/api/v1/items",
    tag = "Items",
    request_body = ItemCreate,
    responses(
        (status = 201, description = "Item created", body = Item),
        (status = 401, description = "Unauthorized"),
        (status = 400, description = "Invalid request")
    ),
    security(("bearer_auth" = []))
)]
pub async fn create_item(mut req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let user_id = match require_auth(&req, &ctx.env) {
        Ok(id) => id,
        Err(e) => return Ok(e.to_response()),
    };

    let body: ItemCreate = match req.json().await {
        Ok(b) => b,
        Err(e) => return Ok(ApiError::BadRequest(e.to_string()).to_response()),
    };

    let token = get_user_token(&req).unwrap_or_default();
    let client = match SupabaseClient::user_client(&ctx.env, &token) {
        Ok(c) => c,
        Err(e) => return Ok(e.to_response()),
    };

    #[derive(serde::Serialize)]
    struct NewItem {
        id: String,
        name: String,
        description: Option<String>,
        user_id: String,
    }

    let new_item = NewItem {
        id: Uuid::new_v4().to_string(),
        name: body.name,
        description: body.description,
        user_id,
    };

    let created: ItemDb = match client.insert("items", &new_item).await {
        Ok(item) => item,
        Err(e) => return Ok(e.to_response()),
    };

    Response::from_json(&Item::from(created)).map(|r| r.with_status(201))
}

/// Update an existing item
#[utoipa::path(
    patch,
    path = "/api/v1/items/{item_id}",
    tag = "Items",
    params(
        ("item_id" = String, Path, description = "Item ID")
    ),
    request_body = ItemCreate,
    responses(
        (status = 200, description = "Item updated", body = Item),
        (status = 401, description = "Unauthorized"),
        (status = 404, description = "Item not found")
    ),
    security(("bearer_auth" = []))
)]
pub async fn update_item(mut req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let _user_id = match require_auth(&req, &ctx.env) {
        Ok(id) => id,
        Err(e) => return Ok(e.to_response()),
    };

    let item_id = ctx.param("item_id").unwrap();

    let body: ItemCreate = match req.json().await {
        Ok(b) => b,
        Err(e) => return Ok(ApiError::BadRequest(e.to_string()).to_response()),
    };

    let token = get_user_token(&req).unwrap_or_default();
    let client = match SupabaseClient::user_client(&ctx.env, &token) {
        Ok(c) => c,
        Err(e) => return Ok(e.to_response()),
    };

    let query = format!("id=eq.{}", item_id);
    let updated: Vec<ItemDb> = match client.update("items", &query, &body).await {
        Ok(items) => items,
        Err(e) => return Ok(e.to_response()),
    };

    match updated.into_iter().next() {
        Some(item) => Response::from_json(&Item::from(item)),
        None => Ok(ApiError::NotFound("Item not found".to_string()).to_response()),
    }
}

/// Delete an item
#[utoipa::path(
    delete,
    path = "/api/v1/items/{item_id}",
    tag = "Items",
    params(
        ("item_id" = String, Path, description = "Item ID")
    ),
    responses(
        (status = 204, description = "Item deleted"),
        (status = 401, description = "Unauthorized"),
        (status = 404, description = "Item not found")
    ),
    security(("bearer_auth" = []))
)]
pub async fn delete_item(req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let _user_id = match require_auth(&req, &ctx.env) {
        Ok(id) => id,
        Err(e) => return Ok(e.to_response()),
    };

    let item_id = ctx.param("item_id").unwrap();

    let token = get_user_token(&req).unwrap_or_default();
    let client = match SupabaseClient::user_client(&ctx.env, &token) {
        Ok(c) => c,
        Err(e) => return Ok(e.to_response()),
    };

    let query = format!("id=eq.{}", item_id);
    match client.delete("items", &query).await {
        Ok(_) => Response::empty().map(|r| r.with_status(204)),
        Err(e) => Ok(e.to_response()),
    }
}
